export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Done = 'Done'
}