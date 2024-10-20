import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, WritableSignal, inject, input } from '@angular/core';
import { BadDestroyComponent } from './components/bad-destroy.component';
import { MatButtonModule } from '@angular/material/button';
import { LogPanelComponent } from '../../../../shared/components/log-panel/log-panel.component';
import { MatCardModule } from '@angular/material/card';
import { PokemonShowComponent } from '../../../../shared/components/pokemon-show/pokemon-show.component';
import { RxjsService } from '../../services/rxjs.service';
import { GoodDestroyComponent } from './components/good-destroy.component';
import { Pokemon } from '../../../../core/model/pokemon.model';

@Component({
  standalone: true,
  imports: [CommonModule, BadDestroyComponent, GoodDestroyComponent, MatButtonModule, MatCardModule, LogPanelComponent, PokemonShowComponent],
  templateUrl: './memory-leak.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemoryLeakComponent {

  #rxjsService = inject(RxjsService);

  // Information given by route :way parameter
  way = input.required<string>();
  
  componentExist = true;
  pokemon: WritableSignal<Pokemon | null> = this.#rxjsService.currentPokemon;

  pokemon$ = this.#rxjsService.currentPokemon$;

  destroyComponent() {
    this.componentExist = false;
  }

  reloadComponent() {
    this.componentExist = true;
  }
}
