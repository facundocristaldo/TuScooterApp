import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavParams, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-travelinfo',
  templateUrl: './travelinfo.page.html',
  styleUrls: ['./travelinfo.page.scss'],
})
export class TravelinfoPage implements OnInit {

  guidAlquiler="";
  guidScooter="";
  AlquilerPrice="";
  constructor(
    private navParams:NavParams,
    private platform:Platform,
    private storage:Storage
  ) { }

  ngOnInit() {
    
  }
  
  ionViewWillEnter(){
    this.platform.ready().then(()=>{
      this.storage.get("scooter").then(scooter=>{
        this.guidScooter=scooter;
        this.storage.get("alquiler").then(alquilerstorage=>{
          this.guidAlquiler = alquilerstorage;
          this.storage.get("alquilerprice").then(price=>{
            this.AlquilerPrice=price;
          })
        })
      })
    })
  }
}
