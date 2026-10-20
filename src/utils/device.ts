/** True on phones/tablets where the primary pointer is a finger. */
export const isTouchDevice = (): boolean =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(pointer: coarse)').matches || navigator.maxTouchPoints > 0);
