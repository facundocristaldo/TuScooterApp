import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { PayPal } from '@ionic-native/paypal/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HomePage } from './home/home.page';
import { GoogleMapComponent } from './home/google-map/google-map.component';
import { TravelstatePage } from './travelstate/travelstate.page';
import { ProfilePage } from './profile/profile.page';
import { QrscannerPage } from './qrscanner/qrscanner.page';
import { LoginPage } from './login/login.page';
import { ListPage } from './list/list.page';
import { RegisterPage } from './register/register.page';
import { SaldoPage } from './saldo/saldo.page';
import { TravelinfoPage } from './travelinfo/travelinfo.page';
import { IonicStorageModule } from '@ionic/storage';
import { ChangeipPage } from './changeip/changeip.page';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Network } from '@ionic-native/network/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { GlobalProperties } from './Classes/GlobalProperties';

@NgModule({
  declarations: [AppComponent,
    HomePage,
    GoogleMapComponent,
    TravelstatePage,
    TravelinfoPage,
    ProfilePage,
    QrscannerPage,
    LoginPage,
    ListPage,
    RegisterPage,
    SaldoPage,
    ChangeipPage,
  ],
  entryComponents: [
    AppComponent,
    HomePage,
    ChangeipPage,
    GoogleMapComponent,
    TravelstatePage,
    TravelinfoPage,
    ProfilePage,
    QrscannerPage,
    LoginPage,
    ListPage,
    RegisterPage,
    SaldoPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    QRScanner,
    HTTP,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    PayPal,
    Geolocation,
    GoogleMapComponent,
    BackgroundMode,
    ImagePicker,
    Network,
    LocalNotifications,
    GlobalProperties
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
