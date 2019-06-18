import { Component } from '@angular/core';
import { QrscannerPage } from '../qrscanner/qrscanner.page';
import { Router } from '@angular/router';
import { GoogleMapComponent } from './google-map/google-map.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AlertController, Platform, ToastController, NavController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Timer } from '../travelstate/travelstate.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isStart = true;
  username = "";
  serverURL = "";
  token = ""
  startTravel() {
    let headers = new HttpHeaders({
      'Authorization':this.token
    })
    let option = {
      headers:headers
    }
    this.http.get(this.serverURL + "users/tiempodisponible?username="+this.username, option).subscribe(response => {
        let responseBody :any= response;
        this.platform.ready().then(() => {
          this.storage.set("maxTimeToTravel", Number((Number(responseBody.body)).toFixed(0)));
          let tiempoMax = new Timer();
          for (var i = 0; i < Number((Number(responseBody.body)).toFixed(0)); i++) {
            tiempoMax.addSecond();
          }
          if (responseBody.body == null || responseBody.body <= 30 || tiempoMax.toString() == "00:00:00") {
            this.alertController.create({
              header: "Saldo insuficiente",
              message: "Usted no tiene saldo para realizar un viaje",
              buttons: [
                {
                  text: "Aceptar"
                }
              ]
            }).then(e => e.present());
          } else {


            this.alertController.create({
              header: "Tiempo máximo",
              message: "Usted tiene " + tiempoMax.toString() + " para usar el scooter.",
              buttons: [
                {
                  text: 'Cancelar',
                  handler: () => {
                    this.toastController.create({
                      message: "Cancelado...",
                      duration: 3000
                    }).then(e => e.present());
                  }
                }, {
                  text: 'Continuar',
                  handler: () => {
                    this.navController.navigateRoot("/qrscanner")
                    this.isStart = false;
                  }
                }]
            }).then(alert => alert.present());
          }
        });
      });
  }

  stopTravel() {
    this.isStart = true;
  }
  ionViewWillEnter() {
    this.menuController.enable(true);
    this.platform.ready().then(() => {
      this.storage.get("userLoginInfo").then(data => {
        this.username = data.username;
        this.storage.get("serverURL").then((serverurl) => {
          this.serverURL = serverurl;
        });
      });
    })
  }
  ionViewWillLeave() {
  }
  ngOnDestroy() {
    console.log("destroy home")
  }

  constructor(private router: Router,
    private navController: NavController,
    private google: GoogleMapComponent,
    private http: HttpClient,
    private alertController: AlertController,
    private platform: Platform,
    private storage: Storage,
    private toastController: ToastController,
    private menuController: MenuController) {
    this.platform.ready().then(() => {
      this.storage.get("token").then((token) => {
        console.log("token"+token)
        this.token = token;
      })
    })
  }
}
