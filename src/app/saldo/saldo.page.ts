import { Component, OnInit, forwardRef, Inject } from '@angular/core';
import {PayPal, PayPalPayment, PayPalConfiguration} from '@ionic-native/paypal/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { GlobalProperties } from '../Classes/GlobalProperties';

@Component({
  selector: 'app-saldo',
  templateUrl: './saldo.page.html',
  styleUrls: ['./saldo.page.scss'],
})
export class SaldoPage  implements OnInit {

  amount = undefined;
  username = "";
  saldoActual :number=0;
  serverURL = "";

  constructor(
    private payPal: PayPal,
    private storage :Storage,
    private platform:Platform,
    private toastCtrl:ToastController,
    private http:HTTP,
    public globalprops : GlobalProperties
    ) { 
      
    }
  
 
  ngOnInit() {
    
  }
  
  async doPaypal(){
    if (this.amount==0 || this.amount==undefined){
      
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
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        })).then(() => {
          let payment = new PayPalPayment(this.amount.toString(), 'USD', 'Recarga USD '+this.amount+ ' para el usuario '+this.username, 'recarga');
          this.payPal.renderSinglePaymentUI(payment).then((response) => {
            let paymentdata = response.response;
            this.toastCtrl.create({
              message: "El pago se completó correctamente",
              duration: 3000
            }).then(e=>e.present());
            let header = this.globalprops.httpheader
              this.http.post(this.serverURL+"users/recargar?username="+this.username+"&guidpaypal="+paymentdata.id+"&monto="+this.amount+"&moneda=USD",{},
              header).then(response=>{
              let responseBody= JSON.parse(response.data);
              if (responseBody.body=="true" || responseBody.body==true){
                this.toastCtrl.create({
                  message: "El pago se guardó correctamente",
                  duration: 3000
                }).then(e=>e.present());
                this.refreshPage()
              }else{
                this.toastCtrl.create({
                  message: "Algo salió mal",
                  duration: 3000
                }).then(e=>e.present());
              }
            })
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
    this.refreshPage();
  }
  async doRefresh(event){
    console.log('Begin async operation');
    
    await this.refreshPage();
    event.target.complete();

    // setTimeout(() => {
    //   console.log('Async operation has ended');
    //   event.target.complete();
    // }, 5000);
  }
  async refreshPage():Promise<any>{

    this.platform.ready().then(()=>{
      this.storage.get("serverURL").then(serverURL=>{
        this.serverURL= serverURL;
        this.storage.get("userLoginInfo").then(data=>{
          this.saldoActual = data.saldo
        this.username = data.username;
        this.http.get(this.serverURL+"users/cliente?username="+this.username,{},{}).then(response=>{
          let responseBody=JSON.parse(response.data);
          
          if (responseBody.body){
            let userinfo = responseBody.body;
            this.saldoActual=Number((Number(userinfo.saldo)).toFixed(2));
          }else{
            this.toastCtrl.create({
              message:"Error:"+responseBody.message.toString(),
              duration:5000
            }).then(e=>e.present());
          }
          return true;
          })
        });
      });
    })
  }
}
