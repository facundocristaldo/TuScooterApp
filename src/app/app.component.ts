import { Component } from '@angular/core';

import { Platform, NavController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotif } from './WebSocket/LocalNotif';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  HOST;
  PORT;
  ws ;
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
  intervalo;

  notif = new LocalNotif();
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private plt:Platform,
    private storage:Storage,
    private backgroundmode: BackgroundMode,
    private navController : NavController,
    public globalEvents:Events
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
     
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backgroundmode.enable();
      this.platform.backButton.unsubscribe();
      this.startLookingUserToConnectWebSocket();
      
    });
  }
  startLookingUserToConnectWebSocket(){
    this.intervalo = setInterval(()=>{
      this.platform.ready().then(()=>{
        this.storage.get("userLoginInfo").then(userLoginInfo=>{
          if (userLoginInfo!=null && userLoginInfo!=undefined ){
            if (userLoginInfo.username!=null && userLoginInfo.username!=undefined && userLoginInfo.username!=""){
              this.storage.get("serverIP").then(host=>{
                if (host){
                  this.HOST=host;
                  this.storage.get("serverPORT").then(port=>{
                    if (port){
                    this.PORT=port;        
                    this.connect(userLoginInfo.username);
                    console.log("frenando timer")
                    clearInterval(this.intervalo);
                    }
                  })
                }
              })
            }
          }
        })
      })
    },2000);
  }

  connect(username){
    var SERVER_URL = "ws://"+this.HOST+":"+this.PORT+"/Proyecto-2019Web/notifications/client/";
    this.ws = new WebSocket(SERVER_URL+username,[]);
    console.log("connected"+this.ws.data)
    this.ws.onmessage = this.handleMessage;
    this.ws.onerror = this.handleError;
    this.ws.onopen = this.handleOpen;
      
  }

  
 handleMessage(data){
   if (this.notif==undefined || this.notif==null){
     this.notif = new LocalNotif()
     this.notif.sendNotif(data.data);
    }else{
     this.notif.sendNotif(data.data);

   }
}

 handleError(data){
  console.log("error ws:"+data.data)
}
 handleOpen(data){
  console.log("Connected:"+data.target.url)
}

sendMessage(message){
  this.ws.send(message)
}  
  
  logout(){
    this.plt.ready().then(()=>{
      this.storage.set("userLoginInfo",null).then(userLoginInfo=>{
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.close();
          this.startLookingUserToConnectWebSocket();
        }
        this.navController.navigateRoot(['login']);
      })
    });
  }
}
