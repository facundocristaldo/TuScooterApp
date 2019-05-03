import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',             redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',        loadChildren: './login/login.module#LoginPageModule' },
  { path: 'home',         loadChildren: './home/home.module#HomePageModule'  },
  { path: 'list',         loadChildren: './list/list.module#ListPageModule'  },
  { path: 'register',     loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'profile',      loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'saldo',        loadChildren: './saldo/saldo.module#SaldoPageModule' },
  { path: 'qrscanner',    loadChildren: './qrscanner/qrscanner.module#QrscannerPageModule' },
  { path: 'travelinfo',   loadChildren: './travelinfo/travelinfo.module#TravelinfoPageModule' },
  { path: 'travelstate',  loadChildren: './travelstate/travelstate.module#TravelstatePageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
