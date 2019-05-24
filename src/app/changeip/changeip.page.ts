import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { AlertController, Platform, ToastController, NavController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changeip',
  templateUrl: './changeip.page.html',
  styleUrls: ['./changeip.page.scss'],
})
export class ChangeipPage implements OnInit {

  IP:String="";
  PORT:String="";

  constructor( 
    private AlertController:AlertController,
    private platform:Platform,
    private storage : Storage,
    private router : Router,
    private toastCtrl:ToastController,
    private navController:NavController,
    private menuCtl:MenuController

    ) {
    }

  ngOnInit() {
    this.platform.ready().then(()=>{
      this.storage.get("serverIP").then(data=>{
        this.storage.get("serverPORT").then(data2=>{
          this.IP = data;
          this.PORT = data2;
        })
      })
    })
    
  }

  changeIP(){
    this.platform.ready().then(() => {
      this.storage.set("serverIP",this.IP).then(()=>{
        this.storage.set("serverPORT",this.PORT).then(()=>{
          let serverURL = "http://"+this.IP+":"+this.PORT+"/Proyecto-2019Web/resources/";
          this.storage.set("serverURL",serverURL).then(()=>{
            this.toastCtrl.create({
              message: 'datos del servidor actualizados',
              duration: 3000
            }).then(e=>e.present());
            this.navController.pop();
          });
        });
      });
    });
  }

 
  ionViewWillEnter(){
    this.menuCtl.enable(false);
  }


  ionViewWillLeave(){
    this.menuCtl.enable(true);
  }
}
 