import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, CardModule, StyleClassModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
}