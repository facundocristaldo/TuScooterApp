import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { ImagePicker } from '@ionic-native/image-picker/ngx';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  json="";
  serverURL = "";
  userinfo ={cellphone:"",email:"",name:"",saldo:0.0,surname:"",urlphoto:"",username:"",password:""};
  base64img="";
  formgroup: FormGroup;
  confirmPassword: AbstractControl;
  password: AbstractControl;
  email: AbstractControl;
  name: AbstractControl;
  surname: AbstractControl;
  cellphone: AbstractControl;
  
  constructor(
    private storage: Storage,
    private http: HTTP,
    private platform: Platform,
    public formBuilder: FormBuilder,
    private imagePicker: ImagePicker,
    private toastController: ToastController,

  ) {
    console.log("works till this")
    this.formgroup = formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      cellphone: ['', []],
      confirmPassword: ['', []]
    })
    console.log("works till this")
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
    console.log("enter")
    this.platform.ready().then(() => {
      console.log("platform ready")
      this.storage.get("serverURL").then(serverURL => {
        this.serverURL = serverURL;
        console.log("serverurl " + serverURL)
        this.storage.get("userLoginInfo").then(userinfo => {
          console.log("userinfor = " + userinfo)
          
          this.http.get(this.serverURL + "users/cliente?username="+userinfo.username,{}, {}).then(response => {
            console.log(response.data)
            let responseBody = JSON.parse(response.data);
            if (responseBody.body) {
              this.userinfo = responseBody.body;
              this.confirmPassword.setValue(responseBody.body.password);
            }
          })
        })
      })
    })
  }

  pickImage() {
    const options = {
      maximumImagesCount: 1,
      quality: 50,
      width: 512,
      height: 512,
      outputType: 1
    }

    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        let base64Img = "data:image/jpeg;base64," + results[i];

        this.toastController.create({
          message: "IMAGE:" + base64Img,
          duration: 5000
        }).then(e => e.present().then(()=>{
          this.toastController.create({
            message: "IMAGE1:" + results[i],
            duration: 5000
          }).then(e => e.present());
        }));

        this.userinfo.urlphoto=results[i];
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
    if (this.password.value!==this.confirmPassword.value){
      this.toastController.create({
        message:"Las contraseñas deben coincidir",
        duration:3000,
      }).then(e=>e.present());
    }else{

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
          if (responseBody.success == true && responseBody.body == true) {
            this.toastController.create({
              message: 'Información Actualizada',
              duration: 3000
            }).then(e => e.present());
            if (this.userinfo.password.trim() != "") {
              this.platform.ready().then(() => {
                let userLoginInfo = {
                  username: this.userinfo.username,
                  password: this.password.value,
                }
                this.storage.set('userLoginInfo', userLoginInfo);
              });
            }
            
          }else{
            this.toastController.create({
              message: 'Algo salió mal',
              duration: 3000
            }).then(e => e.present());
          }
        } else if (response.status !=200) {//error de validacion
          this.toastController.create({
            message: 'Algo salió mal',
            duration: 3000
          }).then(e => e.present());
        } else { //usuario no existe
          this.toastController.create({
            message: 'Algo salió mal',
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
    
    
  toggleEnable(name:string){
    if (this.formgroup.get(name).enabled){
      this.formgroup.get(name).disable()
    }else{
      this.formgroup.get(name).enable()
    }
  }
}
