import { Component, OnInit, Inject, forwardRef, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController, Platform, ToastController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { GlobalProperties } from '../Classes/GlobalProperties';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  formgroup: FormGroup;


  usernameInput : AbstractControl;
  passwordInput : AbstractControl;
  confPasswordInput : AbstractControl;
  emailInput : AbstractControl;
  nameInput : AbstractControl;
  surnameInput : AbstractControl;

  serverURL = "";

  constructor(
    private router:Router,
    private menuCtl:MenuController,
    private platform:Platform,
    private storage:Storage,
    private http:HTTP,
    private toastCtrl:ToastController,
    private navController:NavController,
    public formBuilder: FormBuilder,
    public globalprops : GlobalProperties
    ) {
      this.formgroup = formBuilder.group({
        nameInput:['',[Validators.required]],
        surnameInput:['',[Validators.required]],
        usernameInput:['',[Validators.required]],
        passwordInput:['',[Validators.required]],
        confPasswordInput:['',[Validators.required]],
        emailInput:['',[Validators.email,Validators.required]]

      })

      this.nameInput  =this.formgroup.controls["nameInput"];
      this.surnameInput = this.formgroup.controls["surnameInput"];
      this.usernameInput = this.formgroup.controls["usernameInput"];
      this.passwordInput = this.formgroup.controls["passwordInput"];
      this.confPasswordInput = this.formgroup.controls["confPasswordInput"];
      this.emailInput = this.formgroup.controls["emailInput"];
    } 

  ngOnInit() {
  }

  register(){
    if (this.passwordInput.value!==this.confPasswordInput.value){
      this.toastCtrl.create({
        message:"Las contraseñas deben coincidir",
        duration:3000,
      }).then(e=>e.present());
    }else if (this.formgroup.valid){
      let body={
        "username":this.usernameInput.value,
        "password":this.passwordInput.value,
        "email":this.emailInput.value,
        "name":this.nameInput.value,
        "surname":this.surnameInput.value,
        "cellphone":"",
        "urlphoto": "",
        "saldo": 0.0
        }
      let headers=this.globalprops.httpheader;
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

