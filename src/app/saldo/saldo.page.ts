import { Component, OnInit, forwardRef, Inject } from '@angular/core';
import {PayPal, PayPalPayment, PayPalConfiguration} from '@ionic-native/paypal/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-saldo',
  templateUrl: './saldo.page.html',
  styleUrls: ['./saldo.page.scss'],
})
export class SaldoPage  implements OnInit {

  amount = 0;
  username = "facundotest";
  saldoActual = "0";
  serverURL = "";

  constructor(
    private payPal: PayPal,
    private alertCtl:AlertController,
    private storage :Storage,
    private platform:Platform,
    private toastCtrl:ToastController
    ) { 
      
    }
  

  ngOnInit() {
    this.platform.ready().then(()=>{
      this.storage.get("userLoginInfo").then(data=>{
        this.saldoActual = data.saldo
        this.username = data.username;
      });
    })
  }
  
  async doPaypal(){
    if (this.amount==0){
      
      this.toastCtrl.create({
           message: 'Debe ingresar un monto a recargar',
           duration: 3000
          }).then(e=>e.present());

    }else if (this.amount<0){
      this.toastCtrl.create({
           message: 'Ingrese un monto válido',
           duration: 3000
          }).then(e=>e.present());
    }else{
      this.payPal.init({
        PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
        PayPalEnvironmentSandbox: 'AQpSGkGq7uSH7-mszlCHFQz2VC_HWKI1hpQrAwJKQCbqKLaIEwJyIc6Y-yc2KiJQszgCYibhmUp8ryee'
      }).then(() => {
        // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
          // Only needed if you get an "Internal Service Error" after PayPal login!
          //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
        })).then(() => {
          let payment = new PayPalPayment(this.amount.toString(), 'USD', 'Recarga USD '+this.amount+ ' para el usuario '+this.username, 'recarga');
          this.payPal.renderSinglePaymentUI(payment).then((response) => {
            let paymentdata = response.response;
            
            this.alertCtl.create({
              header:"Éxito",
              subHeader:"El pago se completó correctamente",
              message:"Id:"+paymentdata.id,
              buttons:["OK"]
            }).then(e=>e.present());

            this.toastCtrl.create({
            message: "El pago se completó correctamente.Id:"+paymentdata.id,
            duration: 3000
            }).then(e=>e.present());
            

            // Example sandbox response
            //
            // {
            //   "client": {
            //     "environment": "sandbox",
            //     "product_name": "PayPal iOS SDK",
            //     "paypal_sdk_version": "2.16.0",
            //     "platform": "iOS"
            //   },
            //   "response_type": "payment",
            //   "response": {
            //     "id": "PAY-1AB23456CD789012EF34GHIJ",
            //     "state": "approved",
            //     "create_time": "2016-10-03T13:33:33Z",
            //     "intent": "sale"
            //   }
            // }
          }, (e) => {
            console.log("Error or render dialog closed without being successful");
            this.toastCtrl.create({
            message: "No se completó el pago",
            duration: 3000
            }).then(e=>e.present());
            
          });
        }, (e) => {
          console.log("Error in configuration");
          this.toastCtrl.create({
            message: "Error en configuración",
            duration: 3000
            }).then(e=>e.present());          
        });
      }, (e) => {
        console.log("Error in initialization, maybe PayPal isn't supported or something else");
        this.toastCtrl.create({
            message: "No se pudo inicializar PAYPAL",
            duration: 3000
            }).then(e=>e.present());
      });
    }
  }

  ionViewWillEnter(){
    this.platform.ready().then(()=>{
      this.storage.get("serverIP").then(data=>{
        this.storage.get("serverPORT").then(data2=>{
          this.serverURL= "http://"+data+":"+data2+"/Proyecto-2019Web/resources/";
        })
      })
    })
  }
}
