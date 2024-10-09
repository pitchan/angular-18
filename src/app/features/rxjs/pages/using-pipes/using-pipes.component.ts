import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, WritableSignal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { PokemonApiService } from '../../../../core/services/pokemon-api.service';
import { Pokemon } from '../../../../core/model/pokemon.model';

import { RxjsService } from '../../services/rxjs.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, concatMap, debounceTime, distinctUntilChanged, exhaustMap, filter, map, mergeMap, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, Subject, merge, of } from 'rxjs';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PokemonAutoCompleteComponent } from '../components/pokemon-autocomplete.component'; 
import { RequestLogsComponent } from '../components/request-logs/request-logs.component';
import { PokemonShowComponent } from '../../../../shared/components/pokemon-show/pokemon-show.component';


@Component({
  selector: 'app-using-pipes',
  standalone: true,
  imports: [
    CommonModule, 
    PokemonAutoCompleteComponent, 
    ReactiveFormsModule, 
    MatCheckboxModule, 
    FormsModule, 
    MatIconModule, 
    MatDividerModule, 
    MatButtonModule, 
    MatCardModule, 
    MatCardModule, 
    MatButtonModule, 
    MatCardModule, 
    MatAutocompleteModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatChipsModule, 
    RequestLogsComponent,
    PokemonShowComponent
  ],
  templateUrl: './using-pipes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsingPipesComponent {
  #pokemonApiService = inject(PokemonApiService);
  #rxjsService = inject(RxjsService);

  #pokemonClick$ = new Subject<void>();

  readonly autoCompleteSwitchMapControl = new FormControl();
  readonly autoCompleteConcatMapControl = new FormControl();
  readonly autoCompleteMergeMapControl = new FormControl();
  readonly autoCompleteExhaustMapControl = new FormControl();
  
  loading = signal<boolean>(false);
  logMessages = signal<{message: string, type: 'request' | 'response'}[]>([]);

  selectedPokemon = signal<Pokemon | null>(null);
  isDelay = false;
  
  filteredPokemonsSwitchMap$ = this.initAutocompleteObservable(switchMap, this.autoCompleteSwitchMapControl, 'switchMap');
  filteredPokemonsConcatMap$ = this.initAutocompleteObservable(concatMap, this.autoCompleteConcatMapControl, 'concatMap');
  filteredPokemonsMergeMap$ = this.initAutocompleteObservable(mergeMap, this.autoCompleteMergeMapControl, 'mergeMap');
  filteredPokemonsExhaustMap$ = this.initAutocompleteObservable(exhaustMap, this.autoCompleteExhaustMapControl, 'exhaustMap');

  randomPokemon = toSignal(this.getRandomPokemonObserver());

  pokemonData = computed(() => {
    const pokemon = this.selectedPokemon();
    return {
      name: pokemon?.name || '',  
      picture: pokemon?.sprites?.bigPicture || '' 
    };
  });

  selectedOperator = 'switchMap'; 
  
  constructor() {
    effect(() => {
      const random = this.randomPokemon();
      if (random) {
        this.selectedPokemon.set(random);  // Ceci est sûr car effectué dans un effect
      }
    }, { allowSignalWrites: true });
  }

  initAutocompleteObservable(mapOperator: any, control: FormControl, operatorName: string): Observable<any> {
    return control.valueChanges.pipe(
      filter((value: string | null): value is string => value !== null),
      //debounceTime(300),
      //distinctUntilChanged(),
      tap(() => this.selectedOperator = operatorName),
      mapOperator((searchQuery: string) => searchQuery.length > 0 
        ? this.filterPokemonList(searchQuery, operatorName) : of([])),
      catchError((error) => {
        console.log(`initAutocompleteObservable (${operatorName}): `, error);
        return of(error);
      })
    );
  } 

  filterPokemonList(searchQuery: string, operatorName: string) {
    this.addLog(`Requête lancée avec ${this.selectedOperator} pour ${searchQuery}`, 'request');
    
    let delay = 100;    
    if (this.isDelay) {
      const delays = [5000, 3000, 200, 100];
      delay = delays[searchQuery.length];  // Choisir un délai basé sur la longueur
    }    
    return this.#pokemonApiService.getPokemonList(1500, delay).pipe(
      map((data: any) => {        
        return data.filter((pokemon: any) =>
          pokemon.name.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
      }),
      tap(() => this.addLog(`Réponse reçue avec ${this.selectedOperator} pour ${searchQuery}`, 'response')),
      catchError((error) => {
        console.log('filterPokemonList', operatorName, error);
        return of(error);
      })
    );
  }

  getRandomPokemonObserver() {
    return this.#pokemonClick$.pipe(
      tap(() => this.addLog('Requête lancée avec ExhaustMap', 'request')),
      exhaustMap(() => {          
          const randomId = Math.floor(Math.random() * 898) + 1;
          return this.#pokemonApiService.getPokemonById(randomId);          
      }),
      tap(() => {
        this.addLog('Réponse reçue avec ExhaustMap', 'response');        
      }),
      catchError((error) => {
        console.log('getRandomPokemonObserver', error);
        return of(null);
      })
    );
  }

  randomPokemonClick() {
    this.#pokemonClick$.next(); // Émet un événement lorsqu'on clique
  }

  addLog(message: string, type: 'request' | 'response') {
    this.logMessages.update(currentLogs => [...currentLogs, { message, type }]);
  }
}
