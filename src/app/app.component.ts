import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <h1>Hello from {{ name }}!</h1>
    <nav>
      <button routerLink="home">GO TO HOME</button>      
      <br>
      <button routerLink="rxjs">GO TO RXJS</button>
      <br>
      <button routerLink="vega">GO TO VEGA</button>      
    </nav>    
    <router-outlet></router-outlet> 
  `,
})
export class AppComponent {
  name = 'Angular';
}