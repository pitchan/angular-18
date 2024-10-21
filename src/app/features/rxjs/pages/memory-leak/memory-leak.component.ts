import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, WritableSignal, inject, input, signal } from '@angular/core';
import { BadDestroyComponent } from './components/bad-destroy.component';
import { MatButtonModule } from '@angular/material/button';
import { LogPanelComponent } from '../../../../shared/components/log-panel/log-panel.component';
import { MatCardModule } from '@angular/material/card';
import { PokemonShowComponent } from '../../../../shared/components/pokemon-show/pokemon-show.component';
import { RxjsService } from '../../services/rxjs.service';
import { Pokemon } from '../../../../core/model/pokemon.model';
import { EMPTY, Observable, interval, of, switchMap, tap } from 'rxjs';
import { PokemonApiService } from '../../../../core/services/pokemon-api.service';
import { HighlightJsDirective } from 'ngx-highlight-js';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  standalone: true,
  imports: [CommonModule, BadDestroyComponent, MatButtonModule, MatCardModule, LogPanelComponent, PokemonShowComponent, HighlightJsDirective, MatRadioModule],
  templateUrl: './memory-leak.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemoryLeakComponent {

  #pokemonApiService = inject(PokemonApiService);
  #rxjsService = inject(RxjsService);

  // Information given by route :way parameter
  way = input.required<string>();
  
  componentExist = true;
  pokemon = this.#rxjsService.currentPokemon;
  pokemon$: Observable<Pokemon> = EMPTY;
  selectedMethod = signal<string>('stop');

  /**
   * Radio button to start or stop stream
   * @param event start or stop 
   * @returns 
   */
  selectMethod(event: any): void {
    const method = event.value;
    this.selectedMethod.set(event.value);
    if (method === 'start') {
      this.pokemon$ = this.autoUpdatePokemon();
      return;
    }
    this.pokemon$ = EMPTY;
  }

  /**
   * Automatically fetches and updates the current Pokémon at regular intervals
   * @returns {Observable<Pokemon>} An observable that emits updated Pokémon data
   */
  autoUpdatePokemon(): Observable<Pokemon> {
    return interval(2000).pipe(
      switchMap(() => {
        const randomId = Math.floor(Math.random() * 898) + 1;
        return this.#pokemonApiService.getPokemonById(randomId);
      }),
      tap((pokemon) => {
          this.#rxjsService.addLog('Request interval launched ' + pokemon.name, 'request')
      }),    
    );
  }

  /**
   * Destroy components starting observables
   */
  destroyComponent(): void {
    this.componentExist = false;
  }

  /**
   * Reload components starting observables
   */
  reloadComponent(): void {
    this.componentExist = true;
  }
}
