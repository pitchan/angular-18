import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/component/home.component';

export const routes: Routes = [  
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'vega',
    loadComponent: () =>
      import('./features/vega/component/vega.component').then(
        (c) => c.VegaComponent
      ),
  },
  {
    path: 'rxjs',
    loadComponent: () =>
      import('./features/rxjs/pages/rxjs.component').then(
        (c) => c.RxjsComponent
      ),
  },
  // Vous pouvez ajouter d'autres routes ici
];
