import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TaskService } from '@app/features/tasks/services/task.service';
import { OfflineService } from '@app/features/tasks/services/offline.service';
import { LocalStorageService } from '@app/features/tasks/services/local-storage.service';
import * as TaskActions from './task.actions';
import { selectOfflineUpdates, selectAllTasks } from './task.selectors';

@Injectable()
export class TaskEffects {
  
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      mergeMap(() => {
        const cached = this.localStorage.getCachedTasks();
        
        return this.taskService.getTasks().pipe(
          map(tasks => {
            this.localStorage.cacheTasks(tasks);
            return TaskActions.loadTasksSuccess({ tasks });
          }),
          catchError(error => {
            const cached = this.localStorage.getCachedTasks();
            if (cached) {
              return of(TaskActions.loadTasksSuccess({ tasks: cached }));
            }
            return of(TaskActions.loadTasksFailure({ error: error.message }));
          })
        );
      })
    )
  );

  updateTaskStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTaskStatus),
      withLatestFrom(this.store.select(selectAllTasks)),
      mergeMap(([{ taskId, status }, tasks]) => {
        this.localStorage.updateLocalTaskStatus(taskId, status);
        
        const fullTask = tasks.find(t => t.id === taskId);
        
        if (this.offlineService.isOnline) {
          return this.taskService.updateTaskStatus(taskId, status).pipe(
            map(task => TaskActions.updateTaskStatusSuccess({ task })),
            catchError(error => {
              this.localStorage.queueOfflineUpdate(taskId, status);
              return of(TaskActions.updateTaskStatusFailure({ error: error.message }));
            })
          );
        } else {
          this.localStorage.queueOfflineUpdate(taskId, status);
          const updatedTask = fullTask ? { ...fullTask, status, updatedAt: new Date() } : null;
          if (updatedTask) {
            return of(TaskActions.updateTaskStatusSuccess({ task: updatedTask }));
          }
          return of(TaskActions.updateTaskStatusFailure({ error: 'Task not found' }));
        }
      })
    )
  );

  checkOfflineUpdates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      withLatestFrom(this.store.select(selectOfflineUpdates)),
      mergeMap(([_, offlineUpdates]) => {
        if (offlineUpdates.length > 0 && this.offlineService.isOnline) {
          return of(TaskActions.syncOfflineUpdates());
        }
        return of();
      })
    )
  );

  syncOfflineUpdates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.syncOfflineUpdates),
      withLatestFrom(this.store.select(selectOfflineUpdates)),
      mergeMap(([_, offlineUpdates]) => {
        if (offlineUpdates.length === 0) {
          return of(TaskActions.syncOfflineUpdatesSuccess());
        }
        
        return this.taskService.syncOfflineUpdates(offlineUpdates).pipe(
          map(() => {
            this.localStorage.clearOfflineUpdates();
            return TaskActions.syncOfflineUpdatesSuccess();
          }),
          catchError(() => {
            this.localStorage.clearOfflineUpdates();
            return of(TaskActions.syncOfflineUpdatesSuccess());
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private taskService: TaskService,
    private offlineService: OfflineService,
    private localStorage: LocalStorageService
  ) {}
}
