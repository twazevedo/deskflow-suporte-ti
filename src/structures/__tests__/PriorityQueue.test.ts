import { describe, it, expect, beforeEach } from 'vitest';
import { PriorityQueue } from '../PriorityQueue';

describe('PriorityQueue (Priority + FIFO Tie-breaking)', () => {
  let pq: PriorityQueue<string>;

  beforeEach(() => {
    pq = new PriorityQueue<string>();
  });

  it('starts empty with size 0', () => {
    expect(pq.isEmpty()).toBe(true);
    expect(pq.size()).toBe(0);
    expect(pq.peek()).toBeNull();
    expect(pq.dequeue()).toBeNull();
  });

  it('dequeues highest priority elements first (1 = Critical, 4 = Low)', () => {
    pq.enqueue('Low Task', 4);
    pq.enqueue('Critical Task', 1);
    pq.enqueue('Medium Task', 3);
    pq.enqueue('High Task', 2);

    expect(pq.size()).toBe(4);
    expect(pq.peek()).toBe('Critical Task');

    expect(pq.dequeue()).toBe('Critical Task');
    expect(pq.dequeue()).toBe('High Task');
    expect(pq.dequeue()).toBe('Medium Task');
    expect(pq.dequeue()).toBe('Low Task');
    expect(pq.isEmpty()).toBe(true);
  });

  it('preserves FIFO order for elements with identical priority', () => {
    pq.enqueue('Medium 1', 3);
    pq.enqueue('Critical 1', 1);
    pq.enqueue('Medium 2', 3);
    pq.enqueue('Critical 2', 1);
    pq.enqueue('Medium 3', 3);

    expect(pq.dequeue()).toBe('Critical 1');
    expect(pq.dequeue()).toBe('Critical 2');
    expect(pq.dequeue()).toBe('Medium 1');
    expect(pq.dequeue()).toBe('Medium 2');
    expect(pq.dequeue()).toBe('Medium 3');
    expect(pq.isEmpty()).toBe(true);
  });

  it('removes matching item by predicate correctly', () => {
    pq.enqueue('Task A', 2);
    pq.enqueue('Task B', 1);
    pq.enqueue('Task C', 3);

    const removed = pq.remove((val) => val === 'Task B');
    expect(removed).toBe('Task B');
    expect(pq.size()).toBe(2);
    expect(pq.toArray()).toEqual(['Task A', 'Task C']);
  });
});
