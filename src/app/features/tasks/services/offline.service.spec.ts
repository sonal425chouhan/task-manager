import { TestBed } from '@angular/core/testing';
import { OfflineService } from './offline.service';

describe('OfflineService', () => {
  let service: OfflineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isOnline$', () => {
    it('should return observable of online status', (done) => {
      service.isOnline$.subscribe(status => {
        expect(typeof status).toBe('boolean');
        done();
      });
    });
  });

  describe('isOnline', () => {
    it('should return current online status', () => {
      const status = service.isOnline;
      expect(typeof status).toBe('boolean');
    });
  });
});
