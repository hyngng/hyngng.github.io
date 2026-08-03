import { describe, it, expect } from 'vitest';
import {
  distributeByWeight,
  cardWeight,
  NO_IMG_HEIGHT,
  GAP,
  IMG_ASPECT,
} from './distribution';

describe('cardWeight', () => {
  it('returns NO_IMG_HEIGHT for cards without an image', () => {
    expect(cardWeight(false, 400)).toBe(NO_IMG_HEIGHT);
  });

  it('adds the proportional image height for cards with an image', () => {
    expect(cardWeight(true, 400)).toBe(400 * IMG_ASPECT + NO_IMG_HEIGHT);
  });
});

describe('distributeByWeight', () => {
  it('puts the first item on the left column', () => {
    const { left, right } = distributeByWeight(['a'], 400, () => false);
    expect(left).toEqual(['a']);
    expect(right).toEqual([]);
  });

  it('distributes every item to exactly one column', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f'];
    const { left, right } = distributeByWeight(items, 300, () => true);
    expect([...left, ...right].sort()).toEqual([...items].sort());
  });

  it('keeps the columns roughly balanced', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const hasImage = (i: string) => i.charCodeAt(0) % 2 === 0;
    const colWidth = 300;
    const maxW = Math.max(...items.map((i) => cardWeight(hasImage(i), colWidth)));
    const { leftWeight, rightWeight } = distributeByWeight(items, colWidth, hasImage);
    expect(Math.abs(leftWeight - rightWeight)).toBeLessThanOrEqual(NO_IMG_HEIGHT + GAP + maxW);
  });
});
