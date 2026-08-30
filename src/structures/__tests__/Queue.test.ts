import { describe, it, expect, beforeEach } from 'vitest';
import { Queue } from '../Queue';

describe('Queue (FIFO Data Structure)', () => {
  let queue: Queue<string>;

  beforeEach(() => {
    queue = new Queue<string>();
  });

  it('starts empty with size 0', () => {
    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);
    expect(queue.peek()).toBeNull();
    expect(queue.dequeue()).toBeNull();
  });

  it('enqueues items in strict FIFO order', () => {
    queue.enqueue('Ticket #1');
    queue.enqueue('Ticket #2');
    queue.enqueue('Ticket #3');

    expect(queue.size()).toBe(3);
    expect(queue.isEmpty()).toBe(false);
    expect(queue.peek()).toBe('Ticket #1');

    expect(queue.dequeue()).toBe('Ticket #1');
    expect(queue.size()).toBe(2);
    expect(queue.peek()).toBe('Ticket #2');

    expect(queue.dequeue()).toBe('Ticket #2');
    expect(queue.dequeue()).toBe('Ticket #3');
    expect(queue.dequeue()).toBeNull();
    expect(queue.isEmpty()).toBe(true);
  });

  it('supports enqueueFront for undo/rollback operations', () => {
    queue.enqueue('Ticket #2');
    queue.enqueue('Ticket #3');
    queue.enqueueFront('Ticket #1 (Restored)');

    expect(queue.size()).toBe(3);
    expect(queue.peek()).toBe('Ticket #1 (Restored)');
    expect(queue.dequeue()).toBe('Ticket #1 (Restored)');
    expect(queue.dequeue()).toBe('Ticket #2');
    expect(queue.dequeue()).toBe('Ticket #3');
  });

  it('correctly serializes to array and node visual list', () => {
    queue.enqueue('A');
    queue.enqueue('B');
    queue.enqueue('C');

    expect(queue.toArray()).toEqual(['A', 'B', 'C']);

    const visualNodes = queue.toVisualNodes();
    expect(visualNodes).toHaveLength(3);
    expect(visualNodes[0].isHead).toBe(true);
    expect(visualNodes[0].isTail).toBe(false);
    expect(visualNodes[2].isHead).toBe(false);
    expect(visualNodes[2].isTail).toBe(true);
  });

  it('removes item by predicate from head, middle, and tail', () => {
    queue.enqueue('A');
    queue.enqueue('B');
    queue.enqueue('C');
    queue.enqueue('D');

    // Remove middle
    const removedMiddle = queue.remove((item) => item === 'B');
    expect(removedMiddle).toBe('B');
    expect(queue.toArray()).toEqual(['A', 'C', 'D']);
    expect(queue.size()).toBe(3);

    // Remove head
    const removedHead = queue.remove((item) => item === 'A');
    expect(removedHead).toBe('A');
    expect(queue.toArray()).toEqual(['C', 'D']);
    expect(queue.size()).toBe(2);

    // Remove tail
    const removedTail = queue.remove((item) => item === 'D');
    expect(removedTail).toBe('D');
    expect(queue.toArray()).toEqual(['C']);
    expect(queue.size()).toBe(1);

    // Clear
    queue.clear();
    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);
  });
});
