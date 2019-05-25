import { Component } from '@angular/core';
import { QrscannerPage } from '../qrscanner/qrscanner.page';
import { Router } from '@angular/router';
import { GoogleMapComponent } from './google-map/google-map.component';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController, Platform, ToastController, NavController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isStart = true;
  username = "";
  serverURL = "";

  startTravel(){
  
    // this.toastController.create({
    //     message:this.serverURL+"users/tiempodisponible?username="+this.username,
    //     duration:3000
    //   }).then(e=>e.present());
    this.http.get(this.serverURL+"users/tiempodisponible",{
      username:this.username
    },{}).then(response=>{
      let responseBody = JSON.parse(response.data);
      // this.toastController.create({
      //   message:"HTTPResponse:"+responseBody.body,
      //   duration:3000
      // }).then(e=>e.present());
      this.platform.ready().then(()=>{
        this.storage.set("maxTimeToTravel",responseBody.body);
        if(responseBody.body==null || responseBody.body==0){
          this.alertController.create({
            header:"Saldo insuficiente",
            message:"Usted no tiene saldo para realizar un viaje",
            buttons:[
              {
                text:"Aceptar"
              }
            ]
          }).then(e=>e.present());
        }else{

          this.alertController.create({
            header:"Tiempo máximo para usar el scooter",
            message:"Usted tiene "+responseBody.body+" segundos máximos para usar el scooter.",
            buttons:[
            {
              text:'Cancelar',
              handler:()=>{
                this.toastController.create({
                  message:"Cancelado...",
                  duration:3000
                }).then(e=>e.present());
              }
            }, {
              text:'Continuar',
              handler:()=>{
                this.navController.navigateRoot("/qrscanner")
//                this.router.navigate(['/qrscanner']);
                this.isStart=false;
              }
            }]
          }).then(alert=>alert.present());
        }
      });
    });    
  }

  stopTravel(){
    this.isStart=true;
  }
  ionViewWillEnter(){
    this.menuController.enable(true);
    this.platform.ready().then(()=>{
      this.storage.get("userLoginInfo").then(data=>{
        this.username = data.username;
        this.storage.get("serverURL").then((serverurl)=>{
          this.serverURL=serverurl;
        });
      });      
    })
  }
  ionViewWillLeave(){
    // this.google.map.setDiv(null);
  }
  ngOnDestroy(){
    console.log("destroy home")
  }

  constructor(private router: Router,private navController:NavController, private google:GoogleMapComponent, private http:HTTP,private alertController:AlertController,private platform:Platform,private storage:Storage,private toastController:ToastController,private menuController:MenuController){}
}
  