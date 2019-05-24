import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login/login.page';
import { HomePage } from './home/home.page';
import { ListPage } from './list/list.page';
import { RegisterPage } from './register/register.page';
import { ProfilePage } from './profile/profile.page';
import { QrscannerPage } from './qrscanner/qrscanner.page';
import { TravelinfoPage } from './travelinfo/travelinfo.page';
import { TravelstatePage } from './travelstate/travelstate.page';
import { SaldoPage } from './saldo/saldo.page';
import { ChangeipPage } from './changeip/changeip.page';


const routes: Routes = [
  { path: '',             redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',        component: LoginPage },
  { path: 'home',         component: HomePage  },
  { path: 'list',         component: ListPage },
  { path: 'register',     component: RegisterPage },
  { path: 'profile',      component: ProfilePage },
  { path: 'qrscanner',    component: QrscannerPage },
  { path: 'travelinfo/:id',   component: TravelinfoPage },
  { path: 'travelstate',  component: TravelstatePage},
  { path: 'saldo',        component: SaldoPage },
  { path: 'changeip', component: ChangeipPage },
];
 
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
