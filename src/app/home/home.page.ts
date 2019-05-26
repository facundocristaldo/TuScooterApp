import { Component } from '@angular/core';
import { QrscannerPage } from '../qrscanner/qrscanner.page';
import { Router } from '@angular/router';
import { GoogleMapComponent } from './google-map/google-map.component';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController, Platform, ToastController, NavController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Timer } from '../travelstate/travelstate.page';

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
  
    this.http.get(this.serverURL+"users/tiempodisponible",{
      username:this.username
    },{}).then(response=>{
      let responseBody = JSON.parse(response.data);
      this.platform.ready().then(()=>{
        this.storage.set("maxTimeToTravel",Number((Number(responseBody.body)).toFixed(0)));
        let tiempoMax = new Timer();
          for(var i =0 ; i<Number((Number(responseBody.body)).toFixed(0));i++){
            tiempoMax.addSecond();
          }
        if(responseBody.body==null || responseBody.body<=30 || tiempoMax.toString()=="00:00:00"){
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
            message:"Usted tiene "+tiempoMax.toString()+" segundos máximos para usar el scooter.",
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
  }
  ngOnDestroy(){
    console.log("destroy home")
  }

  constructor(private router: Router,private navController:NavController, private google:GoogleMapComponent, private http:HTTP,private alertController:AlertController,private platform:Platform,private storage:Storage,private toastController:ToastController,private menuController:MenuController){}
}
  