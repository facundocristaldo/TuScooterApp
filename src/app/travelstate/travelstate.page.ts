import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, ToastController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { Time } from '@angular/common';
import { bind } from '@angular/core/src/render3';


@Component({
  selector: 'app-travelstate',
  templateUrl: './travelstate.page.html',
  styleUrls: ['./travelstate.page.scss'],
})
export class TravelstatePage implements OnInit {
  travelStartTime = "00:00:00";
  
  travelDurationCounter : Timer = new Timer();
  
 
  userinfo;
  serverURL="";
  guidAlquiler :any;
  guidScooter : String ="";
  // alquiler ;
  // body:any;
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
    

  }

  stopTravel(){
    let price = 0;
    let headers={
      'Accept':'*/*',
      'Content-Type':'application/json',
      'Timeout':'5000'
    }
    

    this.http.setDataSerializer('json');
    this.http.post(this.serverURL+"alquileres/alquiler/T",
    {
        "guid": this.guidAlquiler,
        "price": 0,
        "guidscooter": this.guidScooter,
        "cliente": this.userinfo.username
    }
    ,headers).then(response=>{
      let responseBody = JSON.parse(response.data);
      if (responseBody.success=='true'){
        this.toastController.create({
          message:"Alquiler finalizado con exito",
          duration:3000
        }).then(e=>e.present);
        let infoAlquiler = responseBody.body;
        this.platform.ready().then(()=>{
          this.storage.set("alquilerprice",infoAlquiler.price).then(()=>{

            this.router.navigate(['travelinfo']);
          });
        })
      }else{
        this.toastController.create({
          message:"Algo falló",
          duration:3000
        }).then(e=>e.present);
      }
    }).catch(e=>{
      this.toastController.create({
        message:"Algo falló",
        duration:3000
      }).then(e=>e.present);
    })

    
    //this.router.navigate(['/travelinfo/'+this.guidScooter+'/'+this.guidAlquiler+"/"+price]);

  }

  startCounter(){
    setInterval(function(){
      this.travelDurationCounter.addSecond();
    }.bind(this),1000)
  }

  ionViewWillEnter(){
    // this.guidScooter = this.navParams.snapshot.paramMap.get('scooter');
    // this.guidAlquiler = this.navParams.snapshot.paramMap.get('alquiler');
    this.travelStartTime=Date().valueOf().substring(0,25);
    this.platform.ready().then(()=>{
      this.storage.get("userLoginInfo").then((user)=>{
        this.userinfo = user;
        this.storage.get("serverURL").then(serverURL=>{
          this.serverURL= serverURL;
          this.storage.get("scooter").then(scooter=>{
            this.guidScooter=scooter;
            this.storage.get("alquiler").then(alquiler=>{
              
              this.guidAlquiler=alquiler;
              // this.alquiler = JSON.parse(alquiler)
              this.toastController.create({
                message:"travelstate alquiler:"+this.guidAlquiler,
                duration:3000
              }).then(e=>e.present());
//              console.log("in travelstate guidalquiler is"+this.guidAlquiler);
            });
          });
        });
      });
    }).catch(e=>{
      this.toastController.create({
        message:"Error iniciando travel state",
        duration:3000
      }).then(e=>e.present());
    })
    this.startCounter();
    
  }
}

export class Timer {
  seconds:number= 0;
  minutes: number=0;
  hours :number= 0;

  Timer(){
    this.seconds=0;
    this.minutes=0;
    this.hours=0;
  }
  public toString():String{
    var secondsInString = "";
    var minutesInString = "";
    var hoursInString = "";
    if (this.seconds<10){
      secondsInString = "0"+this.seconds.toString()+"";
    }else{
      secondsInString = ""+this.seconds.toString()+"";
    }
    if (this.minutes<10){
      minutesInString =  "0"+this.minutes.toString()+"";
    }else{
      minutesInString = ""+this.minutes.toString()+"";
    }
    if (this.hours<10){
      hoursInString = "0"+this.hours.toString()+"";
    }else{
      hoursInString = ""+this.hours.toString()+"";
    }
    return hoursInString+":"+minutesInString+":"+secondsInString;
  }
  public addSecond(){
    this.seconds++;
    if (this.seconds>=60){
      this.seconds=0;
      this.addMinute();
    }
  }
  addMinute(){
    this.minutes++;
    if(this.minutes>=60){
      this.minutes=0;
      this.addHour();
    }
  }
  addHour(){
    this.hours++;
  }
};