import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './task.reducer';
import { TaskStatus } from '@app/features/tasks/models/task.model';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectAllTasks = createSelector(
  selectTaskState,
  (state) => state.tasks
);

export const selectTasksLoading = createSelector(
  selectTaskState,
  (state) => state.loading
);

export const selectTasksError = createSelector(
  selectTaskState,
  (state) => state.error
);

export const selectPendingTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(task => task.status === TaskStatus.Pending)
);

export const selectInProgressTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(task => task.status === TaskStatus.InProgress)
);

export const selectDoneTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(task => task.status === TaskStatus.Done)
);

export const selectOfflineUpdates = createSelector(
  selectTaskState,
  (state) => state.offlineUpdates
);

export const selectHasOfflineUpdates = createSelector(
  selectOfflineUpdates,
  (offlineUpdates) => offlineUpdates.length > 0
);

export const selectTaskStats = createSelector(
  selectAllTasks,
  (tasks) => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === TaskStatus.Pending).length,
    inProgress: tasks.filter(t => t.status === TaskStatus.InProgress).length,
    done: tasks.filter(t => t.status === TaskStatus.Done).length
  })
);
