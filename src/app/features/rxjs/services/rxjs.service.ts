import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, interval, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Pokemon } from '../../../core/model/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class RxjsService {

  #http = inject(HttpClient);
  logMessages = signal<{message: string, type: 'request' | 'response'}[]>([]);
  currentPokemon = signal<Pokemon | null>(null);
  currentPokemon$ = new BehaviorSubject<Pokemon | null>(null);

  constructor() {}

  clearLogs() {
    this.logMessages.set([]);
  }

  addLog(message: string, type: 'request' | 'response') {
    this.logMessages.update((logs) => [...logs, { message, type }]);
  }
}
