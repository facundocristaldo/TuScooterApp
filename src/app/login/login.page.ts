import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { MenuController, Platform, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HomePage } from '../home/home.page';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usernameInput ="";
  passwordInput="";
  serverURL = "";
  constructor(
    private menuCtl: MenuController,
    private router: Router,
    private storage:Storage,
    private http: HTTP,
    private toastCtrl: ToastController,
    private platform:Platform
    ) {
      
      
    

  }

  ngOnInit() {
    this.platform.ready().then(()=>{
      this.storage.get("serverIP").then(data=>{
        this.storage.get("serverPORT").then(data2=>{
          this.serverURL= "http://"+data+":"+data2+"/Proyecto-2019Web/resources/";
          this.storage.get("userLoginInfo").then(userLoginInfo=>{
            if (userLoginInfo){
              this.usernameInput = userLoginInfo.username;
              this.passwordInput = userLoginInfo.password;
              this.login();
            }
          })
        })
      })
    });
  }

  login(){
    let headers ={
      'Accept':'*/*',
      'Content-Type':'application/json',
      'Connection-Timeout':'30000'
    }
    this.toastCtrl.create({
      message: "HTTP Request address:"+this.serverURL+"users/login",
      duration: 3000
    }).then(e=>e.present());

    this.http.post(this.serverURL+'users/login?username='+this.usernameInput+'&password='+this.passwordInput,{},headers)
    .then(response=>{
      if (response.status==200){//login ok
        if (response.data){
          let userdata =response.data;
          console.log("Login ok");
          let userLoginInfo = {
            username:this.usernameInput,
            password:this.passwordInput,
            email:userdata.email,
            name:userdata.name,
            surname:userdata.surname,
            saldo:userdata.saldo,
            urlphoto:userdata.urlphoto,
            cellphone:userdata.cellphone,
          }
          this.storage.set('userLoginInfo',userLoginInfo);
          this.router.navigate(["home"]);
        }
      }else if(response.status=204){//error de validacion
          this.toastCtrl.create({
           message: 'Error de validación',
           duration: 3000
          }).then(e=>e.present());
        console.log("error de validación")
      }else{ //usuario no existe
        console.log("usuario no existe");
        this.toastCtrl.create({
           message: 'Error de validación',
           duration: 3000
        }).then(e=>e.present());
      }
    }).catch(err=>{
      console.log(err);
      this.toastCtrl.create({
           message: 'Algo salió mal :'+err.data,
           duration: 3000
          }).then(e=>e.present());
      
    }).finally(()=>{
      
    });
  }

  ionViewWillEnter(){
    this.menuCtl.enable(false);
  }

  ionViewWillLeave(){
    this.menuCtl.enable(true);
  }
}
