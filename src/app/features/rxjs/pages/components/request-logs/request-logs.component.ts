import { CommonModule } from '@angular/common';
import { Component, model } from '@angular/core';


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
})
export class RequestLogsComponent {
  
  logMessages = model<{message: string, type: 'info' | 'success'}[]>([]);
  
  constructor() {}


  clearAll() {
    this.clearLogs();
  }

  clearLogs() {
    this.logMessages.set([]);
  }
}
