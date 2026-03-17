import { createAction, props } from '@ngrx/store';
import { Task, TaskStatus } from '@app/features/tasks/models/task.model';

// Load Tasks
export const loadTasks = createAction('[Task] Load Tasks');
export const loadTasksSuccess = createAction(
  '[Task] Load Tasks Success',
  props<{ tasks: Task[] }>()
);
export const loadTasksFailure = createAction(
  '[Task] Load Tasks Failure',
  props<{ error: string }>()
);

// Update Task Status
export const updateTaskStatus = createAction(
  '[Task] Update Task Status',
  props<{ taskId: string; status: TaskStatus }>()
);
export const updateTaskStatusSuccess = createAction(
  '[Task] Update Task Status Success',
  props<{ task: Task }>()
);
export const updateTaskStatusFailure = createAction(
  '[Task] Update Task Status Failure',
  props<{ error: string }>()
);

// Offline Sync Actions
export const queueOfflineUpdate = createAction(
  '[Task] Queue Offline Update',
  props<{ taskId: string; status: TaskStatus }>()
);
export const syncOfflineUpdates = createAction('[Task] Sync Offline Updates');
export const syncOfflineUpdatesSuccess = createAction(
  '[Task] Sync Offline Updates Success'
);

// Add New Task
export const addTask = createAction(
  '[Task] Add Task',
  props<{ task: Task }>()
);
export const addTaskSuccess = createAction(
  '[Task] Add Task Success',
  props<{ task: Task }>()
);
