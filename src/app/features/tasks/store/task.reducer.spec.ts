import { taskReducer, initialState } from './task.reducer';
import * as TaskActions from './task.actions';
import { Task, TaskStatus } from '../models/task.model';

describe('Task Reducer', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test',
    status: TaskStatus.Pending,
    assignedTo: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it('should return default state', () => {
    const action = { type: 'Unknown' };
    const state = taskReducer(initialState, action as any);
    expect(state).toEqual(initialState);
  });

  it('should handle loadTasks', () => {
    const action = TaskActions.loadTasks();
    const state = taskReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle loadTasksSuccess', () => {
    const tasks = [mockTask];
    const action = TaskActions.loadTasksSuccess({ tasks });
    const state = taskReducer(initialState, action);
    expect(state.tasks).toEqual(tasks);
    expect(state.loading).toBe(false);
  });

  it('should handle loadTasksFailure', () => {
    const action = TaskActions.loadTasksFailure({ error: 'Error' });
    const state = taskReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('should handle updateTaskStatusSuccess', () => {
    const stateWithTask = { ...initialState, tasks: [mockTask] };
    const updatedTask = { ...mockTask, status: TaskStatus.Done };
    const action = TaskActions.updateTaskStatusSuccess({ task: updatedTask });
    const state = taskReducer(stateWithTask, action);
    expect(state.tasks[0].status).toBe(TaskStatus.Done);
  });

  it('should handle queueOfflineUpdate', () => {
    const stateWithTask = { ...initialState, tasks: [mockTask] };
    const action = TaskActions.queueOfflineUpdate({ taskId: '1', status: TaskStatus.Done });
    const state = taskReducer(stateWithTask, action);
    expect(state.offlineUpdates.length).toBe(1);
    expect(state.tasks[0].status).toBe(TaskStatus.Done);
  });

  it('should handle syncOfflineUpdatesSuccess', () => {
    const stateWithUpdates = { 
      ...initialState, 
      offlineUpdates: [{ taskId: '1', status: TaskStatus.Done }] 
    };
    const action = TaskActions.syncOfflineUpdatesSuccess();
    const state = taskReducer(stateWithUpdates, action);
    expect(state.offlineUpdates.length).toBe(0);
  });

  it('should handle addTask', () => {
    const action = TaskActions.addTask({ task: mockTask });
    const state = taskReducer(initialState, action);
    expect(state.tasks.length).toBe(1);
    expect(state.tasks[0]).toEqual(mockTask);
  });
});
