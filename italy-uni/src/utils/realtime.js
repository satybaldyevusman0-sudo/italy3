// Realtime: BroadcastChannel аркылуу бардык ачык барактар (вкладкалар)
// ортосунда окуялар дароо жеткирилет. Firebase/Socket.io'го алмаштыруу оңой:
// emit() жана subscribe() функцияларынын ичин гана өзгөртүү жетиштүү.
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('studyitalia') : null;
const listeners = new Set();

export function emit(type, payload = {}) {
  const event = { type, payload, at: Date.now() };
  channel?.postMessage(event);
  listeners.forEach((fn) => fn(event, true));
}

export function subscribe(fn) {
  listeners.add(fn);
  const handler = (e) => fn(e.data, false);
  channel?.addEventListener('message', handler);
  return () => {
    listeners.delete(fn);
    channel?.removeEventListener('message', handler);
  };
}
