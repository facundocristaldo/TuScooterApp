import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, ToastController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';


@Component({
  selector: 'app-travelstate',
  templateUrl: './travelstate.page.html',
  styleUrls: ['./travelstate.page.scss'],
})
export class TravelstatePage implements OnInit {
  travelStartTime = "00:00:00"
  userinfo;
  serverURL="";
  guidAlquiler :String;
  guidScooter : String;
  constructor(
    private router:Router,
    private platform:Platform,
    private storage : Storage,
    private http:HTTP,
    private toastController : ToastController,
    private navController:NavController,
    private navParams : ActivatedRoute,
  ) { }

  ngOnInit() {
    this.guidScooter = this.navParams.snapshot.paramMap.get('scooter');
    this.guidAlquiler = this.navParams.snapshot.paramMap.get('alquiler');
    this.travelStartTime=Date().valueOf().substring(0,25);
    this.platform.ready().then(()=>{
      this.storage.get("userLoginInfo").then((user)=>{
        this.userinfo = user;
      })
      this.storage.get("serverIP").then(data=>{
        this.storage.get("serverPORT").then(data2=>{
          this.serverURL= "http://"+data+":"+data2+"/Proyecto-2019Web/resources/";
        });
      });
    })
  }

  stopTravel(){
    let price = 0;
    let headers={
      'Accept':'*/*',
      'Content-Type':'application/json'
    }
    this.http.setDataSerializer('json');
    this.http.post(this.serverURL+"alquileres/alquiler/T",{
        "guid": this.guidAlquiler,
        "price": price,
        "guidscooter": this.guidScooter,
        "cliente": this.userinfo.username
    },headers).then(response=>{
      if (response.status==200){
        this.toastController.create({
          message:"Alquiler finalizado con exito",
          duration:3000
        }).then(e=>e.present);
        this.router.navigate(['/travelinfo/'+this.guidScooter+'/'+this.guidAlquiler]);
      }else{
        this.toastController.create({
          message:"Algo falló",
          duration:3000
        }).then(e=>e.present);
      }
    })

    
    this.router.navigate(['/travelinfo/'+this.guidScooter+'/'+this.guidAlquiler]);

  }

}
