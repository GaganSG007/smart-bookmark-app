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

// localStorage fallback for browsers or cases where BroadcastChannel is throttled
const LS_KEY = 'smart-bookmark-sync';

export function postTabStorage(message: any) {
  try {
    const payload = JSON.stringify({ v: 1, t: Date.now(), message });
    // use a short-lived key to trigger storage event
    localStorage.setItem(LS_KEY, payload);
    // cleanup to avoid clutter
    setTimeout(() => {
      try {
        const cur = localStorage.getItem(LS_KEY);
        if (cur === payload) localStorage.removeItem(LS_KEY);
      } catch (e) {}
    }, 500);
  } catch (err) {
    // ignore
  }
}

export function onTabStorage(cb: (message: any) => void) {
  const handler = (ev: StorageEvent) => {
    if (ev.key !== LS_KEY) return;
    try {
      if (!ev.newValue) return;
      const parsed = JSON.parse(ev.newValue);
      cb(parsed.message);
    } catch (err) {
      // ignore
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}
