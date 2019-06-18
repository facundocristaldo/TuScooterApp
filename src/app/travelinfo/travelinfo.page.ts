import { Component, OnInit } from '@angular/core';
import { Platform, MenuController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { GoogleMapComponent } from '../home/google-map/google-map.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-travelinfo',
  templateUrl: './travelinfo.page.html',
  styleUrls: ['./travelinfo.page.scss'],
})
export class TravelinfoPage implements OnInit {
  alquilerguid = "";
  alquiler: any;
  token;
  serverURL;
  guidscooter: any;
  precio: any;
  fecha: any;
  duracion: any;

  constructor(
    private menuCtl: MenuController,
    private activatedroute: ActivatedRoute,
    private navController: NavController,
    private http: HttpClient,
    private platform: Platform,
    private storage: Storage
  ) {
    this.platform.ready().then(() => {
      this.storage.get("token").then(token => {
        this.token = token;
      })
      this.storage.get("serverURL").then(data => {
        this.serverURL = data;
        this.alquilerguid = this.activatedroute.snapshot.paramMap.get("id")
        this.menuCtl.enable(true);
        let headers = new HttpHeaders({
          'Authorization': this.token
        })
        let option = {
          headers: headers
        }
        this.http.get(this.serverURL + "alquileres/find?guid=" + this.alquilerguid, option).subscribe(response => {
          let responseBody: any = response;
          if (responseBody && responseBody.body != null) {
            let travel: any = responseBody.body
            this.guidscooter = travel.guidscooter;
            this.precio = Number((Number(travel.price)).toFixed(2));
            this.fecha = travel.timestamp;
            this.duracion = travel.duration;
            if (this.duracion!=undefined && this.duracion!=null){
              this.duracion = this.duracion.substr(11,8).replace("[a-zA-Z]","");
            }
            
            if (this.fecha!=undefined && this.fecha!=null){
              this.fecha = this.fecha.substr(0,19).replace("T"," ");
            }

          }
        });
      })
    })
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    console.log("travel info destroy")
  }
  ionViewWillEnter() {

  }

  ionViewWillLeave() {

  }
  goHome() {
    this.navController.navigateRoot(["/home"]);
  }
}
