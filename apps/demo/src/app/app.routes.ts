import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./main/main.component').then((m) => m.MainComponent),
  },
];
