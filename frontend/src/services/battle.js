/**
 * Grammar Battle helpers shared by the battle screen and the friend chat.
 */

/**
 * The per-tab id the battle server uses to recognise a returning player.
 * A room created from the chat must use the same id as the battle screen, or
 * the creator would arrive in their own lobby as a stranger instead of host.
 */
export function getBattleSessionId() {
  let sid = sessionStorage.getItem('grammar_battle_sid');
  if (!sid) {
    sid = Math.random().toString(36).substring(2, 10);
    sessionStorage.setItem('grammar_battle_sid', sid);
  }
  return sid;
}

/*
 * The room this tab is seated in. The battle screen sets it on joining and
 * clears it on leaving; the rest of the app reads it to offer a way back after
 * an accidental Back press, since leaving the screen does not leave the room.
 */
const ACTIVE_KEY = 'activeRoomId';
export const ACTIVE_BATTLE_EVENT = 'battle:active-change';

export function getActiveBattle() {
  try { return sessionStorage.getItem(ACTIVE_KEY); } catch (_) { return null; }
}

export function setActiveBattle(roomId) {
  try { sessionStorage.setItem(ACTIVE_KEY, roomId); } catch (_) { /* private mode */ }
  window.dispatchEvent(new Event(ACTIVE_BATTLE_EVENT));
}

export function clearActiveBattle() {
  try { sessionStorage.removeItem(ACTIVE_KEY); } catch (_) { /* private mode */ }
  window.dispatchEvent(new Event(ACTIVE_BATTLE_EVENT));
}

/**
 * Create a battle room on the shared socket and resolve with its code.
 * `create_room` has no ack, so this waits for the `room_created` (or `error`)
 * reply and detaches its own listeners either way.
 */
export function createBattleRoom(socket, {
  playerName, topic, secondsPerQuestion = 10, questionCount = 10
}) {
  return new Promise((resolve, reject) => {
    if (!socket?.connected) {
      reject(new Error('Not connected to the game server. Try again in a moment.'));
      return;
    }

    let timer = null;
    const finish = () => {
      clearTimeout(timer);
      socket.off('room_created', onCreated);
      socket.off('error', onError);
    };
    const onCreated = (meta) => { finish(); resolve(meta.roomId); };
    const onError = (msg) => {
      finish();
      reject(new Error(typeof msg === 'string' ? msg : 'Could not create the battle room.'));
    };
    timer = setTimeout(() => onError('The game server did not answer. Try again.'), 8000);

    socket.on('room_created', onCreated);
    socket.on('error', onError);
    socket.emit('create_room', {
      playerName,
      sessionId: getBattleSessionId(),
      topic: topic?.id || 'mixed',
      topicTitle: topic?.title || 'Mixed Challenge',
      secondsPerQuestion,
      questionCount
    });
  });
}
