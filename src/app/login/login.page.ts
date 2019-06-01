import { Component, OnInit } from '@angular/core';
import { MenuController, Platform, ToastController, LoadingController, Events, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { GlobalProperties } from '../Classes/GlobalProperties';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  usernameInput = "";
  passwordInput = "";
  serverURL = "";
  dinamicformclass = "";
  loadingCtrl;

  constructor(
    private menuCtl: MenuController,
    private router:Router,
    private navController: NavController,
    private storage: Storage,
    private http: HTTP,
    private toastCtrl: ToastController,
    private platform: Platform,
    private loadingController: LoadingController,
    public globalevents: Events,
    public globalprops : GlobalProperties
  ) {
  }

  ngOnInit() {

  }

  login() {
    let headers = this.globalprops.httpheader
    // this.loadingCtrl = this.loadingController.create({

    // }).then(e=>e.present());
    this.http.post(this.serverURL + 'users/login?username=' + this.usernameInput + '&password=' + this.passwordInput, {}, headers)
      .then(response => {
        let responseBody = JSON.parse(response.data);
        if (responseBody.success.toString() == "true" && responseBody.body != null) {//login ok
          if (responseBody.body) {
            let userdata = responseBody.body;
            console.log("Login ok");
            let userLoginInfo = {
              username: this.usernameInput,
              password: this.passwordInput,
              email: userdata.email,
              name: userdata.name,
              surname: userdata.surname,
              saldo: userdata.saldo,
              urlphoto: userdata.urlphoto,
              cellphone: userdata.cellphone,
            }
            this.platform.ready().then(() => {
              this.storage.set('userLoginInfo', userLoginInfo);
              // this.loadingCtrl.dismiss();
              this.http.get(this.serverURL + 'alquileres/activoporcliente?username=' + userLoginInfo.username, {}, {})
                .then(response => {
                  let responseBody = JSON.parse(response.data);
                  if (responseBody.success.toString() == "true" && responseBody.body != null) {//login ok
                    if (responseBody.body!=null) {
                      let alquiler = responseBody.body;
                      
                      console.log("duracion: " + (alquiler.duration ))//
                      let duracion :string = alquiler.duration;
                      console.log("only time "+duracion.substr(11,8))
                      this.storage.set("alquilerduracion",duracion.substr(11,8))

                      this.storage.set("scooter",alquiler.guidscooter).then(()=>{
                        this.storage.set("alquiler",alquiler.guid).then(()=>{
                          this.navController.navigateRoot("/travelstate")                        
                        })
                        
                      })
                      
                    }else{
                      console.log("Login ok");
                      this.navController.navigateRoot("/home")
                    }
                  }else
                    this.navController.navigateRoot("/home")
                });
            });
          }
        } else if (responseBody.body == null) {//error de validacion
          // this.loadingCtrl.dismiss();
          this.toastCtrl.create({
            message: 'Error de validación',
            duration: 3000
          }).then(e => e.present());
          this.changestyle();
        } else { //usuario no existe
          // this.loadingCtrl.dismiss();
          console.log("usuario no existe");
          this.toastCtrl.create({
            message: 'Error de validación',
            duration: 3000
          }).then(e => e.present());
          this.changestyle();
        }
      }).catch(err => {
        // this.loadingCtrl.dismiss();
        console.log(err);
        this.toastCtrl.create({
          message: 'No hay conexión con el servidor.',
          duration: 3000
        }).then(e => e.present());
        this.changestyle();
      });

  }

  ionViewWillEnter() {
    this.menuCtl.enable(false);
    this.platform.ready().then(() => {
      this.storage.get("serverURL").then(serverURL => {
        this.serverURL = serverURL;
        this.storage.get("userLoginInfo").then(userLoginInfo => {
          if (userLoginInfo) {
            this.usernameInput = userLoginInfo.username;
            this.passwordInput = userLoginInfo.password;
            this.login();
          } else {
            this.changestyle();
          }
        });
      });
    });
  }

  ionViewWillLeave() {
    this.menuCtl.enable(true);
  }

  changestyle() {
    this.dinamicformclass = "loginformShow";
  }

}
