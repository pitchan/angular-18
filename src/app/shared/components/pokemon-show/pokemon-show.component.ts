import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-pokemon-show',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './pokemon-show.component.html',
  styleUrl: './pokemon-show.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonShowComponent {
  name = input.required<string>();
  picture = input.required<string>();
  state = computed(() => {
    return {
      picture: this.picture(),
      isImageLoaded: signal(false)
    }    
  });;

  openPreview(imageUrl: string | undefined) {
    return;
  }

  onImageLoad() {
    this.state().isImageLoaded.set(true);
  }
}
