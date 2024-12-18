/**
 * https://easings.net/#easeOutBack
 * returns x value on a 0 - 1 scale, overshooting on the top end
 * @param t number representing time value between 0 & 1
 */
export function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
