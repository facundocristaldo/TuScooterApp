import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform, ToastController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { ImagePicker } from '@ionic-native/image-picker/ngx';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  json = "";
  serverURL = "";
  userinfo = { cellphone: "", email: "", name: "", saldo: 0.0, surname: "", urlphoto: "", username: "", password: "" };
  base64img = "";
  formgroup: FormGroup;
  confirmPassword: AbstractControl;
  password: AbstractControl;
  email: AbstractControl;
  name: AbstractControl;
  surname: AbstractControl;
  cellphone: AbstractControl;
  loading;
  constructor(
    private storage: Storage,
    private http: HTTP,
    private platform: Platform,
    public formBuilder: FormBuilder,
    private imagePicker: ImagePicker,
    private toastController: ToastController,
    private loadingController: LoadingController

  ) {
    this.formgroup = formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      cellphone: ['', []],
      confirmPassword: ['', []]
    })
    this.name = this.formgroup.controls["name"];
    this.surname = this.formgroup.controls["surname"];
    this.password = this.formgroup.controls["password"];
    this.cellphone = this.formgroup.controls["cellphone"];
    this.email = this.formgroup.controls["email"];
    this.confirmPassword = this.formgroup.controls["confirmPassword"];
    this.confirmPassword.setValue("");
    this.name.disable();
    this.surname.disable();
    this.password.disable();
    this.confirmPassword.disable();
    this.cellphone.disable();
    this.email.disable();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.refreshPage()
  }

  async doRefresh(event) {
    let ret = false;
    ret = await this.refreshPage();
    console.log(ret)
    event.target.complete();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 3000);
  }

  async refreshPage(): Promise<any> {
    this.platform.ready().then(() => {
      this.storage.get("serverURL").then(serverURL => {
        this.serverURL = serverURL;
        this.storage.get("userLoginInfo").then(userinfo => {
          this.http.get(this.serverURL + "users/cliente?username=" + userinfo.username, {}, {}).then(response => {
            let responseBody = JSON.parse(response.data);
            if (responseBody.body) {
              this.userinfo = responseBody.body;
              this.formgroup.get("name").disable();
              this.formgroup.get("surname").disable();
              this.formgroup.get("email").disable();
              this.formgroup.get("password").disable();
              this.formgroup.get("confirmpassword").disable();
              this.formgroup.get("cellphone").disable();
              this.confirmPassword.setValue(responseBody.body.password);
              return true;
            }
          })
        })
      })
    })
    return false;
  }


  async pickImage() {
    const options = {
      maximumImagesCount: 1,
      quality: 50,
      width: 512,
      height: 512,
      outputType: 1
    }
    const loading = await this.loadingController.create({
      message:""
    });
    await loading.present();
    
 
    setTimeout(() => {
      
      loading.dismiss()  
    }, 5000);
    this.imagePicker.getPictures(options).then((results) => {
     

      for (var i = 0; i < results.length; i++) {
        let base64Img = "data:image/jpeg;base64," + results[i];
        this.userinfo.urlphoto = results[i];
        this.base64img = base64Img;
      }
     
    }, (err) => {
      this.toastController.create({
        message: "ERROR:" + err,
        duration: 5000
      }).then(e => e.present());
    });
  }

  actualizarAction() {
    let pswenabled:boolean = this.formgroup.get("password").enabled;
    console.log("enabled? "+pswenabled);
    if ( (pswenabled ) && this.password.value != this.confirmPassword.value) {
      this.toastController.create({
        message: "Las contraseñas deben coincidir",
        duration: 3000,
      }).then(e => e.present());
    } else {

      this.http.setDataSerializer("json")
      this.http.post(this.serverURL + "users/client/abm/M", {
        "username": this.userinfo.username,
        "password": this.password.value,
        "email": this.email.value,
        "name": this.name.value,
        "surname": this.surname.value,
        "cellphone": this.cellphone.value,
        "urlphoto": this.base64img
      }, {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Connection-Timeout': '5000'
        }).then(response => {
          if (response.status == 200 && response.data) {
            let responseBody = JSON.parse(response.data);
            console.log("checking")
            if (responseBody.success == true && responseBody.body == true) {
              console.log("succes and body true")
              this.toastController.create({
                message: 'Información Actualizada',
                duration: 3000
              }).then(e => e.present());
              if (this.userinfo.password!=undefined && this.userinfo.password!=null){
                if (this.userinfo.password.trim() != "") {
                  this.platform.ready().then(() => {
                    let userLoginInfo = {
                      username: this.userinfo.username,
                      password: this.password.value,
                    }
                    this.storage.set('userLoginInfo', userLoginInfo);
                  });
                }
              }

            } else {
              this.toastController.create({
                message: 'Algo salió mal1',
                duration: 3000
              }).then(e => e.present());
            }
          } else if (response.status != 200) {//error de validacion
            this.toastController.create({
              message: 'Algo salió mal2',
              duration: 3000
            }).then(e => e.present());
          } else { //usuario no existe
            this.toastController.create({
              message: 'Algo salió mal3',
              duration: 3000
            }).then(e => e.present());
          }
        }).catch(err => {
          this.toastController.create({
            message: 'Algo salió mal :' + err.data,
            duration: 3000
          }).then(e => e.present());
        });
    }
  }


  toggleEnable(name: string) {
    if (this.formgroup.get(name).enabled) {
      this.formgroup.get(name).disable()
    } else {
      this.formgroup.get(name).enable()
    }
  }

  
}
