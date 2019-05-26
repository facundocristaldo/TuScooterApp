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
    this.alquilerguid = this.activatedroute.snapshot.paramMap.get("id")
    this.menuCtl.enable(true);
  }

  ionViewWillLeave(){

  }
  goHome(){
    this.navController.navigateRoot(["/home"]);    
  }
}
