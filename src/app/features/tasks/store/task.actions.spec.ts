import * as TaskActions from './task.actions';
import { Task, TaskStatus } from '../models/task.model';

describe('Task Actions', () => {
  it('should create loadTasks action', () => {
    const action = TaskActions.loadTasks();
    expect(action.type).toBe('[Task] Load Tasks');
  });

  it('should create loadTasksSuccess action', () => {
    const tasks: Task[] = [];
    const action = TaskActions.loadTasksSuccess({ tasks });
    expect(action.type).toBe('[Task] Load Tasks Success');
    expect(action.tasks).toEqual(tasks);
  });

  it('should create loadTasksFailure action', () => {
    const action = TaskActions.loadTasksFailure({ error: 'Error message' });
    expect(action.type).toBe('[Task] Load Tasks Failure');
    expect(action.error).toBe('Error message');
  });

  it('should create updateTaskStatus action', () => {
    const action = TaskActions.updateTaskStatus({ taskId: '1', status: TaskStatus.Done });
    expect(action.type).toBe('[Task] Update Task Status');
    expect(action.taskId).toBe('1');
    expect(action.status).toBe(TaskStatus.Done);
  });

  it('should create updateTaskStatusSuccess action', () => {
    const task: Task = {} as Task;
    const action = TaskActions.updateTaskStatusSuccess({ task });
    expect(action.type).toBe('[Task] Update Task Status Success');
    expect(action.task).toEqual(task);
  });

  it('should create updateTaskStatusFailure action', () => {
    const action = TaskActions.updateTaskStatusFailure({ error: 'Error' });
    expect(action.type).toBe('[Task] Update Task Status Failure');
    expect(action.error).toBe('Error');
  });

  it('should create queueOfflineUpdate action', () => {
    const action = TaskActions.queueOfflineUpdate({ taskId: '1', status: TaskStatus.Done });
    expect(action.type).toBe('[Task] Queue Offline Update');
    expect(action.taskId).toBe('1');
  });

  it('should create syncOfflineUpdates action', () => {
    const action = TaskActions.syncOfflineUpdates();
    expect(action.type).toBe('[Task] Sync Offline Updates');
  });

  it('should create syncOfflineUpdatesSuccess action', () => {
    const action = TaskActions.syncOfflineUpdatesSuccess();
    expect(action.type).toBe('[Task] Sync Offline Updates Success');
  });

  it('should create addTask action', () => {
    const task: Task = {} as Task;
    const action = TaskActions.addTask({ task });
    expect(action.type).toBe('[Task] Add Task');
    expect(action.task).toEqual(task);
  });
});
