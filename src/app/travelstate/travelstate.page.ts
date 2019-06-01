import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, ToastController, NavController, MenuController, NumericValueAccessor } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { Time } from '@angular/common';
import { bind } from '@angular/core/src/render3';
import { GlobalProperties } from '../Classes/GlobalProperties';


@Component({
  selector: 'app-travelstate',
  templateUrl: './travelstate.page.html',
  styleUrls: ['./travelstate.page.scss'],
})
export class TravelstatePage implements OnInit {
  travelStartTime = "00:00:00";

  travelDurationCounter: Timer = new Timer();

  maxDuration;
  userinfo;
  serverURL = "";
  guidAlquiler: any;
  guidScooter: String = "";
  interval; 

  constructor(
    private platform: Platform,
    private storage: Storage,
    private http: HTTP,
    private toastController: ToastController,
    private navController: NavController,
    private navParams: ActivatedRoute,
    private menuCtl: MenuController,
    public globalprops : GlobalProperties
  ) { }

  ngOnInit() {


  }

  stopTravel() {
    
    let headers = this.globalprops.httpheader;


    this.http.setDataSerializer('json');
    this.http.post(this.serverURL + "alquileres/alquiler/T",
      {
        "guid": this.guidAlquiler,
        "price": 0,
        "guidscooter": this.guidScooter,
        "cliente": this.userinfo.username
      }
      , headers).then(response => {
        let responseBody = JSON.parse(response.data);
        console.log(responseBody.body)
        if (responseBody.success.toString() == 'true' && responseBody.body != null) {
          let infoAlquiler = responseBody.body;
          this.toastController.create({
            message: "Alquiler finalizado con exito" + JSON.stringify(infoAlquiler),
            duration: 3000
          }).then(e => e.present);
          clearInterval(this.interval)
          this.navController.navigateRoot(["/travelinfo/" + infoAlquiler.guid])
        } else {
          this.toastController.create({
            message: "Algo falló",
            duration: 3000
          }).then(e => e.present);
        }
      }).catch(e => {
        this.toastController.create({
          message: "Algo falló",
          duration: 3000
        }).then(e => e.present);
      })


    //this.router.navigate(['/travelinfo/'+this.guidScooter+'/'+this.guidAlquiler+"/"+price]);

  }

  startCounter() {
    this.interval = setInterval(function () {
      this.travelDurationCounter.addSecond();
      console.log("duration:"+this.travelDurationCounter.toSeconds())
      console.log("max:"+this.maxDuration)
      console.log("restan:"+(this.maxDuration-this.travelDurationCounter.toSeconds()))
      if (this.maxDuration < (5 * 60)) {

      } else {

        if ((this.maxDuration-this.travelDurationCounter.toSeconds()) === ((5 * 60))) {
          this.toastController.create({
            message: "Le quedan 5 minutos para usar el scooter",
            duration: 5000,
          }).then(e => { e.present() })
        }
      }
      if ((this.maxDuration-this.travelDurationCounter.toSeconds()) === (2 * 60)) {
        this.toastController.create({
          message: "Le quedan 2 minutos para usar el scooter",
          duration: 5000,
        }).then(e => { e.present() })
      }
      if ((this.maxDuration-this.travelDurationCounter.toSeconds()) === (30)) {
        this.toastController.create({
          message: "Le quedan 30 segundos para usar el scooter",
          duration: 5000,
        }).then(e => { e.present() })
      }
      if ((this.maxDuration-this.travelDurationCounter.toSeconds()) <= (5)) {
        this.toastController.create({
          message: "El viaje finalizará pronto automáticamente...",
          duration: 800,
        }).then(e => { e.present() })
      }
      if ((this.maxDuration-this.travelDurationCounter.toSeconds())==1){
        this.toastController.create({
          message: "Finalizando viaje",
          duration: 800,
        }).then(e => { e.present() })
        this.stopTravel();
      }
    }.bind(this), 1000)
    
}

ionViewWillLeave(){
  this.menuCtl.enable(true);
}

ionViewWillEnter(){
  this.menuCtl.enable(false);
  this.travelStartTime = Date().valueOf().substring(0, 25);
  this.platform.ready().then(() => {
    this.storage.get("userLoginInfo").then((user) => {
      this.userinfo = user;
      this.storage.get("serverURL").then(serverURL => {
        this.serverURL = serverURL;
        this.storage.get("scooter").then(scooter => {
          this.guidScooter = scooter;
          this.storage.get("alquiler").then(alquiler => {
            this.guidAlquiler = alquiler;
              this.storage.get("maxTimeToTravel").then(maxTimeToTravel => {
                this.maxDuration = Number((Number(maxTimeToTravel)).toFixed(0));
              });
            this.storage.get("alquilerduracion").then((duracion:string)=>{
              if (duracion!="" && duracion!=null && duracion!=undefined){

                let arrayvals: string[] =duracion.split(":");
                let cantsec:number = (Number( arrayvals[0] )*60*60 ) + (Number(arrayvals[1])*60) + (Number(arrayvals[2]));
                for (var i = 0; i<cantsec;i++){
                  this.travelDurationCounter.addSecond();
                }
                this.storage.set("alquilerduracion","");
              }
            });
          });
        });
      });
    });
  }).catch(e => {
    this.toastController.create({
      message: "Error iniciando travel state",
      duration: 3000
    }).then(e => e.present());
  })
  this.startCounter();
}
}

export class Timer {
  seconds: number = 0;
  minutes: number = 0;
  hours: number = 0;

  Timer() {
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
  }
  public toString(): String {
    var secondsInString = "";
    var minutesInString = "";
    var hoursInString = "";
    if (this.seconds < 10) {
      secondsInString = "0" + this.seconds.toString() + "";
    } else {
      secondsInString = "" + this.seconds.toString() + "";
    }
    if (this.minutes < 10) {
      minutesInString = "0" + this.minutes.toString() + "";
    } else {
      minutesInString = "" + this.minutes.toString() + "";
    }
    if (this.hours < 10) {
      hoursInString = "0" + this.hours.toString() + "";
    } else {
      hoursInString = "" + this.hours.toString() + "";
    }
    return hoursInString + ":" + minutesInString + ":" + secondsInString;
  }
  public addSecond() {
    this.seconds++;
    if (this.seconds >= 60) {
      this.seconds = 0;
      this.addMinute();
    }
  }
  addMinute() {
    this.minutes++;
    if (this.minutes >= 60) {
      this.minutes = 0;
      this.addHour();
    }
  }
  addHour() {
    this.hours++;
  }
  public toSeconds(): number {
    return ((this.hours * 60 * 60) + (this.minutes * 60) + (this.seconds))
  }
};