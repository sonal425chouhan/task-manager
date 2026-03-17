import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@app/features/login/pages/login.page').then(m => m.LoginPage)
  },
  {
    path: 'tasks',
    canActivate: [AuthGuard],
    loadComponent: () => import('@app/features/tasks/pages/tasks.page').then(m => m.TasksPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
