/**
 * Generic Doubly Linked Node for O(1) Queues, Stacks, and Lists.
 * Allows forward and backward pointer traversal without array re-indexing penalties.
 */
export class ListNode<T> {
  public value: T;
  public next: ListNode<T> | null = null;
  public prev: ListNode<T> | null = null;
  public readonly id: string;
  public readonly createdAt: number;

  constructor(value: T) {
    this.value = value;
    this.createdAt = Date.now();
    
    // Cryptographically secure ID with robust fallback
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      this.id = `node-${crypto.randomUUID().substring(0, 8)}`;
    } else {
      this.id = `node-${Math.random().toString(36).substring(2, 10)}`;
    }
  }
}

