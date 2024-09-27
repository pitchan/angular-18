import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { PokemonApiService } from '../../../core/services/pokemon-api.service';
import { Pokemon } from '../../../core/model/pokemon.model';
import { RxjsService } from '../services/rxjs.service';

@Component({
  selector: 'app-rxjs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rxjs.component.html',
})
export class RxjsComponent {
  private pokemonApiService = inject(PokemonApiService);
  private rxjsService = inject(RxjsService);

  pokemon = signal<Pokemon | null>(null);
  loading = signal<boolean>(false);
  error = signal<string>('');

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
}
