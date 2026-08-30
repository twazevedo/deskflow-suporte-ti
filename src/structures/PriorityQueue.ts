import { ListNode } from './Node';

export interface PriorityItem<T> {
  data: T;
  priority: number; // 1 = Crítico / VIP, 2 = Alta, 3 = Média, 4 = Baixa
  sequenceId: number;
}

/**
 * Fila de Prioridade com desempate estrito FIFO para prioridades iguais.
 * Implementada internamente como uma Lista Duplamente Encadeada Ordenada.
 * Complexidade:
 * - dequeue (Desenfileirar Maior Prioridade): O(1)
 * - peek (Consultar Maior Prioridade): O(1)
 * - enqueue (Inserção Ordenada): O(n) pior caso, O(1) melhor caso (novo head ou tail)
 * - size / isEmpty: O(1)
 */
export class PriorityQueue<T> {
  private head: ListNode<PriorityItem<T>> | null = null;
  private tail: ListNode<PriorityItem<T>> | null = null;
  private count: number = 0;
  private sequenceCounter: number = 0;

  /**
   * Insere um elemento conforme prioridade (menor número = maior urgência).
   * Mantém a ordem de chegada (FIFO) em caso de empate na prioridade.
   */
  public enqueue(value: T, priority: number): void {
    const item: PriorityItem<T> = {
      data: value,
      priority,
      sequenceId: ++this.sequenceCounter,
    };

    const newNode = new ListNode<PriorityItem<T>>(item);

    if (this.isEmpty() || !this.head) {
      this.head = newNode;
      this.tail = newNode;
      this.count++;
      return;
    }

    // Caso 1: Prioridade estritamente maior que o Head atual (novo início)
    if (priority < this.head.value.priority) {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
      this.count++;
      return;
    }

    // Caso 2: Percorre a lista até encontrar a posição correta (preserva FIFO para prioridades iguais)
    let current = this.head;
    while (current.next && current.next.value.priority <= priority) {
      current = current.next;
    }

    // Insere após o nó 'current'
    newNode.next = current.next;
    newNode.prev = current;

    if (current.next) {
      current.next.prev = newNode;
    } else {
      this.tail = newNode;
    }

    current.next = newNode;
    this.count++;
  }

  /**
   * Remove e retorna o elemento de maior prioridade (Head da lista).
   * Complexidade: O(1)
   */
  public dequeue(): T | null {
    if (this.isEmpty() || !this.head) {
      return null;
    }

    const removedNode = this.head;
    const removedItem = removedNode.value.data;
    this.head = this.head.next;

    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }

    removedNode.next = null;
    removedNode.prev = null;

    this.count--;
    return removedItem;
  }

  /**
   * Consulta o item de maior prioridade sem removê-lo.
   * Complexidade: O(1)
   */
  public peek(): T | null {
    return this.head ? this.head.value.data : null;
  }

  public peekPriority(): number | null {
    return this.head ? this.head.value.priority : null;
  }

  public size(): number {
    return this.count;
  }

  public isEmpty(): boolean {
    return this.count === 0;
  }

  public clear(): void {
    let current = this.head;
    while (current) {
      const nextNode = current.next;
      current.prev = null;
      current.next = null;
      current = nextNode;
    }
    this.head = null;
    this.tail = null;
    this.count = 0;
  }

  /**
   * Remove um elemento por predicado preservando os ponteiros duplos.
   */
  public remove(predicate: (item: T) => boolean): T | null {
    let current = this.head;

    while (current) {
      if (predicate(current.value.data)) {
        if (current === this.head) {
          return this.dequeue();
        }

        if (current === this.tail) {
          const val = current.value.data;
          this.tail = current.prev;
          if (this.tail) {
            this.tail.next = null;
          } else {
            this.head = null;
          }
          current.prev = null;
          current.next = null;
          this.count--;
          return val;
        }

        const prevNode = current.prev;
        const nextNode = current.next;
        if (prevNode) prevNode.next = nextNode;
        if (nextNode) nextNode.prev = prevNode;

        current.prev = null;
        current.next = null;

        this.count--;
        return current.value.data;
      }
      current = current.next;
    }

    return null;
  }

  public toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value.data);
      current = current.next;
    }
    return result;
  }

  public toItems(): PriorityItem<T>[] {
    const result: PriorityItem<T>[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  public toVisualNodes(): Array<{
    id: string;
    value: T;
    priority: number;
    isHead: boolean;
    isTail: boolean;
  }> {
    const nodes = [];
    let current = this.head;
    while (current) {
      nodes.push({
        id: current.id,
        value: current.value.data,
        priority: current.value.priority,
        isHead: current === this.head,
        isTail: current === this.tail,
      });
      current = current.next;
    }
    return nodes;
  }
}
