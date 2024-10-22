import { CommonModule } from '@angular/common';
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { PokemonShowComponent } from '../../../../shared/components/pokemon-show/pokemon-show.component';
import { Pokemon } from '../../../../core/model/pokemon.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, interval, switchMap, tap } from 'rxjs';
import { PokemonApiService } from '../../../../core/services/pokemon-api.service';
import { RxjsService } from '../../../rxjs/services/rxjs.service';
import { ChildSignalComponent } from './components/child-signal.component';

@Component({
  standalone: true,
  imports: [CommonModule, PokemonShowComponent, ChildSignalComponent],
  templateUrl: './signal-detection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignalDetectionComponent {
  #pokemonApiService = inject(PokemonApiService);
  #rxjsService = inject(RxjsService);
  
  data = signal<string>('Initial Data');
  inputValue = signal<string>('Initial Input Value');
  pokemon = toSignal(this.autoUpdatePokemon());
  inputValueChange = signal<string | undefined>(undefined);
  

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

  ngDoCheck() {
    console.log('ParentComponent: ngDoCheck');
  }

  ngAfterViewChecked() {
    console.log('ParentComponent: ngAfterViewChecked');
  }

  changeData() {
    this.data.set('Updated Data ' + Math.random());
  }

  /*onInputValueChange(newValue: any) {
    console.log('ParentComponent: Input value changed to:', newValue);
    this.inputValue.set(newValue);  // Met à jour la valeur dans le parent
  }*/
}
