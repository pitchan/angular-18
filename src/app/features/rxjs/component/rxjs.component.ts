import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { PokemonApiService } from '../../../core/services/pokemon-api.service';
import { Pokemon } from '../../../core/model/pokemon.model';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { CheckboxModule } from 'primeng/checkbox';

import { DividerModule } from 'primeng/divider';
import { RxjsService } from '../services/rxjs.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, concatMap, debounceTime, distinctUntilChanged, exhaustMap, filter, map, mergeMap, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, merge, of } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  standalone: true,
  imports: [CommonModule, AutoCompleteModule, ReactiveFormsModule, CheckboxModule, FormsModule, TagModule, ButtonModule, CardModule, DividerModule, ImageModule],
  templateUrl: './rxjs.component.html',
})
export class RxjsComponent {
  private readonly pokemonApiService = inject(PokemonApiService);
  private readonly rxjsService = inject(RxjsService);

  readonly autoCompleteSwitchMapControl = new FormControl();
  readonly autoCompleteConcatMapControl = new FormControl();
  readonly autoCompleteMergeMapControl = new FormControl();
  readonly autoCompleteExhaustMapControl = new FormControl();
  readonly delayControl = new FormControl();

  
  loading = signal<boolean>(false);
  logMessages = signal<{message: string, type: 'info' | 'success'}[]>([]);

  selectedPokemon = signal<Pokemon | null>(null);  // Signal pour le Pokémon sélectionné
  filteredPokemons = signal<Pokemon[]>([]);        // Signal pour la liste des Pokémon filtrés
  isDelay = signal<boolean>(false);
  filteredPokemons$ = merge(
    this.initAutocompleteSwitchMapObservable(),
    this.initAutocompleteConcatMapObservable(),
    this.initAutocompleteMergeMapObservable(),
    this.initAutocompleteExhaustMapObservable(),
  );

  selectedOperator = 'switchMap';
  operatorControl = new FormControl('switchMap'); // Valeur initiale

  constructor() {}

  /*loadRandomPokemon() {
    this.loading.set(true);
    this.error.set('');

    const randomId = Math.floor(Math.random() * 898) + 1; // ID entre 1 et 898

    this.pokemonApiService.getPokemon(randomId.toString()).subscribe({
      next: (data) => {
        console.log(data);
        this.selectedPokemon.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement du Pokémon.');
        this.loading.set(false);
      },
    });
  } */

  

  initAutocompleteSwitchMapObservable() {
    return this.autoCompleteSwitchMapControl.valueChanges
      .pipe(
        filter((value: string | null): value is string => value !== null && value.length > 0),
        //debounceTime(300),
        //distinctUntilChanged(),    
        tap(() => this.selectedOperator = 'switchMap'),    
        switchMap((searchQuery: string) => this.filterPokemonList(searchQuery, 'switchMap')),
        catchError((error) => {
          console.log('initAutocompleteSwitchMapObservable: ', error);
          return of(error);
        })
      )
  }

  initAutocompleteConcatMapObservable() {
    return this.autoCompleteConcatMapControl.valueChanges
      .pipe(
        filter((value: string | null): value is string => value !== null && value.length > 0),
        //debounceTime(300),
        //distinctUntilChanged(),        
        tap(() => this.selectedOperator = 'concatMap'),
        concatMap((searchQuery: string) => this.filterPokemonList(searchQuery, 'concatMap')),
        catchError((error) => {
          console.log('initAutocompleteConcatMapObservable: ', error);
          return of(error);
        })
      )
  }

  initAutocompleteMergeMapObservable() {
    return this.autoCompleteMergeMapControl.valueChanges
      .pipe(
        filter((value: string | null): value is string => value !== null && value.length > 0),
        //debounceTime(300),
        //distinctUntilChanged(),  
        tap(() => this.selectedOperator = 'mergeMap'),       
        mergeMap((searchQuery: string) => this.filterPokemonList(searchQuery, 'mergeMap')),
        catchError((error) => {
          console.log('initAutocompleteMergeMapObservable: ', error);
          return of(error);
        })
      )
  }

  initAutocompleteExhaustMapObservable() {
    return this.autoCompleteExhaustMapControl.valueChanges
      .pipe(
        filter((value: string | null): value is string => value !== null && value.length > 0),
        
        //debounceTime(300),
        //distinctUntilChanged(),    
        tap(() => this.selectedOperator = 'exhaustMap'),    
        exhaustMap((searchQuery: string) => this.filterPokemonList(searchQuery, 'exhaustMap'))        
      )
  }

  filterPokemonList(searchQuery: string, operatorName: string) {
    this.addLog(`Requête lancée avec ${this.selectedOperator} pour ${searchQuery}`, 'info');
    
    let delay = 100;
    if (this.isDelay()) {
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
      catchError((error) => {
        console.log('filterPokemonList', operatorName, error);
        return EMPTY;
      })
    );
  }

  onPokemonSelect(event: any) {
    if (event?.value?.name) {
      this.selectedPokemon.set(event.value);
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
