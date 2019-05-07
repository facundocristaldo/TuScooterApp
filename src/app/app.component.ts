import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  
  public appPages = [
    {
      title: 'Inicio',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Perfil',
      url: '/profile',
      icon: 'person'
    },
    {
      title: 'Viajes',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Saldo',
      url: '/saldo',
      icon: 'card'
    }
  ];


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private plt:Platform,
    private storage:Storage,
    private router:Router
  ) {
    this.initializeApp();
    // this.platform.ready().then(()=>{
    //   this.storage.set("serverIP","localhost").then(()=>{
    //     this.storage.set("serverPORT","8080");
    //   })
    // });
  }

  initializeApp() {
    this.platform.ready().then(() => {
     
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  

  
  logout(){
    this.plt.ready().then(()=>{
      this.storage.set("userLoginInfo",null).then(userLoginInfo=>{
        this.router.navigate(['login']);
      })
    });
  }
}
