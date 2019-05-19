import { Component, OnInit, Input } from '@angular/core';
import { Platform, MenuController, ToastController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-travelinfo',
  templateUrl: './travelinfo.page.html',
  styleUrls: ['./travelinfo.page.scss'],
})
export class TravelinfoPage implements OnInit {

  alquiler :{};
  constructor(
    private platform:Platform,
    private storage:Storage,
    private menuCtl:MenuController,
    private http:HTTP,
    private activatedroute:ActivatedRoute
  ) { }

  ngOnInit() {
    
  }
   
  ionViewWillEnter(){
    let alquilerguid = this.activatedroute.snapshot.paramMap.get("id")
    this.menuCtl.enable(true);
    this.platform.ready().then(()=>{
      this.storage.get("serverURL").then(serverURL=>{
        // this.guidScooter=scooter;
        // this.storage.get("alquiler").then(alquilerstorage=>{
          
          this.http.get(serverURL+"alquileres/find?guid="+alquilerguid,{},{}).then(response=>{
            console.log(response.data)
            let responseBody = JSON.parse(response.data);
            if (responseBody.success.toString()=="true" && responseBody.body){
              let alquilerinfo = responseBody.body;
              this.alquiler={
                guidalquiler : alquilerinfo.guid,
                duracion : alquilerinfo.duration,
                precio : alquilerinfo.price,
                guidscooter : alquilerinfo.guidscooter,
                cliente : alquilerinfo.cliente,
                recorrido : alquilerinfo.geometria

              }
            }
          })
        // })
      })
    })
  }
}
