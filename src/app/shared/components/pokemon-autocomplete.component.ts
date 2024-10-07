import { Component, input } from '@angular/core';
import { Pokemon } from '../../../core/model/pokemon.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-pokemon-autocomplete',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, MatAutocompleteModule, MatInput],
  templateUrl: './pokemon-autocomplete.component.html',
})
export class PokemonAutoCompleteComponent {
  pokemonList = input.required<Pokemon[]>();
  control = input.required<FormControl>();
  label = input.required<string>();

  displayPokemon(pokemon?: Pokemon): string {
    return pokemon ? pokemon.name : '';
  }

  trackByFn(index: number, item: Pokemon) {
    return item.id; // or another unique property
  }
}
