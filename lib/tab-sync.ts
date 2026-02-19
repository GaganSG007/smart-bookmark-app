// Simple BroadcastChannel helper to sync bookmark events across tabs
let bc: BroadcastChannel | null = null;

function getChannel() {
  if (typeof window === "undefined") return null;
  if (!('BroadcastChannel' in window)) return null;
  if (!bc) bc = new BroadcastChannel('smart-bookmark-channel');
  return bc;
}

export function postTabMessage(message: any) {
  const ch = getChannel();
  try {
    ch?.postMessage(message);
  } catch (err) {
    // ignore
  }
}

export function onTabMessage(cb: (message: any) => void) {
  const ch = getChannel();
  if (!ch) return () => {};
  const handler = (ev: MessageEvent) => cb(ev.data);
  ch.addEventListener('message', handler);
  return () => ch.removeEventListener('message', handler);
}
