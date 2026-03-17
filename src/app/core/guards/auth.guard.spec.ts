import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '@app/core/services/auth.service';
import { AuthUser } from '@app/core/services/auth.service';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getAuthState']);
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true when user is authenticated', (done) => {
      const mockUser: AuthUser = {
        uid: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User'
      };
      authService.getAuthState.and.returnValue(of(mockUser));

      guard.canActivate().subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should return UrlTree when user is not authenticated', (done) => {
      authService.getAuthState.and.returnValue(of(null));
      router.createUrlTree.and.returnValue({} as any);

      guard.canActivate().subscribe(result => {
        expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
        done();
      });
    });
  });
});
