import { distance } from "../../simplekit/utility";

export function hitTestCircle(
  mx: number,
  my: number,
  x: number,
  y: number,
  r: number,
  isFilled: boolean,
  isStroked: boolean
) {
  if (isFilled) {
    if (distance(mx, my, x, y) <= r) return true;
  }
  if (isStroked) {
    if (distance(mx, my, x, y) <= r) return true;
  }
  return false;
}
