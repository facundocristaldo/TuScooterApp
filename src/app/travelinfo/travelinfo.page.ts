import { Component, OnInit, Input } from '@angular/core';
import { Platform, MenuController, ToastController, NavParams, NavController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { GoogleMapComponent } from '../home/google-map/google-map.component';

@Component({
  selector: 'app-travelinfo',
  templateUrl: './travelinfo.page.html',
  styleUrls: ['./travelinfo.page.scss'],
})
export class TravelinfoPage implements OnInit {
  alquilerguid="";
  alquiler :{
    guidalquiler,
    duracion,
    precio,
    guidscooter,
    cliente,
    recorrido
  };
  constructor(
    private platform:Platform,
    private storage:Storage,
    private menuCtl:MenuController,
    private http:HTTP,
    private activatedroute:ActivatedRoute,
    private google : GoogleMapComponent,
    private navController: NavController
  ) { }

  ngOnInit() {
    
  }
   ngOnDestroy(){
     console.log("travel info destroy")
   }
  ionViewWillEnter(){
    console.log("enter")
    this.alquilerguid = this.activatedroute.snapshot.paramMap.get("id")
    console.log("enter2")
    this.menuCtl.enable(true);
    console.log("enter3")
    this.platform.ready().then(()=>{
      console.log("enter4")
      this.storage.get("serverURL").then(serverURL=>{
        console.log("enter5")
        // this.guidScooter=scooter;
        // this.storage.get("alquiler").then(alquilerstorage=>{
          
          this.http.get(serverURL+"alquileres/find?guid="+this.alquilerguid,{},{}).then(response=>{
            console.log(response.data)
            // let responseBody = JSON.parse(response.data);
            // if (responseBody.success.toString()=="true" && responseBody.body){
            //   let alquilerinfo = responseBody.body;
            //   this.alquiler={
            //     guidalquiler : alquilerinfo.guid,
            //     duracion : (alquilerinfo.duration)?alquilerinfo.duration:0,
            //     precio : (alquilerinfo.price)?alquilerinfo.price:0,
            //     guidscooter : (alquilerinfo.guidscooter)?alquilerinfo.guidscooter:"",
            //     cliente : alquilerinfo.cliente,
            //     recorrido : (alquilerinfo.geometria)?alquilerinfo.geometria:"",
            //   }

            // }
          })
        // })
      })
    })
  }

  ionViewWillLeave(){

  }
  goHome(){
    console.log("go home");
    // this.navController.navigateRoot(["/redirect/home"]);
    this.navController.navigateRoot(["/home"]);    
  }
}
