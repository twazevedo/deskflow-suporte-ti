import { describe, it, expect, beforeEach } from 'vitest';
import { ActionHistoryManager } from '../ActionHistoryManager';
import { DeskAction } from '../../types/action';

describe('ActionHistoryManager (Multi-level Undo / Redo with Dual Stacks)', () => {
  let history: ActionHistoryManager;

  const mockAction1: DeskAction = {
    id: 'act-1',
    type: 'PULL_TICKET',
    description: 'Atendente Ana puxou o chamado #101',
    timestamp: Date.now(),
    ticketId: 'TICK-101',
    agentId: 'agt-1',
  };

  const mockAction2: DeskAction = {
    id: 'act-2',
    type: 'RESOLVE_TICKET',
    description: 'Atendente Ana concluiu o chamado #101',
    timestamp: Date.now(),
    ticketId: 'TICK-101',
    agentId: 'agt-1',
  };

  beforeEach(() => {
    history = new ActionHistoryManager();
  });

  it('starts with empty undo and redo stacks', () => {
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);
    expect(history.undoCount()).toBe(0);
    expect(history.redoCount()).toBe(0);
  });

  it('records actions and allows stepping backward (undo) and forward (redo)', () => {
    history.recordAction(mockAction1);
    history.recordAction(mockAction2);

    expect(history.undoCount()).toBe(2);
    expect(history.canUndo()).toBe(true);
    expect(history.canRedo()).toBe(false);

    // Undo Action 2
    const undone2 = history.undo();
    expect(undone2?.id).toBe('act-2');
    expect(history.undoCount()).toBe(1);
    expect(history.redoCount()).toBe(1);
    expect(history.canRedo()).toBe(true);

    // Undo Action 1
    const undone1 = history.undo();
    expect(undone1?.id).toBe('act-1');
    expect(history.undoCount()).toBe(0);
    expect(history.redoCount()).toBe(2);
    expect(history.canUndo()).toBe(false);

    // Redo Action 1
    const redone1 = history.redo();
    expect(redone1?.id).toBe('act-1');
    expect(history.undoCount()).toBe(1);
    expect(history.redoCount()).toBe(1);

    // Redo Action 2
    const redone2 = history.redo();
    expect(redone2?.id).toBe('act-2');
    expect(history.undoCount()).toBe(2);
    expect(history.redoCount()).toBe(0);
    expect(history.canRedo()).toBe(false);
  });

  it('clears redo stack when a new action is recorded after undo', () => {
    history.recordAction(mockAction1);
    history.undo();
    expect(history.canRedo()).toBe(true);

    const mockAction3: DeskAction = {
      id: 'act-3',
      type: 'CANCEL_TICKET',
      description: 'Chamado cancelado',
      timestamp: Date.now(),
      ticketId: 'TICK-103',
    };

    history.recordAction(mockAction3);
    expect(history.canRedo()).toBe(false);
    expect(history.undoCount()).toBe(1);
    expect(history.peekLastAction()?.id).toBe('act-3');
  });

  it('enforces maxHistorySize and caps undo depth', () => {
    const cappedHistory = new ActionHistoryManager(3);
    for (let i = 1; i <= 5; i++) {
      cappedHistory.recordAction({
        id: `act-${i}`,
        type: 'CREATE_TICKET',
        description: `Chamado #${i}`,
        timestamp: Date.now(),
        ticketId: `TICK-${i}`,
      });
    }

    expect(cappedHistory.undoCount()).toBe(3);
    expect(cappedHistory.undo()?.id).toBe('act-5');
    expect(cappedHistory.undo()?.id).toBe('act-4');
    expect(cappedHistory.undo()?.id).toBe('act-3');
    expect(cappedHistory.undo()).toBeNull();
  });
});
