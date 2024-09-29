import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, map, switchMap } from 'rxjs';
import { Pokemon } from '../model/pokemon.model'; 
import { mapPokemonList } from '../mappers/pokemon.mapper';

@Injectable({
  providedIn: 'root',
})
export class PokemonApiService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer une liste de Pokémon
  getPokemons(limit: number = 10): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(`${this.apiUrl}?limit=${limit}`);
  }

  // Méthode pour récupérer un Pokémon par son nom
  getPokemon(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/${name.toLowerCase()}`);
  }

  // Récupérer la liste des Pokémon
  getPokemonList(limit: number, customDelay: number) {
    return this.http.get(`${this.apiUrl}?limit=${limit}`).pipe(
      //delay(Math.floor(Math.random() * (3000 - 100 + 1)) + 100),
      delay(customDelay),
      map((data: any) => mapPokemonList(data || []))
    );
  }
}
