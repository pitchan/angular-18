import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, model } from '@angular/core';


import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-request-logs',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, MatIconModule, MatDividerModule, MatCardModule, MatCardModule, MatCardModule, MatChipsModule, MatButtonModule],
  templateUrl: './request-logs.component.html',
  styleUrls: ['./request-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestLogsComponent {
  
  logMessages = model.required<{message: string, type: 'request' | 'response'}[]>();
  
  constructor() {}


  clearLogs() {
    this.logMessages.set([]);
  }
}
