import { effect, HostListener, inject, Injectable, Injector, NgZone, signal, untracked } from '@angular/core';
import { fromEvent, merge, interval, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InactivityService {
  

  isUserActive = false;
  private timeout: any;
  private subscription!: Subscription;

  private readonly events = [
    'mousemove',
    'mousedown',
    'keydown',
    'scroll',
    'touchstart',
    'wheel'
  ];

  constructor(private ngZone: NgZone) {
  //  this.startListening();
  }

    startListening() {
/*     this.ngZone.runOutsideAngular(() => {

      const eventStreams = this.events.map(event =>
        fromEvent(window, event)
      );

      const visibility$ = fromEvent(document, 'visibilitychange');

      this.subscription = merge(...eventStreams, visibility$)
        .subscribe(() => this.onUserActivity());
    }); */
  }

  private onUserActivity() {
/*     this.ngZone.run(() => {
      this.isUserActive = true;
      
      this.resetTimer();
    }); */
  }
 
  private resetTimer() {
   /*  clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.isUserActive = false;
      localStorage.setItem("lastActivity", Date.now().toString());
    }, 5000); */
  }

  ngOnDestroy() {
    //this.subscription?.unsubscribe();
    //clearTimeout(this.timeout);
  }

}
