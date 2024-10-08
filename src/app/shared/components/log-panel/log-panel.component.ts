import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';


import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RxjsService } from '../../../features/rxjs/services/rxjs.service';


@Component({
  selector: 'app-log-panel',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, MatIconModule, MatDividerModule, MatCardModule, MatCardModule, MatCardModule, MatChipsModule, MatButtonModule],
  templateUrl: './log-panel.component.html',
  styleUrls: ['./log-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogPanelComponent {
  
  #rxjsService = inject(RxjsService);

  logMessages = this.#rxjsService.logMessages;

  constructor() {}


  clearLogs() {
    this.#rxjsService.logMessages.set([]);
  }
}
