import { Routes } from '@angular/router';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { Survey } from '@app/modules/coach/survey/survey';
import { Feedback } from './modules/employee/feedback/feedback';
import { History } from './modules/employee/history/history';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./core/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'coach1',
    loadChildren: () => import('./modules/coach/coach.module').then((m) => m.CoachModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'employee',
    loadChildren: () => import('./modules/employee/employee.module').then((m) => m.EmployeeModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/coach',
    pathMatch: 'full',
  },
  {
    path: 'coach',
    component: Survey,
  },
  {
    path: 'feedback',
    component: Feedback,
  },
  {
    path: 'history',
    component: History,
  },
  {
    path: '**',
    redirectTo: '/coach',
  },
];
