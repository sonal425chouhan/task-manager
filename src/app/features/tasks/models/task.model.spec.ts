import { Task, TaskStatus } from './task.model';

describe('Task Model', () => {
  it('should have correct TaskStatus values', () => {
    expect(TaskStatus.Pending).toBe('Pending');
    expect(TaskStatus.InProgress).toBe('In Progress');
    expect(TaskStatus.Done).toBe('Done');
  });

  it('should have all required properties', () => {
    const task: Task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.Pending,
      assignedTo: 'user1',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(task.id).toBeDefined();
    expect(task.title).toBeDefined();
    expect(task.description).toBeDefined();
    expect(task.status).toBeDefined();
    expect(task.assignedTo).toBeDefined();
    expect(task.createdAt).toBeDefined();
    expect(task.updatedAt).toBeDefined();
  });

  it('should allow all TaskStatus values', () => {
    const tasks: Task[] = [
      { id: '1', title: 'T1', description: 'D1', status: TaskStatus.Pending, assignedTo: 'u1', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', title: 'T2', description: 'D2', status: TaskStatus.InProgress, assignedTo: 'u1', createdAt: new Date(), updatedAt: new Date() },
      { id: '3', title: 'T3', description: 'D3', status: TaskStatus.Done, assignedTo: 'u1', createdAt: new Date(), updatedAt: new Date() }
    ];

    expect(tasks[0].status).toBe(TaskStatus.Pending);
    expect(tasks[1].status).toBe(TaskStatus.InProgress);
    expect(tasks[2].status).toBe(TaskStatus.Done);
  });
});
