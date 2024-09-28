import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
import { concatMap, debounceTime, distinctUntilChanged, exhaustMap, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-rxjs',
  standalone: true,
  imports: [CommonModule, AutoCompleteModule, ReactiveFormsModule, RadioButtonModule, FormsModule, TagModule, ButtonModule, CardModule, DividerModule, ImageModule],
  templateUrl: './rxjs.component.html',
})
export class RxjsComponent {
  private pokemonApiService = inject(PokemonApiService);
  private rxjsService = inject(RxjsService);

  autoCompletePokemonControl = new FormControl();
  
  loading = signal<boolean>(false);
  logMessages = signal<{message: string, type: 'info' | 'success'}[]>([]);

  pokemon = signal<Pokemon | null>(null);
  selectedPokemon = signal<Pokemon | null>(null);  // Signal pour le Pokémon sélectionné
  filteredPokemons = signal<Pokemon[]>([]);        // Signal pour la liste des Pokémon filtrés
  error = signal<string>('');

  selectedFunction: 'switchMap' | 'mergeMap' = 'switchMap';

  constructor() {}

  loadRandomPokemon() {
    this.loading.set(true);
    this.error.set('');

    const randomId = Math.floor(Math.random() * 898) + 1; // ID entre 1 et 898

    this.pokemonApiService.getPokemon(randomId.toString()).subscribe({
      next: (data) => {
        console.log(data);
        this.pokemon.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement du Pokémon.');
        this.loading.set(false);
      },
    });
  }

  filterPokemonsByName(event: any) {
    if (this.selectedFunction === 'switchMap') {
      this.filterPokemonsByNameWithSwitch(event);
    } else {
      this.filterPokemonsByNameWithConcat(event);
    }
  }

  // Méthode appelée à chaque saisie pour filtrer les Pokémon
  filterPokemonsByNameWithSwitch(event: any) {
    const query = event.query.toLowerCase();
    of(query)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchQuery) => {
          this.addLog(`Requête lancée avec switchMap pour ${searchQuery}`, 'info');
          const delays = [5000, 3000, 200, 100];
          const delay = delays[searchQuery.length];
          return this.pokemonApiService.getPokemonList(1500, delay).pipe(
            map((data: any) => {
              this.addLog(`Réponse reçue avec switchMap pour ${searchQuery}`, 'success');
              return data.filter((pokemon: any) =>
                pokemon.name.toLowerCase().startsWith(searchQuery)
              );
            })
          );
        })
      )
      .subscribe((filteredResults: any[]) => {
        this.filteredPokemons.set(filteredResults);
      });
  }

  /*filterPokemonsByNameWithSwitch(event: any) {
    const query = event.query.toLowerCase();
    this.pokemonApiService.getPokemonList(1500).pipe(
      debounceTime(300), 
      distinctUntilChanged(),
      switchMap((data: Pokemon[] | any) => {
        return of(data.results.filter((pokemon: any) => 
          pokemon.name.toLowerCase().startsWith(query)
        ));
      })
    ).subscribe((filteredResults: any) => {
      console.log('Avec switchMap')
      this.filteredPokemons.set(filteredResults)
    });
  }*/

  /*filterPokemonsByNameWithMerge(event: any) {
    const query = event.query.toLowerCase();
    
    this.pokemonApiService.getPokemonList(1500).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      mergeMap((data: any) => { // Utilisation de concatMap
        return of(data.results.filter((pokemon: any) => 
          pokemon.name.toLowerCase().startsWith(query)
        ));
      })
    ).subscribe((filteredResults: any) => {
      console.log('Avec concatMap');
      this.filteredPokemons.set(filteredResults);
    });
  }*/

  // Méthode appelée à chaque saisie pour filtrer les Pokémon
  filterPokemonsByNameWithConcat(event: any) {
    const query = event.query.toLowerCase();    
    of(query)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        concatMap((searchQuery) => {
          this.addLog(`Requête lancée avec concatMap pour ${searchQuery}`, 'info');
          const delays = [5000, 2000, 200];
          const delay = delays[searchQuery.length];
          return this.pokemonApiService.getPokemonList(1500, delay).pipe(
            map((data: any) => {
              this.addLog(`Réponse reçue avec concatMap pour ${searchQuery}`, 'success');
              return data.filter((pokemon: any) =>
                pokemon.name.toLowerCase().startsWith(searchQuery)
              );
            })
          );
        })
      )
      .subscribe((filteredResults: any[]) => {
        this.filteredPokemons.set(filteredResults);
      });
  }

  onPokemonSelect(event: any) {
    if (event?.value?.name) {
      this.selectedPokemon.set(event.value);
    }    
  }

  clearAll() {
    this.clearLogs();
    this.autoCompletePokemonControl.reset();
  }

  clearLogs() {
    this.logMessages.set([]);
  }

  addLog(message: string, type: 'info' | 'success') {
    const currentLogs = this.logMessages();
    this.logMessages.set([...currentLogs, { message, type }]);
  }
}
