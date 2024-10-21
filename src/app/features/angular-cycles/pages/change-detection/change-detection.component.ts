import { AfterViewChecked, ChangeDetectionStrategy, Component, DoCheck, inject } from '@angular/core';
import { ChildComponent } from './components/child.component';
import { Observable, interval, switchMap, tap } from 'rxjs';
import { Pokemon } from '../../../../core/model/pokemon.model';
import { PokemonApiService } from '../../../../core/services/pokemon-api.service';
import { RxjsService } from '../../../rxjs/services/rxjs.service';
import { CommonModule } from '@angular/common';
import { PokemonShowComponent } from '../../../../shared/components/pokemon-show/pokemon-show.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [CommonModule, ChildComponent, PokemonShowComponent],
  templateUrl: './change-detection.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeDetectionComponent implements DoCheck, AfterViewChecked  {

  #pokemonApiService = inject(PokemonApiService);
  #rxjsService = inject(RxjsService);

  data: string = 'Initial Data';
  inputValue: string = 'Initial Input Value';
  // counter = 0;
  private _counter = 0;
  get counter() {
    console.log('get counter');
    return this._counter;
  }

  set counter(value) {
    console.log('get counter');
    this._counter++;
  }

  pokemon: Pokemon | null = null;

  // pokemon$ = this.autoUpdatePokemon();
  
  constructor() {    
    console.log('ParentComponent: Constructor');
    // this.autoUpdatePokemon().subscribe();
    toSignal(this.autoUpdatePokemon());
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
        this.pokemon = pokemon;
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
    this.data = 'Updated Data ' + Math.random();
  }

  onInputValueChange(newValue: string) {
    console.log('ParentComponent: Input value changed to:', newValue);
    this.inputValue = newValue;  // Met à jour la valeur dans le parent
  }
}
