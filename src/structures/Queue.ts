import { ListNode } from './Node';

/**
 * Fila Genérica Pura FIFO (First-In, First-Out) implementada com Lista Duplamente Encadeada.
 * Complexidade de Tempo:
 * - enqueue (Enfileirar no Fim/Tail): O(1)
 * - dequeue (Desenfileirar do Início/Head): O(1)
 * - enqueueFront (Inserir no Início/Head - Rollback de Desfazer): O(1)
 * - peek (Consultar Primeiro): O(1)
 * - size (Tamanho): O(1)
 * - isEmpty (Está vazia): O(1)
 */
export class Queue<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private count: number = 0;

  /**
   * Insere um novo elemento no final da fila (Tail).
   * Complexidade: O(1)
   */
  public enqueue(value: T): void {
    const newNode = new ListNode<T>(value);

    if (this.isEmpty() || !this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.count++;
  }

  /**
   * Insere um elemento diretamente no início da fila (Head).
   * Fundamental para operações de Desfazer/Rollback (devolve um chamado cancelado para a primeira posição).
   * Complexidade: O(1)
   */
  public enqueueFront(value: T): void {
    const newNode = new ListNode<T>(value);

    if (this.isEmpty() || !this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }

    this.count++;
  }

  /**
   * Remove e retorna o primeiro elemento da fila (Head).
   * Complexidade: O(1)
   */
  public dequeue(): T | null {
    if (this.isEmpty() || !this.head) {
      return null;
    }

    const removedNode = this.head;
    const removedValue = removedNode.value;
    this.head = this.head.next;

    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }

    // Desconecta os ponteiros do nó removido para descarte limpo pelo Garbage Collector
    removedNode.next = null;
    removedNode.prev = null;

    this.count--;
    return removedValue;
  }

  /**
   * Consulta o primeiro elemento sem removê-lo.
   * Complexidade: O(1)
   */
  public peek(): T | null {
    return this.head ? this.head.value : null;
  }

  /**
   * Retorna a quantidade de elementos na fila.
   * Complexidade: O(1)
   */
  public size(): number {
    return this.count;
  }

  /**
   * Verifica se a fila está vazia.
   * Complexidade: O(1)
   */
  public isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Esvazia completamente a fila e reinicializa os ponteiros.
   * Complexidade: O(1)
   */
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
   * Remove um elemento específico por predicado realizando emenda de ponteiros.
   * Complexidade: O(n) busca + O(1) splice
   */
  public remove(predicate: (item: T) => boolean): T | null {
    let current = this.head;

    while (current) {
      if (predicate(current.value)) {
        if (current === this.head) {
          return this.dequeue();
        }

        if (current === this.tail) {
          const val = current.value;
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

        // Nó intermediário
        const prevNode = current.prev;
        const nextNode = current.next;

        if (prevNode) prevNode.next = nextNode;
        if (nextNode) nextNode.prev = prevNode;

        current.prev = null;
        current.next = null;

        this.count--;
        return current.value;
      }
      current = current.next;
    }

    return null;
  }

  /**
   * Converte a fila em um vetor ordenado para renderização na interface.
   * Complexidade: O(n)
   */
  public toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  /**
   * Retorna representações gráficas dos nós com ponteiros de memória para o inspetor visual.
   */
  public toVisualNodes(): Array<{
    id: string;
    value: T;
    isHead: boolean;
    isTail: boolean;
    nextId: string | null;
    prevId: string | null;
  }> {
    const nodes = [];
    let current = this.head;
    while (current) {
      nodes.push({
        id: current.id,
        value: current.value,
        isHead: current === this.head,
        isTail: current === this.tail,
        nextId: current.next ? current.next.id : null,
        prevId: current.prev ? current.prev.id : null,
      });
      current = current.next;
    }
    return nodes;
  }
}
