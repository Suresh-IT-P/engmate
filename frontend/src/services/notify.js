import { Capacitor, registerPlugin } from '@capacitor/core';

/**
 * Strong alerts for friend activity: a sound and a vibration while the app is
 * in front of you, and a system notification (heads-up on Android, an OS
 * notification in a browser) when it is not, which takes you to the right
 * screen when tapped.
 *
 * Limit worth knowing: these come from the app's live connection, so they
 * arrive while the app is open or recently backgrounded. Once Android freezes
 * or closes the app, only server push (Firebase Cloud Messaging) can reach it.
 */

/** Native heads-up notifications on Android (FriendNotifyPlugin.java). */
const FriendNotify = registerPlugin('FriendNotify');
const isNative = Capacitor.isPluginAvailable('FriendNotify');

let initialised = false;
let tapHandler = null;
let audioCtx = null;

/* ------------------------------------------------------------ sound --- */

function audio() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

/** Synthesised, so there are no sound files to ship: [Hz, start s, length s]. */
const TONES = {
  message: [[880, 0, 0.12], [1320, 0.14, 0.18]],
  invite: [[659, 0, 0.16], [880, 0.18, 0.16], [1319, 0.36, 0.3]]
};

export function playTone(kind) {
  try {
    const ac = audio();
    if (!ac) return;
    if (ac.state === 'suspended') ac.resume().catch(() => {});
    const now = ac.currentTime + 0.01;
    for (const [freq, at, len] of TONES[kind] || []) {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now + at);
      gain.gain.exponentialRampToValueAtTime(0.4, now + at + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + at + len);
      osc.connect(gain).connect(ac.destination);
      osc.start(now + at);
      osc.stop(now + at + len + 0.02);
    }
  } catch (_) { /* sound is a nicety */ }
}

const VIBRATIONS = {
  message: [70, 50, 70],
  invite: [300, 120, 300, 120, 500]
};

export function vibrate(kind) {
  try { navigator.vibrate?.(VIBRATIONS[kind] || 60); } catch (_) { /* not supported */ }
}

/* -------------------------------------------------- system notices --- */

/** Whether the user is looking at the app right now. */
export function isAppInFront() {
  return document.visibilityState === 'visible' && document.hasFocus();
}

/** Stable 31-bit id, so a newer alert for the same chat replaces the old one. */
function idFor(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return Math.abs(h) % 2147483647 || 1;
}

async function systemNotify({ key, title, body, url }) {
  if (isNative) {
    try {
      await FriendNotify.show({ id: idFor(key), title, body, url });
    } catch (_) { /* permission refused */ }
    return;
  }
  if ('Notification' in window && Notification.permission === 'granted') {
    const n = new Notification(title, { body, tag: key, renotify: true, icon: '/logo.png' });
    n.onclick = () => { window.focus(); tapHandler?.(url); n.close(); };
  }
}

/**
 * Alert the user to friend activity. In front: sound and vibration (the
 * caller shows the in-app pop-up). Away: a system notification, which brings
 * its own sound and vibration.
 */
export function alertUser({ kind, key, title, body, url }) {
  if (isAppInFront()) {
    playTone(kind);
    vibrate(kind);
  } else {
    systemNotify({ key, title, body, url });
  }
}

/* ------------------------------------------------------------ setup --- */

/** Where a tapped notification should take the user. */
export function setNotificationTapHandler(fn) {
  tapHandler = fn;
}

/**
 * One-time setup after sign-in: the notification permission prompt, the tap
 * handler, and the audio unlock browsers require before a page may make sound.
 * (The Android channel is created natively when the app starts.)
 */
export async function initNotifications() {
  if (initialised) return;
  initialised = true;

  const onFirstGesture = () => {
    audio()?.resume?.().catch(() => {});
    if (!isNative && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  };
  window.addEventListener('pointerdown', onFirstGesture, { once: true, capture: true });

  if (!isNative) return;
  try {
    // Subscribe first: a tap that cold-started the app is waiting to be read.
    await FriendNotify.addListener('notificationTap', ({ url }) => tapHandler?.(url));
    await FriendNotify.requestPermission();
  } catch (_) { /* refused: in-app alerts still work */ }
}
