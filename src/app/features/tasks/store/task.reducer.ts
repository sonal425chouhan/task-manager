import { createReducer, on } from '@ngrx/store';
import { Task, TaskStatus } from '@app/features/tasks/models/task.model';
import * as TaskActions from './task.actions';

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  offlineUpdates: { taskId: string; status: TaskStatus }[];
}

export const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  offlineUpdates: []
};

export const taskReducer = createReducer(
  initialState,
  
  // Load Tasks
  on(TaskActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false
  })),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Task Status - no loading state needed for quick updates
  on(TaskActions.updateTaskStatus, (state) => ({
    ...state
  })),
  on(TaskActions.updateTaskStatusSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
    loading: false
  })),
  on(TaskActions.updateTaskStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Offline Updates
  on(TaskActions.queueOfflineUpdate, (state, { taskId, status }) => ({
    ...state,
    offlineUpdates: [...state.offlineUpdates, { taskId, status }],
    // Immediately update local state for better UX
    tasks: state.tasks.map(t => 
      t.id === taskId ? { ...t, status, updatedAt: new Date() } : t
    )
  })),
  on(TaskActions.syncOfflineUpdatesSuccess, (state) => ({
    ...state,
    offlineUpdates: []
  })),

  // Add Task
  on(TaskActions.addTask, (state, { task }) => ({
    ...state,
    tasks: [task, ...state.tasks]
  }))
);
