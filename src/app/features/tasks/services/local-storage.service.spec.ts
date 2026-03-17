import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import { Task, TaskStatus } from '../models/task.model';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.Pending,
    assignedTo: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cacheTasks', () => {
    it('should cache tasks to localStorage', () => {
      const tasks = [mockTask];
      service.cacheTasks(tasks);
      const cached = localStorage.getItem('cached_tasks');
      expect(cached).toBeTruthy();
    });
  });

  describe('getCachedTasks', () => {
    it('should return null when no tasks cached', () => {
      const tasks = service.getCachedTasks();
      expect(tasks).toBeNull();
    });

    it('should return cached tasks', () => {
      const tasks = [mockTask];
      service.cacheTasks(tasks);
      const cached = service.getCachedTasks();
      expect(cached?.length).toBe(1);
    });
  });

  describe('queueOfflineUpdate', () => {
    it('should queue offline update', () => {
      service.queueOfflineUpdate('1', TaskStatus.Done);
      const updates = service.getOfflineUpdates();
      expect(updates.length).toBe(1);
      expect(updates[0].taskId).toBe('1');
      expect(updates[0].status).toBe(TaskStatus.Done);
    });

    it('should replace existing update for same task', () => {
      service.queueOfflineUpdate('1', TaskStatus.Done);
      service.queueOfflineUpdate('1', TaskStatus.InProgress);
      const updates = service.getOfflineUpdates();
      expect(updates.length).toBe(1);
      expect(updates[0].status).toBe(TaskStatus.InProgress);
    });
  });

  describe('getOfflineUpdates', () => {
    it('should return empty array when no updates', () => {
      const updates = service.getOfflineUpdates();
      expect(updates).toEqual([]);
    });
  });

  describe('clearOfflineUpdates', () => {
    it('should clear offline updates', () => {
      service.queueOfflineUpdate('1', TaskStatus.Done);
      service.clearOfflineUpdates();
      const updates = service.getOfflineUpdates();
      expect(updates.length).toBe(0);
    });
  });

  describe('updateLocalTaskStatus', () => {
    it('should update local task status', () => {
      service.cacheTasks([mockTask]);
      service.updateLocalTaskStatus('1', TaskStatus.Done);
      const cached = service.getCachedTasks();
      expect(cached?.[0].status).toBe(TaskStatus.Done);
    });

    it('should not fail for non-existent task', () => {
      expect(() => {
        service.updateLocalTaskStatus('invalid-id', TaskStatus.Done);
      }).not.toThrow();
    });
  });
});
