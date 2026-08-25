import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { getSocket } from '../services/socket';
import { useAuth } from './AuthContext';

/**
 * Voice calling and friend presence.
 *
 * Lives at the app root so an incoming call rings wherever the user happens to
 * be, not only on the chat screen.
 *
 * The audio is peer-to-peer WebRTC — it never reaches our server. The socket
 * only carries the handshake: an SDP offer, an SDP answer, and the ICE
 * candidates the two browsers use to find a path to each other.
 *
 * Two limits worth knowing:
 *  - STUN only, no TURN. If both peers sit behind symmetric NAT (some mobile
 *    carriers, strict corporate wifi) they cannot find a direct path and the
 *    call fails. Fixing that needs a TURN relay, which is a paid service.
 *  - getUserMedia needs a secure context: it works on localhost and over
 *    HTTPS, but NOT on a plain http:// LAN address. Testing on a phone
 *    against http://192.168.x.x will fail at the microphone permission step.
 */

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' }
];

/** idle → calling/ringing → connecting → active → (back to idle) */
const CallContext = createContext(null);

export function useCall() {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error('useCall must be used inside <CallProvider>');
  return ctx;
}

const ENDED_REASONS = {
  declined: 'Call declined',
  busy: 'They are on another call',
  'no-answer': 'No answer',
  hangup: 'Call ended',
  disconnected: 'They lost connection',
  failed: 'Call failed to connect'
};

export function CallProvider({ children }) {
  const { user } = useAuth();

  const [socket] = useState(() => getSocket());
  const [connected, setConnected] = useState(false);
  const [myUserId, setMyUserId] = useState(null);
  const [onlineFriends, setOnlineFriends] = useState([]);

  // status: 'idle' | 'calling' | 'ringing' | 'connecting' | 'active'
  const [call, setCall] = useState(null);
  const [status, setStatus] = useState('idle');
  const [muted, setMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [lastEndReason, setLastEndReason] = useState(null);
  const [mediaError, setMediaError] = useState(null);

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  /** ICE can arrive before the remote description is set; hold those. */
  const pendingCandidatesRef = useRef([]);
  const callRef = useRef(null);

  useEffect(() => { callRef.current = call; }, [call]);

  /* ------------------------------------------------------ teardown ---- */

  const teardown = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.onicecandidate = null;
      pcRef.current.ontrack = null;
      pcRef.current.onconnectionstatechange = null;
      try { pcRef.current.close(); } catch (_) { /* already closed */ }
      pcRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    pendingCandidatesRef.current = [];
    setMuted(false);
    setSeconds(0);
  }, []);

  const endLocally = useCallback((reason) => {
    teardown();
    setStatus('idle');
    setCall(null);
    if (reason) setLastEndReason(ENDED_REASONS[reason] || 'Call ended');
  }, [teardown]);

  /* --------------------------------------------- peer connection ------ */

  const buildPeerConnection = useCallback((callId) => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('call:signal', { callId, data: { candidate: e.candidate } });
      }
    };

    pc.ontrack = (e) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = e.streams[0];
        // Autoplay can be blocked; the call UI is a user gesture away so this
        // normally succeeds, and a rejection is not fatal to the call.
        remoteAudioRef.current.play?.().catch(() => {});
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') setStatus('active');
      if (pc.connectionState === 'failed') {
        socket.emit('call:end', { callId });
        endLocally('failed');
      }
    };

    pcRef.current = pc;
    return pc;
  }, [socket, endLocally]);

  /** Ask for the mic. Returns null and sets a readable error on refusal. */
  const openMicrophone = useCallback(async () => {
    setMediaError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setMediaError(
        window.isSecureContext
          ? 'This browser does not support voice calls.'
          : 'Voice calls need a secure connection (https or localhost).'
      );
      return null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false
      });
      localStreamRef.current = stream;
      return stream;
    } catch (err) {
      const message =
        err.name === 'NotAllowedError'
          ? 'Microphone blocked. Allow mic access in your browser settings, then try again.'
          : err.name === 'NotFoundError'
            ? 'No microphone found on this device.'
            : 'Could not open the microphone.';
      setMediaError(message);
      return null;
    }
  }, []);

  const drainPendingCandidates = useCallback(async (pc) => {
    const queued = pendingCandidatesRef.current;
    pendingCandidatesRef.current = [];
    for (const candidate of queued) {
      try { await pc.addIceCandidate(candidate); } catch (_) { /* stale candidate */ }
    }
  }, []);

  /* ------------------------------------------------- socket wiring ---- */

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      socket.emit('chat:register', {}, (res) => {
        if (res?.ok) {
          setMyUserId(res.userId);
          setOnlineFriends(res.onlineFriends || []);
        }
      });
    };

    const onDisconnect = () => {
      setConnected(false);
      // A dropped socket means signalling is gone; do not leave a dead call up.
      if (callRef.current) endLocally('disconnected');
    };

    const onPresence = ({ userId, online }) => {
      setOnlineFriends((prev) => {
        const set = new Set(prev.map(Number));
        if (online) set.add(Number(userId));
        else set.delete(Number(userId));
        return [...set];
      });
    };

    const onIncoming = ({ callId, roomId, from }) => {
      // Already busy locally: decline rather than stack two calls.
      if (callRef.current) {
        socket.emit('call:reject', { callId, reason: 'busy' });
        return;
      }
      setLastEndReason(null);
      setCall({ callId, roomId, peer: from, direction: 'incoming' });
      setStatus('ringing');
    };

    const onAccepted = async ({ callId }) => {
      const current = callRef.current;
      if (!current || current.callId !== callId) return;

      setStatus('connecting');
      const stream = await openMicrophone();
      if (!stream) {
        socket.emit('call:end', { callId });
        endLocally();
        return;
      }

      const pc = buildPeerConnection(callId);
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      try {
        const offer = await pc.createOffer({ offerToReceiveAudio: true });
        await pc.setLocalDescription(offer);
        socket.emit('call:signal', { callId, data: { description: pc.localDescription } });
      } catch (err) {
        socket.emit('call:end', { callId });
        endLocally('failed');
      }
    };

    const onSignal = async ({ callId, data }) => {
      const current = callRef.current;
      if (!current || current.callId !== callId) return;

      // The callee builds its peer connection when the offer lands.
      let pc = pcRef.current;

      if (data.description) {
        if (data.description.type === 'offer') {
          if (!pc) {
            const stream = localStreamRef.current || (await openMicrophone());
            if (!stream) {
              socket.emit('call:end', { callId });
              endLocally();
              return;
            }
            pc = buildPeerConnection(callId);
            stream.getTracks().forEach((t) => pc.addTrack(t, stream));
          }

          await pc.setRemoteDescription(new RTCSessionDescription(data.description));
          await drainPendingCandidates(pc);

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('call:signal', { callId, data: { description: pc.localDescription } });
        } else if (data.description.type === 'answer' && pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.description));
          await drainPendingCandidates(pc);
        }
        return;
      }

      if (data.candidate) {
        const candidate = new RTCIceCandidate(data.candidate);
        if (pc && pc.remoteDescription) {
          try { await pc.addIceCandidate(candidate); } catch (_) { /* stale */ }
        } else {
          pendingCandidatesRef.current.push(candidate);
        }
      }
    };

    const onEnded = ({ callId, reason }) => {
      const current = callRef.current;
      if (!current || current.callId !== callId) return;
      endLocally(reason);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('presence:update', onPresence);
    socket.on('call:incoming', onIncoming);
    socket.on('call:accepted', onAccepted);
    socket.on('call:signal', onSignal);
    socket.on('call:ended', onEnded);

    if (socket.connected) onConnect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('presence:update', onPresence);
      socket.off('call:incoming', onIncoming);
      socket.off('call:accepted', onAccepted);
      socket.off('call:signal', onSignal);
      socket.off('call:ended', onEnded);
    };
  }, [socket, buildPeerConnection, openMicrophone, drainPendingCandidates, endLocally]);

  // Re-register when the signed-in user changes, so presence follows the login.
  useEffect(() => {
    if (!socket.connected) return;
    socket.emit('chat:register', {}, (res) => {
      if (res?.ok) {
        setMyUserId(res.userId);
        setOnlineFriends(res.onlineFriends || []);
      }
    });
  }, [socket, user?.id]);

  /* ------------------------------------------------------- timer ------ */

  useEffect(() => {
    if (status !== 'active') return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  /* ------------------------------------------------------ actions ----- */

  /** Ring a friend. The mic is not opened until they actually pick up. */
  const startCall = useCallback((peer, roomId) => {
    if (!peer?.id || !roomId) return;
    setLastEndReason(null);
    setMediaError(null);

    // Socket.IO silently buffers emits while disconnected, so the ack would
    // never arrive and the button would look broken. Say so instead.
    if (!socket.connected) {
      setLastEndReason('Not connected to the server. Check your connection and try again.');
      return;
    }

    let answered = false;
    const timeout = setTimeout(() => {
      if (!answered) setLastEndReason('The server did not respond. Try again.');
    }, 8000);

    socket.emit('call:invite', { roomId, toUserId: peer.id }, (res) => {
      answered = true;
      clearTimeout(timeout);
      if (!res?.ok) {
        setLastEndReason(res?.error || 'Could not start the call.');
        return;
      }
      setCall({
        callId: res.callId,
        roomId,
        peer: { id: peer.id, name: peer.full_name || peer.name, avatar: peer.avatar_url },
        direction: 'outgoing'
      });
      setStatus('calling');
    });
  }, [socket]);

  const acceptCall = useCallback(async () => {
    const current = callRef.current;
    if (!current || status !== 'ringing') return;

    // Open the mic before accepting: if permission is refused there is no
    // point telling the caller we picked up.
    const stream = await openMicrophone();
    if (!stream) {
      socket.emit('call:reject', { callId: current.callId, reason: 'failed' });
      endLocally();
      return;
    }

    setStatus('connecting');
    socket.emit('call:accept', { callId: current.callId });
  }, [socket, status, openMicrophone, endLocally]);

  const declineCall = useCallback(() => {
    const current = callRef.current;
    if (!current) return;
    socket.emit('call:reject', { callId: current.callId, reason: 'declined' });
    endLocally();
  }, [socket, endLocally]);

  const hangUp = useCallback(() => {
    const current = callRef.current;
    if (!current) return;
    socket.emit('call:end', { callId: current.callId });
    endLocally();
  }, [socket, endLocally]);

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const next = !muted;
    stream.getAudioTracks().forEach((t) => { t.enabled = !next; });
    setMuted(next);
  }, [muted]);

  const isFriendOnline = useCallback(
    (id) => onlineFriends.map(Number).includes(Number(id)),
    [onlineFriends]
  );

  const dismissNotice = useCallback(() => {
    setLastEndReason(null);
    setMediaError(null);
  }, []);

  // Stop the mic if the provider ever unmounts (full page teardown).
  useEffect(() => teardown, [teardown]);

  return (
    <CallContext.Provider
      value={{
        socket,
        connected,
        myUserId,
        onlineFriends,
        isFriendOnline,
        call,
        status,
        muted,
        seconds,
        lastEndReason,
        mediaError,
        startCall,
        acceptCall,
        declineCall,
        hangUp,
        toggleMute,
        dismissNotice
      }}
    >
      {children}
      {/* The single sink for the other person's audio, kept mounted for the
          lifetime of the app so a re-render never drops the stream. */}
      <audio ref={remoteAudioRef} autoPlay playsInline />
    </CallContext.Provider>
  );
}
