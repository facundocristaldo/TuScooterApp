import { Component } from '@angular/core';
import { QrscannerPage } from '../qrscanner/qrscanner.page';
import { Router } from '@angular/router';
import { GoogleMapComponent } from './google-map/google-map.component';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';
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
    this.toastController.create({
        message:this.serverURL+"users/tiempodisponible?username="+this.username,
        duration:3000
      }).then(e=>e.present());
    this.http.get(this.serverURL+"users/tiempodisponible?username="+this.username,{},{
      'Accept':'*/*'
    }).then(response=>{
      let responseBody = response.data;
      this.toastController.create({
        message:"HTTPResponse:"+responseBody.body,
        duration:3000
      }).then(e=>e.present());
      this.platform.ready().then(()=>{
        this.storage.set("maxTimeToTravel",responseBody.body);
        this.alertController.create({
          header:"Tiempo máximo para usar el scooter",
          message:"Usted tiene "+responseBody.body+" segundos máximos para usar el scooter.",
          buttons:[
            {
            text:'Continuar',
            handler:()=>{
              this.toastController.create({
                message:"Aceptado",
                duration:2000
              }).then(e=>e.present());
              this.router.navigate(['qrscanner']);
              this.isStart=false;
            }
          },
          {
            text:'Cancelar',
            handler:()=>{
              this.toastController.create({
                message:"Cancelado...",
                duration:3000
              }).then(e=>e.present());
            }
          }]
        }).then(alert=>alert.present());
      });
    });    
  }

  stopTravel(){
    this.isStart=true;
  }
  ionViewWillEnter(){
    this.platform.ready().then(()=>{
      this.storage.get("userLoginInfo").then(data=>{
        this.username = data.username;
        this.storage.get("serverURL").then((serverurl)=>{
          this.serverURL=serverurl;
        });
      });      
    })
  }
  constructor(private router: Router, private google:GoogleMapComponent, private http:HTTP,private alertController:AlertController,private platform:Platform,private storage:Storage,private toastController:ToastController){}
}
