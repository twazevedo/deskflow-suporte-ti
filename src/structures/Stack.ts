import { ListNode } from './Node';

/**
 * Pilha Genérica Pura LIFO (Last-In, First-Out) implementada com Nós Encadeados.
 * Complexidade de Tempo:
 * - push (Empilhar no Topo): O(1)
 * - pop (Desempilhar do Topo): O(1)
 * - peek (Consultar Topo): O(1)
 * - size (Tamanho): O(1)
 * - isEmpty (Está vazia): O(1)
 */
export class Stack<T> {
  private topNode: ListNode<T> | null = null;
  private count: number = 0;

  /**
   * Insere um novo elemento no Topo da pilha.
   * Complexidade: O(1)
   */
  public push(value: T): void {
    const newNode = new ListNode<T>(value);
    newNode.next = this.topNode;
    if (this.topNode) {
      this.topNode.prev = newNode;
    }
    this.topNode = newNode;
    this.count++;
  }

  /**
   * Remove e retorna o elemento do Topo da pilha.
   * Complexidade: O(1)
   */
  public pop(): T | null {
    if (this.isEmpty() || !this.topNode) {
      return null;
    }

    const removedNode = this.topNode;
    const removedValue = removedNode.value;
    this.topNode = this.topNode.next;

    if (this.topNode) {
      this.topNode.prev = null;
    }

    removedNode.next = null;
    removedNode.prev = null;

    this.count--;
    return removedValue;
  }

  /**
   * Consulta o elemento do Topo sem removê-lo.
   * Complexidade: O(1)
   */
  public peek(): T | null {
    return this.topNode ? this.topNode.value : null;
  }

  /**
   * Retorna a quantidade total de elementos na pilha.
   * Complexidade: O(1)
   */
  public size(): number {
    return this.count;
  }

  /**
   * Verifica se a pilha está vazia.
   * Complexidade: O(1)
   */
  public isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Esvazia completamente a pilha.
   * Complexidade: O(1)
   */
  public clear(): void {
    let current = this.topNode;
    while (current) {
      const nextNode = current.next;
      current.prev = null;
      current.next = null;
      current = nextNode;
    }
    this.topNode = null;
    this.count = 0;
  }

  /**
   * Retorna os elementos em formato de array ordenados do Topo até a Base.
   * Complexidade: O(n)
   */
  public toArray(): T[] {
    const result: T[] = [];
    let current = this.topNode;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  /**
   * Retorna os nós com identificadores de memória para o inspetor visual.
   */
  public toVisualNodes(): Array<{
    id: string;
    value: T;
    isTop: boolean;
    isBase: boolean;
    nextId: string | null;
  }> {
    const nodes = [];
    let current = this.topNode;
    while (current) {
      nodes.push({
        id: current.id,
        value: current.value,
        isTop: current === this.topNode,
        isBase: current.next === null,
        nextId: current.next ? current.next.id : null,
      });
      current = current.next;
    }
    return nodes;
  }
}
