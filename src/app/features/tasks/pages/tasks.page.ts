import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { Task, TaskStatus } from '@app/features/tasks/models/task.model';
import { OfflineService } from '@app/features/tasks/services/offline.service';
import { LocalStorageService } from '@app/features/tasks/services/local-storage.service';
import { AuthService } from '@app/core/services/auth.service';
import * as TaskActions from '@app/features/tasks/store/task.actions';
import { selectAllTasks, selectTasksLoading, selectTasksError, selectTaskStats } from '@app/features/tasks/store/task.selectors';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class TasksPage implements OnInit {
  private store = inject(Store);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);
  private offlineService = inject(OfflineService);
  private localStorage = inject(LocalStorageService);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  // Signals
  tasks = signal<Task[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  stats = signal<{ total: number; pending: number; inProgress: number; done: number }>({ total: 0, pending: 0, inProgress: 0, done: 0 });
  isOnline = signal(true);
  pendingSyncCount = signal(0);
  
  // Computed signals for filtered tasks
  pendingTasks = computed(() => this.tasks().filter(t => t.status === TaskStatus.Pending));
  inProgressTasks = computed(() => this.tasks().filter(t => t.status === TaskStatus.InProgress));
  doneTasks = computed(() => this.tasks().filter(t => t.status === TaskStatus.Done));
  
  // UI state
  openDropdownId = signal<string | null>(null);
  taskStatus = TaskStatus;
  showCreateModal = signal(false);
  
  // Create task form
  createTaskForm: FormGroup;
  
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.createTaskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]]
    });
    
    // Subscribe to store selectors
    this.store.select(selectAllTasks)
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => this.tasks.set(tasks));
    
    this.store.select(selectTasksLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading.set(loading));
    
    this.store.select(selectTasksError)
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => this.error.set(error));
    
    this.store.select(selectTaskStats)
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => this.stats.set(stats));
    
    this.offlineService.isOnline$
      .pipe(takeUntil(this.destroy$))
      .subscribe(online => this.isOnline.set(online));
  }

  ngOnInit() {
    this.store.dispatch(TaskActions.loadTasks());
    
    // Check for pending offline updates
    const updates = this.localStorage.getOfflineUpdates();
    this.pendingSyncCount.set(updates.length);
  }

  toggleDropdown(taskId: string) {
    this.openDropdownId.update(current => current === taskId ? null : taskId);
  }

  updateTaskStatus(task: Task, newStatus: TaskStatus) {
    // Small delay to prevent UI flicker
    this.openDropdownId.set(null);
    
    // Use setTimeout to allow dropdown to close smoothly
    setTimeout(() => {
      this.store.dispatch(TaskActions.updateTaskStatus({ 
        taskId: task.id, 
        status: newStatus 
      }));
      
      // Refresh pending count after dispatch
      const updates = this.localStorage.getOfflineUpdates();
      this.pendingSyncCount.set(updates.length);
      
      this.showToast(`Status updated to ${newStatus}`);
    }, 50);
  }

  openCreateModal() {
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.createTaskForm.reset();
  }

  createTask() {
    if (!this.createTaskForm.valid) {
      this.createTaskForm.markAllAsTouched();
      return;
    }

    const { title, description } = this.createTaskForm.value;
    
    const newTask: Task = {
      id: 'task-' + Date.now(),
      title,
      description,
      status: TaskStatus.Pending,
      assignedTo: this.authService.getCurrentUser()?.email || 'unknown',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.store.dispatch(TaskActions.addTask({ task: newTask }));
    
    // Persist new task to localStorage
    const tasks = this.localStorage.getCachedTasks() || [];
    tasks.unshift(newTask);
    this.localStorage.cacheTasks(tasks);
    
    // Reset and close
    this.createTaskForm.reset();
    this.showCreateModal.set(false);
    
    this.showToast('Task created successfully!');
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
      cssClass: 'toast-small'
    });
    await toast.present();
  }

  async logout() {
    const loading = await this.loadingController.create({
      message: 'Signing out...',
      spinner: 'circles'
    });
    await loading.present();

    this.authService.logout().subscribe({
      next: async () => {
        await loading.dismiss();
        this.router.navigate(['/login']);
      },
      error: async () => {
        await loading.dismiss();
        this.showToast('Error signing out');
      }
    });
  }

  // Track by function for @for
  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}
