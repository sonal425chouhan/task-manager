import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Task, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  // Mock data for demonstration
  private mockTasks: Task[] = [
    {
      id: '1',
      title: 'Inspect Site A',
      description: 'Perform routine inspection at Site A - check all equipment and safety measures',
      status: TaskStatus.Pending,
      assignedTo: 'user1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Repair Equipment B',
      description: 'Fix broken equipment at location B - urgent repair required',
      status: TaskStatus.InProgress,
      assignedTo: 'user1',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16')
    },
    {
      id: '3',
      title: 'Update Documentation',
      description: 'Update site documentation for compliance review',
      status: TaskStatus.Done,
      assignedTo: 'user1',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '4',
      title: 'Install New Sensor',
      description: 'Install temperature sensor in warehouse section C',
      status: TaskStatus.Pending,
      assignedTo: 'user1',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16')
    },
    {
      id: '5',
      title: 'Safety Audit',
      description: 'Conduct monthly safety audit for all field locations',
      status: TaskStatus.InProgress,
      assignedTo: 'user1',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-17')
    }
  ];

  constructor() {}

  /**
   * Get all tasks for the current user
   * In production, this would fetch from Firestore
   */
  getTasks(): Observable<Task[]> {
    // Simulate network delay
    return of([...this.mockTasks]).pipe(delay(500));
  }

  /**
   * Update task status
   * In production, this would update Firestore
   */
  updateTaskStatus(taskId: string, status: TaskStatus): Observable<Task> {
    const taskIndex = this.mockTasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return throwError(() => new Error('Task not found'));
    }

    const updatedTask: Task = {
      ...this.mockTasks[taskIndex],
      status,
      updatedAt: new Date()
    };
    
    this.mockTasks[taskIndex] = updatedTask;
    
    return of(updatedTask).pipe(delay(300));
  }

  /**
   * Sync offline updates
   * In production, this would batch update Firestore
   */
  syncOfflineUpdates(updates: { taskId: string; status: TaskStatus }[]): Observable<void> {
    updates.forEach(update => {
      const taskIndex = this.mockTasks.findIndex(t => t.id === update.taskId);
      if (taskIndex !== -1) {
        this.mockTasks[taskIndex] = {
          ...this.mockTasks[taskIndex],
          status: update.status,
          updatedAt: new Date()
        };
      }
    });
    
    return of(undefined).pipe(delay(500));
  }
}
