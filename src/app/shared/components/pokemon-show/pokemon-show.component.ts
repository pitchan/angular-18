import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-pokemon-show',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './pokemon-show.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonShowComponent {
  name = input.required<string>();
  picture = input.required<string>();

  openPreview(imageUrl: string | undefined) {
    return;
  }
}
