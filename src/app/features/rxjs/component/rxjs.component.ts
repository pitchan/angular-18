import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { PokemonApiService } from '../../../core/services/pokemon-api.service';
import { Pokemon } from '../../../core/model/pokemon.model';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';

import { DividerModule } from 'primeng/divider';
import { RxjsService } from '../services/rxjs.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { concatMap, debounceTime, distinctUntilChanged, exhaustMap, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  standalone: true,
  imports: [CommonModule, AutoCompleteModule, ReactiveFormsModule, RadioButtonModule, FormsModule, TagModule, ButtonModule, CardModule, DividerModule, ImageModule],
  templateUrl: './rxjs.component.html',
})
export class RxjsComponent implements OnInit {
  private pokemonApiService = inject(PokemonApiService);
  private rxjsService = inject(RxjsService);

  autoCompleteSwitchMapControl = new FormControl();
  autoCompleteConcatMapControl = new FormControl();
  autoCompleteMergeMapControl = new FormControl();
  autoCompleteExhaustMapControl = new FormControl();
  
  loading = signal<boolean>(false);
  logMessages = signal<{message: string, type: 'info' | 'success'}[]>([]);

  selectedPokemon = signal<Pokemon | null>(null);  // Signal pour le Pokémon sélectionné
  filteredPokemons = signal<Pokemon[]>([]);        // Signal pour la liste des Pokémon filtrés
  error = signal<string>('');

  selectedOperator = 'switchMap';
  operatorControl = new FormControl('switchMap'); // Valeur initiale

  constructor() {}

  ngOnInit() {
    // Ecoute les changements de valeurs de l'autoComplete
    this.initAutocompleteSwitchMapObservable();
    this.initAutocompleteConcatMapObservable();
    this.initAutocompleteMergeMapObservable();
    this.initAutocompleteExhaustMapObservable();
  }

  loadRandomPokemon() {
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
  }  

  initAutocompleteSwitchMapObservable() {
    this.autoCompleteSwitchMapControl.valueChanges
      .pipe(
        filter((value: string | null): value is string => value !== null && value.length > 0),
        //debounceTime(300),
        //distinctUntilChanged(),    
        tap(() => this.selectedOperator = 'switchMap'),    
        switchMap((searchQuery: string) => this.filterPokemonList(searchQuery))
      )
      .subscribe((filteredResults: any[]) => {
        this.filteredPokemons.set(filteredResults);
      });
  }

  initAutocompleteConcatMapObservable() {
    this.autoCompleteConcatMapControl.valueChanges
      .pipe(
        filter((value: string | null): value is string => value !== null && value.length > 0),
        //debounceTime(300),
        //distinctUntilChanged(),        
        tap(() => this.selectedOperator = 'concatMap'),
        concatMap((searchQuery: string) => this.filterPokemonList(searchQuery))
      )
      .subscribe((filteredResults: any[]) => {
        this.filteredPokemons.set(filteredResults);
      });
  }

  initAutocompleteMergeMapObservable() {
    this.autoCompleteMergeMapControl.valueChanges
      .pipe(
        filter((value: string | null): value is string => value !== null && value.length > 0),
        //debounceTime(300),
        //distinctUntilChanged(),  
        tap(() => this.selectedOperator = 'mergeMap'),       
        mergeMap((searchQuery: string) => this.filterPokemonList(searchQuery))
      )
      .subscribe((filteredResults: any[]) => {
        this.filteredPokemons.set(filteredResults);
      });
  }

  initAutocompleteExhaustMapObservable() {
    this.autoCompleteExhaustMapControl.valueChanges
      .pipe(
        filter((value: string | null): value is string => value !== null && value.length > 0),
        
        //debounceTime(300),
        //distinctUntilChanged(),    
        tap(() => this.selectedOperator = 'exhaustMap'),    
        exhaustMap((searchQuery: string) => this.filterPokemonList(searchQuery))
      )
      .subscribe((filteredResults: any[]) => {
        this.filteredPokemons.set(filteredResults);
      });
  }

  filterPokemonList(searchQuery: string) {
    this.addLog(`Requête lancée avec ${this.selectedOperator} pour ${searchQuery}`, 'info');
    /*const delays = [5000, 3000, 200, 100];
    const delay = delays[searchQuery.length] || 100;  // Choisir un délai basé sur la longueur*/
    
    return this.pokemonApiService.getPokemonList(1500, 100).pipe(
      map((data: any) => {
        this.addLog(`Réponse reçue avec ${this.selectedOperator} pour ${searchQuery}`, 'success');
        return data.filter((pokemon: any) =>
          pokemon.name.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
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
