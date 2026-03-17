import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private onlineStatus$ = new BehaviorSubject<boolean>(true);
  
  constructor() {
    this.initNetworkListener();
    this.checkInitialStatus();
  }

  private async checkInitialStatus() {
    try {
      const status = await Network.getStatus();
      this.onlineStatus$.next(status.connected);
    } catch (e) {
      // Fallback for web
      this.onlineStatus$.next(navigator.onLine);
    }
  }

  private initNetworkListener() {
    try {
      Network.addListener('networkStatusChange', (status) => {
        this.onlineStatus$.next(status.connected);
      });
    } catch (e) {
      // Fallback for web browsers
      fromEvent(window, 'online').subscribe(() => this.onlineStatus$.next(true));
      fromEvent(window, 'offline').subscribe(() => this.onlineStatus$.next(false));
    }
  }

  get isOnline$(): Observable<boolean> {
    return this.onlineStatus$.asObservable();
  }

  get isOnline(): boolean {
    return this.onlineStatus$.value;
  }
}
