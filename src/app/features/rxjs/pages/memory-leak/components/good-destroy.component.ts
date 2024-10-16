import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { HighlightJsDirective } from 'ngx-highlight-js';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { Pokemon } from '../../../../../core/model/pokemon.model';
import { interval, of, switchMap, tap } from 'rxjs';
import { PokemonApiService } from '../../../../../core/services/pokemon-api.service';
import { RxjsService } from '../../../services/rxjs.service';
import { toSignal } from '@angular/core/rxjs-interop';

export enum MethodName {
  signal = 'Signal',
  observable = 'Observable'
}

@Component({
  selector: 'app-good-destroy',
  standalone: true,
  imports: [CommonModule, MatButtonModule, HighlightJsDirective, MatRadioModule],  
  templateUrl: './good-destroy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoodDestroyComponent {

  #pokemonApiService = inject(PokemonApiService);
  #rxjsService = inject(RxjsService);

  methodName = MethodName;
  pokemon = toSignal(this.autoUpdatePokemon());
  pokemon$ = this.autoUpdatePokemon();
  selectedMethod = signal<string>('Observable');
  

  constructor() {}

  selectMethod(event: any) {
    this.selectedMethod.set(event.value);
  }

  autoUpdatePokemon() {
    return of([]).pipe(
      switchMap(() => this.getPokemonEveryTwoseconds()),
      tap((pokemon) => {
          this.#rxjsService.addLog('Request interval launched ' + pokemon.name, 'request')
      }),    
    );
  }

  getPokemonEveryTwoseconds(multiplier?: number) {
    return interval(2000).pipe(
        switchMap(() => {
            const randomId = Math.floor(Math.random() * 898) + 1;
            return this.#pokemonApiService.getPokemonById(randomId);
        })
    );
}
}
