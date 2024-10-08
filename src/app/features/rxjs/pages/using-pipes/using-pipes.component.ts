import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { PokemonApiService } from '../../../../core/services/pokemon-api.service';
import { Pokemon } from '../../../../core/model/pokemon.model';

import { RxjsService } from '../../services/rxjs.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, concatMap, debounceTime, distinctUntilChanged, exhaustMap, filter, map, mergeMap, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, merge, of } from 'rxjs';

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


@Component({
  selector: 'app-using-pipes',
  standalone: true,
  imports: [CommonModule, PokemonAutoCompleteComponent, ReactiveFormsModule, MatCheckboxModule, FormsModule, MatIconModule, MatDividerModule, MatButtonModule, MatCardModule, MatCardModule, MatButtonModule, MatCardModule, MatAutocompleteModule, MatInputModule, MatFormFieldModule, MatChipsModule, RequestLogsComponent],
  templateUrl: './using-pipes.component.html',
})
export class UsingPipesComponent {
  private readonly pokemonApiService = inject(PokemonApiService);
  private readonly rxjsService = inject(RxjsService);

  readonly autoCompleteSwitchMapControl = new FormControl();
  readonly autoCompleteConcatMapControl = new FormControl();
  readonly autoCompleteMergeMapControl = new FormControl();
  readonly autoCompleteExhaustMapControl = new FormControl();
  
  loading = signal<boolean>(false);
  logMessages = signal<{message: string, type: 'info' | 'success'}[]>([]);

  selectedPokemon = signal<Pokemon | null>(null);  // Signal pour le Pokémon sélectionné
  isDelay = false;
  
  filteredPokemonsSwitchMap$ = this.initAutocompleteObservable(switchMap, this.autoCompleteSwitchMapControl, 'switchMap');
  filteredPokemonsConcatMap$ = this.initAutocompleteObservable(concatMap, this.autoCompleteConcatMapControl, 'concatMap');
  filteredPokemonsMergeMap$ = this.initAutocompleteObservable(mergeMap, this.autoCompleteMergeMapControl, 'mergeMap');
  filteredPokemonsExhaustMap$ = this.initAutocompleteObservable(exhaustMap, this.autoCompleteExhaustMapControl, 'exhaustMap');

  selectedOperator = 'switchMap';
  operatorControl = new FormControl('switchMap'); // Valeur initiale
  
  constructor() {}

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
    this.addLog(`Requête lancée avec ${this.selectedOperator} pour ${searchQuery}`, 'info');
    
    let delay = 100;    
    if (this.isDelay) {
      const delays = [5000, 3000, 200, 100];
      delay = delays[searchQuery.length];  // Choisir un délai basé sur la longueur
    }    
    return this.pokemonApiService.getPokemonList(1500, delay).pipe(
      map((data: any) => {
        this.addLog(`Réponse reçue avec ${this.selectedOperator} pour ${searchQuery}`, 'success');
        return data.filter((pokemon: any) =>
          pokemon.name.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
      }),
      tap((list) => console.dir(list)),
      catchError((error) => {
        console.log('filterPokemonList', operatorName, error);
        return of(error);
      })
    );
  }

  openPreview(imageUrl: string | undefined) {
    return;
  }

  onPokemonSelect(event: any) {
    if (event?.source?.value?.sprites?.picture) {
      this.selectedPokemon.set(event.source.value);
    }    
  }

  clearAll() {
    this.clearLogs();
    this.autoCompleteSwitchMapControl.reset();
  }

  clearLogs() {
    this.logMessages.set([]);
  }

  addLog(message: string, type: 'info' | 'success') {
    const currentLogs = this.logMessages();
    this.logMessages.set([...currentLogs, { message, type }]);
  }
}
