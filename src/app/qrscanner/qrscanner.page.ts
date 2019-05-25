import { Component, OnInit, ViewChild } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ToastController, Platform, AlertController, MenuController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.page.html',
  styleUrls: ['./qrscanner.page.scss'],
})
export class QrscannerPage implements OnInit {

  userinfo;
  isTest=true;
  serverURL="";
  lightEnabled: any;

  ngOnInit() {
  }
  constructor(
    private qrScanner: QRScanner,
    private navController:NavController,
    private toastCtrl: ToastController,
    private platform : Platform,
    private storage:Storage,
    private http: HTTP,
    private alertController: AlertController,
    private menuCtl:MenuController
    ){ 
 
  }
  ionViewWillEnter(){
    this.menuCtl.enable(false);
    this.platform.ready().then(()=>{
      this.storage.get("userLoginInfo").then((user)=>{
        this.userinfo = user;
      })
      this.storage.get("serverURL").then(serverURL=>{
          this.serverURL= serverURL;
      });
    }) 
    // //window.document.querySelector('app-root').classList.add('transparentBody');
   
  }

  ionViewDidEnter(){
    this.qrScanner.prepare()
   .then((status: QRScannerStatus) => {
     if (status.authorized) {
       this.qrScanner.show().then(status=>{

          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            this.qrScanner.disableLight();
            scanSub.unsubscribe(); // stop scanning
            this.qrScanner.destroy();
            this.conectarScooter(text,this.userinfo.username);
          });
        })


     } else if (status.denied) {
       this.toastCtrl.create({
         message: 'No hay acceso a la camara',
         duration: 3000
        }).then(e=>e.present());

     } else {
       this.toastCtrl.create({
         message: 'Sin acceso a la camara.',
         duration: 3000
        }).then(e=>e.present());
     }
   })
   .catch((e: any) => console.log('Error ', e));

  }


  conectarScooter(guidscooter: string, username: any){
      // this.toastCtrl.create({
      //   message:"going to connect to scooter "+guidscooter,
      //   duration:3000
      // }).then(e=>e.present());

      this.http.setDataSerializer('json')
      this.http.post(this.serverURL+'alquileres/alquiler/E',{
        'guid': '123',
        'price': 0.0,
        'guidscooter': guidscooter,
        'cliente': username
      },
      {
      'Accept':'*/*',
      'Content-Type':'application/json',
      'Connection-Timeout':'5000'
      }
        ).then(response=>{
        // this.toastCtrl.create({
        //   message:"response "+response.data.toString(),
        //   duration:3000
        // }).then(e=>e.present());
      let responseBody = JSON.parse(response.data);
      if (responseBody.success.toString()=="true" && responseBody.body!=null){
        let infoAlquiler = responseBody.body;
        
        // let guidAlquiler = infoAlquiler.get("guid");
        // this.toastCtrl.create({
        //   message:"Conectado al scooter:idAlquiler="+infoAlquiler.guid,
        //   duration:5000
        // }).then(e=>e.present());
        this.qrScanner.hide();
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
    this.qrScanner.disableLight()
    this.qrScanner.destroy()
    //window.document.querySelector('*').classList.remove('invisibleAll');

  }
  



  avanzar(infoalquiler:String,guidScooter:String){
    this.platform.ready().then(()=>{
      this.storage.set("alquiler",infoalquiler).then(()=>{
        this.storage.set("scooter",guidScooter).then(()=>{
          this.navController.navigateRoot("/travelstate")
        })
      })
    })
  }

  toggleLight(){
    if (this.lightEnabled){
      this.qrScanner.disableLight();
      this.lightEnabled = false;
    }else{
      this.qrScanner.enableLight();
      this.lightEnabled = true;
    }
  }

  writeCode(){
    this.alertController.create({
      header: "Escribe el código:",
      inputs:[{name:"qrcode"}],
      buttons:[{
        text:"Cancelar",
        role:"cancel"
      },{
        text:"Aceptar",
        handler:data=>{
          if (data.qrcode.trim()!=""){
            let datastring :String = data.qrcode;
            this.conectarScooter(datastring.toUpperCase(), this.userinfo.username) 
          }else{
            this.alertController.create({
              message:"Ingrese un código",
              buttons:[{text:"Aceptar"}]
            }).then(e=>e.present());
          }
        }
      }]
    }).then(e=>e.present());
  }


  goback(){
    this.navController.navigateRoot("/home")
  }

}
