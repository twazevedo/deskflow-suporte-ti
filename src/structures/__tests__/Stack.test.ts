import { describe, it, expect, beforeEach } from 'vitest';
import { Stack } from '../Stack';

describe('Stack (LIFO Data Structure)', () => {
  let stack: Stack<string>;

  beforeEach(() => {
    stack = new Stack<string>();
  });

  it('starts empty with size 0', () => {
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size()).toBe(0);
    expect(stack.peek()).toBeNull();
    expect(stack.pop()).toBeNull();
  });

  it('pushes and pops items in strict LIFO order', () => {
    stack.push('Action 1');
    stack.push('Action 2');
    stack.push('Action 3');

    expect(stack.size()).toBe(3);
    expect(stack.peek()).toBe('Action 3');

    expect(stack.pop()).toBe('Action 3');
    expect(stack.size()).toBe(2);
    expect(stack.peek()).toBe('Action 2');

    expect(stack.pop()).toBe('Action 2');
    expect(stack.pop()).toBe('Action 1');
    expect(stack.pop()).toBeNull();
    expect(stack.isEmpty()).toBe(true);
  });

  it('correctly serializes from top to base', () => {
    stack.push('Base');
    stack.push('Middle');
    stack.push('Top');

    expect(stack.toArray()).toEqual(['Top', 'Middle', 'Base']);

    const visualNodes = stack.toVisualNodes();
    expect(visualNodes).toHaveLength(3);
    expect(visualNodes[0].isTop).toBe(true);
    expect(visualNodes[2].isBase).toBe(true);
  });
});
