import { TaskState } from './task.reducer';
import { TaskStatus } from '../models/task.model';
import { 
  selectTaskState, 
  selectAllTasks, 
  selectTasksLoading, 
  selectTasksError,
  selectPendingTasks,
  selectInProgressTasks,
  selectDoneTasks,
  selectOfflineUpdates,
  selectHasOfflineUpdates,
  selectTaskStats
} from './task.selectors';

describe('Task Selectors', () => {
  const mockTask1 = {
    id: '1',
    title: 'Task 1',
    description: 'Desc 1',
    status: TaskStatus.Pending,
    assignedTo: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockTask2 = {
    id: '2',
    title: 'Task 2',
    description: 'Desc 2',
    status: TaskStatus.InProgress,
    assignedTo: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockTask3 = {
    id: '3',
    title: 'Task 3',
    description: 'Desc 3',
    status: TaskStatus.Done,
    assignedTo: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const state: TaskState = {
    tasks: [mockTask1, mockTask2, mockTask3],
    loading: false,
    error: null,
    offlineUpdates: [{ taskId: '1', status: TaskStatus.Done }]
  };

  it('should select task state', () => {
    const result = selectTaskState({ tasks: state } as any);
    expect(result).toEqual(state);
  });

  it('should select all tasks', () => {
    const result = selectAllTasks({ tasks: state } as any);
    expect(result.length).toBe(3);
  });

  it('should select loading state', () => {
    const loadingState = { ...state, loading: true };
    const result = selectTasksLoading({ tasks: loadingState } as any);
    expect(result).toBe(true);
  });

  it('should select error', () => {
    const errorState = { ...state, error: 'Error message' };
    const result = selectTasksError({ tasks: errorState } as any);
    expect(result).toBe('Error message');
  });

  it('should select pending tasks', () => {
    const result = selectPendingTasks({ tasks: state } as any);
    expect(result.length).toBe(1);
    expect(result[0].status).toBe(TaskStatus.Pending);
  });

  it('should select in progress tasks', () => {
    const result = selectInProgressTasks({ tasks: state } as any);
    expect(result.length).toBe(1);
    expect(result[0].status).toBe(TaskStatus.InProgress);
  });

  it('should select done tasks', () => {
    const result = selectDoneTasks({ tasks: state } as any);
    expect(result.length).toBe(1);
    expect(result[0].status).toBe(TaskStatus.Done);
  });

  it('should select offline updates', () => {
    const result = selectOfflineUpdates({ tasks: state } as any);
    expect(result.length).toBe(1);
  });

  it('should select has offline updates', () => {
    const result = selectHasOfflineUpdates({ tasks: state } as any);
    expect(result).toBe(true);
  });

  it('should select task stats', () => {
    const result = selectTaskStats({ tasks: state } as any);
    expect(result.total).toBe(3);
    expect(result.pending).toBe(1);
    expect(result.inProgress).toBe(1);
    expect(result.done).toBe(1);
  });
});
