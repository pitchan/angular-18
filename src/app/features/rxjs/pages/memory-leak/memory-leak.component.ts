import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TakeUntilComponent } from './components/take-until.component';
import { MatButtonModule } from '@angular/material/button';
import { LogPanelComponent } from '../../../../shared/components/log-panel/log-panel.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [CommonModule, TakeUntilComponent, MatButtonModule, MatCardModule, LogPanelComponent],
  templateUrl: './memory-leak.component.html'
})
export class MemoryLeakComponent {
  componentExist = true;

  destroyComponent() {
    this.componentExist = false;
  }
}
