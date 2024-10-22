import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, computed, input, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject, fromEvent, map, merge } from 'rxjs';

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
  });

  imageLoaded$ = new BehaviorSubject(false);
  
  showPokemon$ = merge(
    toObservable(this.picture).pipe(map(() => false)),  // When image change
    this.imageLoaded$.pipe(map(() => true)) // When image is loaded
  );

  openPreview(imageUrl: string | undefined) {
    return;
  }

  onImageLoadWithObservable() {
    this.imageLoaded$.next(true);
  }

  onImageLoadWithSignal() {
    this.state().isImageLoaded.set(true);
  }
}
