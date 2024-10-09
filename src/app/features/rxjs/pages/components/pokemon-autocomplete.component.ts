import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { Pokemon } from '../../../../core/model/pokemon.model'; 
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInput } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-autocomplete',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, MatAutocompleteModule, MatInput],
  templateUrl: './pokemon-autocomplete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonAutoCompleteComponent {
  pokemonList = input.required<Pokemon[]>();
  control = input.required<FormControl>();
  label = input.required<string>();
  selectedPokemon = model<Pokemon | null>();
  

  displayPokemon(pokemon?: Pokemon): string {
    return pokemon ? pokemon.name : '';
  }

  onPokemonSelect(event: any) {
    if (event?.option?.value) {
      this.selectedPokemon.set(event.option.value);
    }    
  }

  trackByFn(index: number, item: Pokemon) {
    return item.id; // or another unique property
  }
}
