import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

const MOCK_USERS: { [email: string]: AuthUser } = {
  'admin@example.com': {
    uid: 'mock-user-123',
    email: 'admin@example.com',
    displayName: 'Admin User'
  },

  'john@example.com': {
    uid: 'mock-user-456',
    email: 'john@example.com',
    displayName: 'John Doe'
  }
};

const MOCK_PASSWORDS: { [email: string]: string } = {
  'admin@example.com': 'admin123',
  'john@example.com': 'john123'
};

const AUTH_STORAGE_KEY = 'task_app_auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<AuthUser | null>(null);
  public authState$ = this.authStateSubject.asObservable();
  private currentMockUser: AuthUser | null = null;

  constructor() {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored) as AuthUser;
        this.currentMockUser = user;
        this.authStateSubject.next(user);
      } else {
        this.authStateSubject.next(null);
      }
    } catch {
      this.authStateSubject.next(null);
    }
  }

  private saveAuth(user: AuthUser): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  private clearAuth(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  getAuthState(): Observable<AuthUser | null> {
    return this.authState$;
  }

  isAuthenticated(): boolean {
    return this.currentMockUser !== null;
  }

  getCurrentUser(): AuthUser | null {
    return this.currentMockUser;
  }

  login(email: string, password: string): Observable<AuthUser> {
    return new Observable((observer) => {
      setTimeout(() => {
        const normalizedEmail = email.toLowerCase();
        
        if (!MOCK_USERS[normalizedEmail]) {
          observer.error(new Error('No account found with this email.'));
          return;
        }
        
        if (MOCK_PASSWORDS[normalizedEmail] !== password) {
          observer.error(new Error('Incorrect password.'));
          return;
        }
        
        this.currentMockUser = MOCK_USERS[normalizedEmail];
        this.authStateSubject.next(this.currentMockUser);
        this.saveAuth(this.currentMockUser!);
        observer.next(this.currentMockUser);
        observer.complete();
      }, 800);
    });
  }

  logout(): Observable<void> {
    return new Observable((observer) => {
      setTimeout(() => {
        this.currentMockUser = null;
        this.authStateSubject.next(null);
        this.clearAuth();
        observer.next();
        observer.complete();
      }, 300);
    });
  }
}
