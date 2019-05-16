import { Component, OnInit, Inject, forwardRef, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController, Platform, ToastController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  usernameInput : String="";
  passwordInput : String="";
  confPasswordInput : String="";
  emailInput : String="";
  nameInput : String="";
  surnameInput : String="";
  cellphoneInput : String="";
  serverURL = "";
  constructor(
    private router:Router,
    private menuCtl:MenuController,
    private platform:Platform,
    private storage:Storage,
    private http:HTTP,
    private toastCtrl:ToastController,
    private navController:NavController,
    ) {
      
    } 

  ngOnInit() {
  }
  register(){
    if (this.usernameInput.trim()=="" || this.passwordInput.trim()=="" || this.confPasswordInput.trim()=="" || this.emailInput.trim()=="" || this.nameInput.trim()=="" || this.surnameInput.trim()==""){
      this.toastCtrl.create({
           message: 'Complete todos los datos',
           duration: 3000
          }).then(e=>e.present());
    }else if (this.passwordInput.trim()!=this.confPasswordInput.trim()){
      this.toastCtrl.create({
           message: 'Las contraseñas deben coincidir',
           duration: 3000
          }).then(e=>e.present());
    }else{
      this.toastCtrl.create({
        message:"HTTP Request address."+this.serverURL+"users/client/abm/A",
        duration:3000,
      }).then(e=>e.present());
      let body={
        "username":this.usernameInput,
        "password":this.passwordInput,
        "email":this.emailInput,
        "name":this.nameInput,
        "surname":this.surnameInput,
        "cellphone":this.cellphoneInput,
        "urlphoto": "",
        "saldo": 0.0
        }
      let headers={
        'Content-Type':'application/json',
        'Accept':'*/*',
        'Timeout':'5000'
      }
      this.http.setDataSerializer('json')
      this.http.post(this.serverURL+'users/client/abm/A',
      body
      ,headers)
      .then(response=>{ 
        let responseBody = JSON.parse(response.data);
        if (response.status==200 && response.data){//login ok
          if (responseBody.success.toString()=="true"){
            this.toastCtrl.create({
            message: 'Registrado correctamente',
            duration: 3000
            }).then(e=>e.present());
            this.platform.ready().then(()=>{
              let userLoginInfo = {
                username:this.usernameInput,
                password:this.passwordInput,
              }
              this.storage.set('userLoginInfo',userLoginInfo);
              this.router.navigate(["login"]);
              });
          }
        }else if(response.status==500 || responseBody.success.toString()=="false"){//error de validacion
          this.toastCtrl.create({
           message: 'Error al registrar',
           duration: 3000
          }).then(e=>e.present());
        }else{ //usuario no existe
          this.toastCtrl.create({
           message: 'Usuario ya existe',
           duration: 3000
          }).then(e=>e.present());
        }
      }).catch(err=>{
        this.toastCtrl.create({
           message: 'Algo salió mal :'+err.data,
           duration: 3000
          }).then(e=>e.present());
      });
    }
  }
  ionViewWillEnter(){
    this.menuCtl.enable(false);
    this.platform.ready().then(()=>{
      this.storage.get("serverURL").then(serverURL=>{
        this.serverURL= serverURL;
      })
    })
  }


  ionViewWillLeave(){
    this.menuCtl.enable(true);
  }

  goback(){
    this.navController.pop();
  }
}

