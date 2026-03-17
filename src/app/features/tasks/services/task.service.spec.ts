import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { Task, TaskStatus } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTasks', () => {
    it('should return list of tasks', (done) => {
      service.getTasks().subscribe(tasks => {
        expect(tasks.length).toBeGreaterThan(0);
        expect(tasks[0].id).toBeDefined();
        expect(tasks[0].title).toBeDefined();
        expect(tasks[0].status).toBeDefined();
        done();
      });
    });

    it('should return tasks with valid TaskStatus', (done) => {
      service.getTasks().subscribe(tasks => {
        tasks.forEach(task => {
          expect(Object.values(TaskStatus)).toContain(task.status);
        });
        done();
      });
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status successfully', (done) => {
      service.updateTaskStatus('1', TaskStatus.Done).subscribe(task => {
        expect(task.status).toBe(TaskStatus.Done);
        done();
      });
    });

    it('should return error for non-existent task', (done) => {
      service.updateTaskStatus('invalid-id', TaskStatus.Done).subscribe({
        error: (err) => {
          expect(err.message).toContain('Task not found');
          done();
        }
      });
    });
  });

  describe('syncOfflineUpdates', () => {
    it('should sync offline updates', (done) => {
      const updates = [
        { taskId: '1', status: TaskStatus.Done },
        { taskId: '2', status: TaskStatus.InProgress }
      ];
      
      service.syncOfflineUpdates(updates).subscribe(() => {
        done();
      });
    });

    it('should handle empty updates', (done) => {
      service.syncOfflineUpdates([]).subscribe(() => {
        done();
      });
    });
  });
});
