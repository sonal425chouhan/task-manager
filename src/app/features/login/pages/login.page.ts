import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class LoginPage implements OnInit, OnDestroy {
  // Signals for reactive state
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    // Check if already logged in
    this.authService.getAuthState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.router.navigate(['/tasks']);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  async onSubmit() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isLoading.set(true);

    const { email, password } = this.loginForm.value;

    try {
      await this.login(email, password);
      this.router.navigate(['/tasks']);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'An error occurred. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private login(email: string, password: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const loading = await this.loadingController.create({
        message: 'Signing in...',
        spinner: 'circles'
      });
      await loading.present();
      
      this.authService.login(email, password)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: async () => {
            await loading.dismiss();
            await this.showToast('Login successful!', 'success');
            resolve();
          },
          error: async (error) => {
            await loading.dismiss();
            this.errorMessage.set(error.message);
            reject(error);
          }
        });
    });
  }

  async showToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
      cssClass: 'toast-custom'
    });
    await toast.present();
  }

  // Getter for template
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
