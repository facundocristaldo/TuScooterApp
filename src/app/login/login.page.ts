import { Component, OnInit, Inject, forwardRef, ViewChild } from '@angular/core';
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
  dinamicformclass =""

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
    
  }

  login(){
    let headers ={
      'Accept':'*/*',
      'Content-Type':'application/json',
      'Connection-Timeout':'10000'
    }
    this.toastCtrl.create({
      message: "HTTP Request address:"+this.serverURL+"users/login",
      duration: 3000
    }).then(e=>e.present());

    this.http.post(this.serverURL+'users/login?username='+this.usernameInput+'&password='+this.passwordInput,{},headers)
    .then(response=>{
      let responseBody = response.data;
      if (responseBody.success.toString()=="true" && responseBody.body!=null){//login ok
        if (responseBody.body){
          let userdata =responseBody.body;
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
          this.platform.ready().then(()=>{
            this.storage.set('userLoginInfo',userLoginInfo);
            this.router.navigate(["home"]);
          });
        }
      }else if(responseBody.body==null){//error de validacion
          this.toastCtrl.create({
           message: 'Error de validación',
           duration: 3000
          }).then(e=>e.present());
          this.changestyle();
      }else{ //usuario no existe
        console.log("usuario no existe");
        this.toastCtrl.create({
           message: 'Error de validación',
           duration: 3000
        }).then(e=>e.present());
        this.changestyle();
      }
    }).catch(err=>{
      console.log(err);
      this.toastCtrl.create({
           message: 'Algo salió mal :'+err.data,
           duration: 3000
          }).then(e=>e.present());
      this.changestyle();
    }).finally(()=>{
      
    });
  }

  ionViewWillEnter(){
    // this.login();
    this.changestyle();
    this.menuCtl.enable(false);
    // this.platform.ready().then(()=>{
    //   this.storage.get("serverURL").then(serverURL=>{
    //       this.serverURL= serverURL;
    //       this.storage.get("userLoginInfo").then(userLoginInfo=>{
    //         if (userLoginInfo){
    //           this.usernameInput = userLoginInfo.username;
    //           this.passwordInput = userLoginInfo.password;
    //           this.login();
    //         }else{
    //           this.changestyle();
    //         }
    //       });
    //     });
    //   });
  }

  ionViewWillLeave(){
    this.menuCtl.enable(true);
  }

  changestyle(){
    this.dinamicformclass = "loginformShow";
  }

}
