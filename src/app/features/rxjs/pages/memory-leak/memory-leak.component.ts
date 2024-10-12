import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BadDestroyComponent } from './components/bad-destroy.component';
import { MatButtonModule } from '@angular/material/button';
import { LogPanelComponent } from '../../../../shared/components/log-panel/log-panel.component';
import { MatCardModule } from '@angular/material/card';
import { PokemonShowComponent } from '../../../../shared/components/pokemon-show/pokemon-show.component';
import { RxjsService } from '../../services/rxjs.service';

@Component({
  standalone: true,
  imports: [CommonModule, BadDestroyComponent, MatButtonModule, MatCardModule, LogPanelComponent, PokemonShowComponent],
  templateUrl: './memory-leak.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemoryLeakComponent {

  #rxjsService = inject(RxjsService);
  
  componentExist = true;
  pokemon = this.#rxjsService.currentPokemon;

  destroyComponent() {
    this.componentExist = false;
  }

  reloadComponent() {
    this.componentExist = true;
  }
}
