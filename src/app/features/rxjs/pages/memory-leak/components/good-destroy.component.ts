import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { HighlightJsDirective } from 'ngx-highlight-js';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { Pokemon } from '../../../../../core/model/pokemon.model';


@Component({
  selector: 'app-bad-destroy',
  standalone: true,
  imports: [CommonModule, MatButtonModule, HighlightJsDirective, MatRadioModule],  
  templateUrl: './bad-destroy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoodDestroyComponent {
    constructor() {}
}
