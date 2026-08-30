import { Stack } from './Stack';
import { DeskAction } from '../types/action';

/**
 * ActionHistoryManager handles multi-level Undo & Redo operations using dual LIFO Stacks.
 * Every reversible action in the IT Service Desk is pushed onto the Undo Stack.
 * Undoing an action pops it from Undo Stack and pushes onto the Redo Stack.
 */
export class ActionHistoryManager {
  private undoStack: Stack<DeskAction>;
  private redoStack: Stack<DeskAction>;
  private maxHistorySize: number;

  constructor(maxHistorySize: number = 50) {
    this.undoStack = new Stack<DeskAction>();
    this.redoStack = new Stack<DeskAction>();
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Records a new action into the history stack.
   * Clears the Redo stack as a new branch of history is created.
   * Enforces max history depth to prevent unbounded memory growth.
   * Time Complexity: O(1)
   */
  public recordAction(action: DeskAction): void {
    this.undoStack.push(action);
    this.redoStack.clear(); // Standard Command Pattern: new action invalidates redo tree

    // Enforce history size cap if exceeded (re-creates stack from top elements)
    if (this.undoStack.size() > this.maxHistorySize) {
      const currentItems = this.undoStack.toArray().slice(0, this.maxHistorySize);
      this.undoStack.clear();
      // Re-populate from oldest (bottom) to newest (top)
      for (let i = currentItems.length - 1; i >= 0; i--) {
        this.undoStack.push(currentItems[i]);
      }
    }
  }

  /**
   * Undoes the last performed action.
   * Pops from Undo Stack and pushes into Redo Stack.
   * Time Complexity: O(1)
   */
  public undo(): DeskAction | null {
    if (this.undoStack.isEmpty()) {
      return null;
    }

    const action = this.undoStack.pop();
    if (action) {
      this.redoStack.push(action);
    }
    return action;
  }

  /**
   * Redoes the last undone action.
   * Pops from Redo Stack and pushes back into Undo Stack.
   * Time Complexity: O(1)
   */
  public redo(): DeskAction | null {
    if (this.redoStack.isEmpty()) {
      return null;
    }

    const action = this.redoStack.pop();
    if (action) {
      this.undoStack.push(action);
    }
    return action;
  }

  public canUndo(): boolean {
    return !this.undoStack.isEmpty();
  }

  public canRedo(): boolean {
    return !this.redoStack.isEmpty();
  }

  public peekLastAction(): DeskAction | null {
    return this.undoStack.peek();
  }

  public undoCount(): number {
    return this.undoStack.size();
  }

  public redoCount(): number {
    return this.redoStack.size();
  }

  public getUndoHistory(): DeskAction[] {
    return this.undoStack.toArray();
  }

  public getRedoHistory(): DeskAction[] {
    return this.redoStack.toArray();
  }

  public getVisualStackNodes(): ReturnType<Stack<DeskAction>['toVisualNodes']> {
    return this.undoStack.toVisualNodes();
  }

  public clear(): void {
    this.undoStack.clear();
    this.redoStack.clear();
  }
}
