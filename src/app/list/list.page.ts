import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { ToastButton } from '@ionic/core';
import { ToastController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { error } from 'util';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {

  username  = "";
  serverURL="";
  alquileres : any[]=[];
  
  
  constructor(private http:HTTP,private toastController:ToastController,private platform : Platform, private storage:Storage) {
  
  }
 
  ngOnInit() {
  }

  ionViewWillEnter(){
    this.alquileres=[];
    this.username="";
    this.platform.ready().then(()=>{
      this.storage.get("userLoginInfo").then(e=>this.username=e.username)
      this.storage.get("serverURL").then((serverURL=>{
        this.serverURL = serverURL;
        this.http.get(this.serverURL+"alquileres/porcliente?username="+this.username,{},{}).then(response=>{
          let responseBody = JSON.parse(response.data);
          let tempListaAlquileres :any[] = JSON.parse(responseBody.body);
          for (var i=0;i<tempListaAlquileres.length;i++){
            var tempAlquiler:any = JSON.parse(tempListaAlquileres[i]);
            var tempfecha :String = tempAlquiler.timestamp;
            var tempduration : String = tempAlquiler.duration;
            var tempgeometry: any = tempAlquiler.geometria;
            this.alquileres.push({
              username: tempAlquiler.cliente,
              alquilerGUID: tempAlquiler.guid,
              fechaAlquiler: tempfecha.substr(0,18).replace("[a-zA-Z]"," "),
              precioAlquiler:tempAlquiler.price,
              duracion:tempduration.substr(12,8).replace("[a-zA-Z]",""),
              ubicacionesDeReferencia:tempgeometry.puntos
            })
          }

        }).catch(err=>{
          this.toastController.create({
            message:"HTTP Error"+err,
            duration:3000
          }).then(e=>e.present())
        })
      }))
    })

  }

  ViewDetails(alquiler){
    this.toastController.create({
      message:"Click sobre "+alquiler.alquilerFecha,
      duration:3000
    }).then(e=>e.present());
  }
}


