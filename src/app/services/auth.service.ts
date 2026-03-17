import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Pre-defined users for mock auth
const MOCK_USERS: { [email: string]: AuthUser } = {
  'test@example.com': {
    uid: 'mock-user-123',
    email: 'test@example.com',
    displayName: 'Test User'
  },
  'john@example.com': {
    uid: 'mock-user-456',
    email: 'john@example.com',
    displayName: 'John Doe'
  }
};

const MOCK_PASSWORDS: { [email: string]: string } = {
  'test@example.com': 'password123',
  'john@example.com': 'john123'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Mock auth state using BehaviorSubject
  private authStateSubject = new BehaviorSubject<AuthUser | null>(null);
  public authState$ = this.authStateSubject.asObservable();
  private currentMockUser: AuthUser | null = null;

  constructor() {
    this.authStateSubject.next(null);
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
        
        // Check if user exists
        if (!MOCK_USERS[normalizedEmail]) {
          observer.error(new Error('No account found with this email.'));
          return;
        }
        
        // Check password
        if (MOCK_PASSWORDS[normalizedEmail] !== password) {
          observer.error(new Error('Incorrect password.'));
          return;
        }
        
        this.currentMockUser = MOCK_USERS[normalizedEmail];
        this.authStateSubject.next(this.currentMockUser);
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
        observer.next();
        observer.complete();
      }, 300);
    });
  }
}
