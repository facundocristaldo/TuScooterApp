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
      'Content-Type':'application/json',
      'Timeout':'5000'
      }
      this.http.setDataSerializer('json')
      this.http.post(this.serverURL+'alquileres/alquiler/E',conexion,headers).then(response=>{
      let responseBody = response.data;
      if (responseBody.success=='true' && responseBody.body){
        let infoAlquiler = responseBody.body;
        
        // let guidAlquiler = infoAlquiler.get("guid");
        this.toastCtrl.create({
          message:"Conectado al scooter:idAlquiler="+infoAlquiler.guid,
          duration:5000
        }).then(e=>e.present());
        this.avanzar(infoAlquiler.guid,guidscooter)
      }else{
        this.toastCtrl.create({
          message:"No se pudo conectar al scooter",
          duration:3000
        }).then(e=>e.present());
      }
    })
  }

  /**{
    "cliente": "mmaldonado",
    "duration": "1970-01-01T10:19:05Z[UTC]",
    "guid": "76f5342a-f362-4dfd-8061-e5a433eb3066",
    "guidscooter": "oirqwb-eqrvev-wqrfqrf-qwef",
    "price": 0,
    "timestamp": "2019-05-08T10:19:05.261Z[UTC]"
} */

  ionViewDidLeave(){
    //window.document.querySelector('*').classList.remove('invisibleAll');

  }
  ionViewWillEnter(){
    this.platform.ready().then(()=>{
      this.storage.get("userLoginInfo").then((user)=>{
        this.userinfo = user;
      })
      this.storage.get("serverURL").then(serverURL=>{
          this.serverURL= serverURL;
      });
    }) 
  }

  avanzar(infoalquiler:String,guidScooter:String){
    this.platform.ready().then(()=>{
      this.storage.set("alquiler",infoalquiler).then(()=>{

        this.storage.set("scooter",guidScooter).then(()=>{
          this.storage.get("alquiler").then(gui=>{
            this.toastCtrl.create({
              message:"Added to storage alquiler guid:"+gui,
              duration:10000
            }).then(e=>e.present());
          })
          this.router.navigate(["travelstate"])

        })
      })
    })
  }
}
