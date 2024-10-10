import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RxjsService {

  logMessages = signal<{message: string, type: 'request' | 'response'}[]>([]);

  constructor() {}

  clearLogs() {
    this.logMessages.set([]);
  }

  addLog(message: string, type: 'request' | 'response') {
    this.logMessages.update((logs) => [...logs, { message, type }]);
  }
}
