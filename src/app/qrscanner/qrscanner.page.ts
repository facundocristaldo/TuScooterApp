import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Router } from '@angular/router';
import { ToastController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.page.html',
  styleUrls: ['./qrscanner.page.scss'],
})
export class QrscannerPage implements OnInit {

  scannedcode = null;
  userinfo;
  isTest=true;
  serverURL="";
  ngOnInit() {
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

  constructor(
    private qrScanner: QRScanner,
    private router:Router,
    private toastCtrl: ToastController,
    private platform : Platform,
    private storage:Storage,
    private http: HTTP,
    ){ 

  }

  scanCode(){
    this.qrScanner.prepare()
   .then((status: QRScannerStatus) => {
     if (status.authorized) {
       // camera permission was granted

       this.toastCtrl.create({
         message: 'camera permission granted',
         duration: 1000
       }).then(e=>e.present());
       this.scannedcode="Escneando";
       // start scanning
       this.qrScanner.show();


         window.document.querySelector('*').classList.add('.invisiblebackground');
         
         let scanSub = this.qrScanner.scan().subscribe((text: string) => {
           
           console.log('Scanned something', text);

           this.qrScanner.hide(); // hide camera preview
         //window.document.querySelector('ion-content,.inner-scroll-y').classList.remove('.invisiblebackground');

         this.toastCtrl.create({
           message: 'You scanned text is this :'+text,
           duration: 6000
          }).then(e=>e.present());
         scanSub.unsubscribe(); // stop scanning
         this.qrScanner.destroy();
         this.conectarScooter(text,this.userinfo.username);
         //this.conectarScooter("oirqwb-eqrvev-wqrfqrf-qwef",this.userinfo.username);
         
      


       });


     } else if (status.denied) {
       this.toastCtrl.create({
         message: 'No hay acceso a la camara',
         duration: 3000
        }).then(e=>e.present());
       // camera permission was permanently denied
       // you must use QRScanner.openSettings() method to guide the user to the settings page
       // then they can grant the permission from there
     } else {
       this.toastCtrl.create({
         message: 'Sin acceso a la camara.',
         duration: 3000
        }).then(e=>e.present());
       // permission was denied, but not permanently. You can ask for permission again at a later time.
     }
   })
   .catch((e: any) => console.log('Error is', e));

  }


  conectarScooter(guidscooter: string, username: any) {
  let conexion = {
    'guid': '123',
    'price': 0.0,
    'guidscooter': guidscooter,
    'cliente': username
  };
  let headers={
    'Accept':'*/*',
    'Content-Type':'application/json'
    }
    this.http.setDataSerializer('json')
    this.http.post(this.serverURL+'alquileres/alquiler/E',conexion,headers).then(response=>{
    if (response.status==200 && response.data){
      this.toastCtrl.create({
        message:"Conectado al scooter:idAlquiler"+response.data,
        duration:3000
      }).then(e=>e.present());
      let guidAlquiler = response.data;
      this.avanzar(guidAlquiler,guidscooter)
    }else{
      this.toastCtrl.create({
        message:"No se pudo conectar al scooter",
        duration:3000
      }).then(e=>e.present());
    }
  })
  }

  ionViewDidLeave(){
    //window.document.querySelector('*').classList.remove('invisibleAll');

  }


  avanzar(guidalquiler,guidScooter){
    this.router.navigate(["travelstate/"+guidScooter+"/"+guidalquiler])
  }
}
