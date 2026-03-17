import { TestBed } from '@angular/core/testing';
import { AuthService, AuthUser } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser: AuthUser = {
    uid: 'mock-user-123',
    email: 'test@example.com',
    displayName: 'Test User'
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAuthState', () => {
    it('should return null initially', (done) => {
      service.getAuthState().subscribe(state => {
        expect(state).toBeNull();
        done();
      });
    });
  });

  describe('login', () => {
    it('should login with valid credentials', (done) => {
      service.login('test@example.com', 'password123').subscribe(user => {
        expect(user).toEqual(mockUser);
        done();
      });
    });

    it('should fail with invalid email', (done) => {
      service.login('invalid@example.com', 'password').subscribe({
        error: (err) => {
          expect(err.message).toContain('No account found');
          done();
        }
      });
    });

    it('should fail with invalid password', (done) => {
      service.login('test@example.com', 'wrongpassword').subscribe({
        error: (err) => {
          expect(err.message).toContain('Incorrect password');
          done();
        }
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully', (done) => {
      service.logout().subscribe(() => {
        service.getAuthState().subscribe(state => {
          expect(state).toBeNull();
          done();
        });
      });
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when not logged in', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return true when logged in', (done) => {
      service.login('test@example.com', 'password123').subscribe(() => {
        expect(service.isAuthenticated()).toBe(true);
        done();
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when not logged in', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return user when logged in', (done) => {
      service.login('test@example.com', 'password123').subscribe(() => {
        const user = service.getCurrentUser();
        expect(user?.email).toBe('test@example.com');
        done();
      });
    });
  });
});
