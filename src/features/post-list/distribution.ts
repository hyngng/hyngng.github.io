export const NO_IMG_HEIGHT = 136;
export const IMG_ASPECT = 21 / 40;
export const GAP = 20;
export const SSR_COL_WIDTH = 438;

export function cardWeight(hasImage: boolean, colWidth: number): number {
  return hasImage ? colWidth * IMG_ASPECT + NO_IMG_HEIGHT : NO_IMG_HEIGHT;
}

export function distributeByWeight<T>(
  items: T[],
  colWidth: number,
  hasImage: (item: T) => boolean,
): { left: T[]; right: T[]; leftWeight: number; rightWeight: number } {
  const left: T[] = [];
  const right: T[] = [];
  let leftH = 0;
  let rightH = 0;

  for (const item of items) {
    const w = cardWeight(hasImage(item), colWidth);
    const diff = leftH - rightH;

    if (diff > NO_IMG_HEIGHT) {
      right.push(item);
      rightH += w + GAP;
    } else if (diff < -NO_IMG_HEIGHT) {
      left.push(item);
      leftH += w + GAP;
    } else if (leftH <= rightH) {
      left.push(item);
      leftH += w + GAP;
    } else {
      right.push(item);
      rightH += w + GAP;
    }
  }

  return { left, right, leftWeight: leftH, rightWeight: rightH };
}
