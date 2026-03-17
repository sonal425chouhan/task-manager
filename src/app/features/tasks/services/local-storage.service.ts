import { Injectable } from '@angular/core';
import { Task, TaskStatus } from '../models/task.model';

const TASKS_KEY = 'cached_tasks';
const OFFLINE_UPDATES_KEY = 'offline_updates';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  // Cache tasks locally
  cacheTasks(tasks: Task[]): void {
    try {
      const serialized = JSON.stringify(tasks);
      localStorage.setItem(TASKS_KEY, serialized);
    } catch (e) {
      console.error('Error caching tasks:', e);
    }
  }

  // Get cached tasks
  getCachedTasks(): Task[] | null {
    try {
      const serialized = localStorage.getItem(TASKS_KEY);
      if (serialized) {
        return JSON.parse(serialized);
      }
      return null;
    } catch (e) {
      console.error('Error getting cached tasks:', e);
      return null;
    }
  }

  // Queue offline update
  queueOfflineUpdate(taskId: string, status: TaskStatus): void {
    try {
      const updates = this.getOfflineUpdates();
      // Remove any existing update for this task
      const filtered = updates.filter(u => u.taskId !== taskId);
      // Add new update
      filtered.push({ taskId, status, timestamp: new Date().toISOString() });
      localStorage.setItem(OFFLINE_UPDATES_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Error queuing offline update:', e);
    }
  }

  // Get queued offline updates
  getOfflineUpdates(): { taskId: string; status: TaskStatus; timestamp: string }[] {
    try {
      const serialized = localStorage.getItem(OFFLINE_UPDATES_KEY);
      if (serialized) {
        return JSON.parse(serialized);
      }
      return [];
    } catch (e) {
      console.error('Error getting offline updates:', e);
      return [];
    }
  }

  // Clear offline updates after sync
  clearOfflineUpdates(): void {
    try {
      localStorage.removeItem(OFFLINE_UPDATES_KEY);
    } catch (e) {
      console.error('Error clearing offline updates:', e);
    }
  }

  // Update local task status
  updateLocalTaskStatus(taskId: string, status: TaskStatus): void {
    const tasks = this.getCachedTasks();
    if (tasks) {
      const updated = tasks.map(t => 
        t.id === taskId ? { ...t, status, updatedAt: new Date() } : t
      );
      this.cacheTasks(updated);
    }
  }
}
