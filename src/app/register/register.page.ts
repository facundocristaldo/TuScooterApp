import { Component, OnInit, Inject, forwardRef, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController, Platform, ToastController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { GlobalProperties } from '../Classes/GlobalProperties';
import sha256 from "fast-sha256";

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
    private http:HttpClient,
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
      let encriptedpass = SHA1(this.passwordInput.value)
      console.log("encripted password")
      console.log(encriptedpass)
      let body={
        "username":this.usernameInput.value,
        "password":encriptedpass.toString(),
        "email":this.emailInput.value,
        "name":this.nameInput.value,
        "surname":this.surnameInput.value,
        "cellphone":"",
        "urlphoto": "",
        "saldo": 0.0
        }
      let headers = new HttpHeaders({
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Connection-Timeout': '5000'
      })
      let option = {
        headers:headers
      }
      this.http.post(this.serverURL+'users/client/abm/A',
      body
      ,option)
      .subscribe(response=>{ 
        let responseBody :any = response;
        if (responseBody.success.toString()=="true" && responseBody.body){//login ok
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
        }else if(responseBody.success.toString()=="false"){//error de validacion
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

function SHA1 (msg) {

  function rotate_left(n,s) {
      var t4 = ( n<<s ) | (n>>>(32-s));
      return t4;
  };

  function lsb_hex(val) {
      var str="";
      var i;
      var vh;
      var vl;
      for( i=0; i<=6; i+=2 ) {
          vh = (val>>>(i*4+4))&0x0f;
          vl = (val>>>(i*4))&0x0f;
          str += vh.toString(16) + vl.toString(16);
      }
      return str;
  };
  function cvt_hex(val) {
      var str="";
      var i;
      var v;
      for( i=7; i>=0; i-- ) {
          v = (val>>>(i*4))&0x0f;
          str += v.toString(16);
      }
      return str;
  };
  function Utf8Encode(string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";
      for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
              utftext += String.fromCharCode(c);
          }
          else if((c > 127) && (c < 2048)) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
          }
          else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
          }
      }
      return utftext;
  };
  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xEFCDAB89;
  var H2 = 0x98BADCFE;
  var H3 = 0x10325476;
  var H4 = 0xC3D2E1F0;
  var A, B, C, D, E;
  var temp;
  msg = Utf8Encode(msg);
  var msg_len = msg.length;
  var word_array = new Array();
  for( i=0; i<msg_len-3; i+=4 ) {
      j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
      msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
      word_array.push( j );
  }
  switch( msg_len % 4 ) {
      case 0:
          i = 0x080000000;
      break;
      case 1:
          i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
      break;
      case 2:
          i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
      break;
      case 3:
          i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8    | 0x80;
      break;
  }
  word_array.push( i );
  while( (word_array.length % 16) != 14 ) word_array.push( 0 );
  word_array.push( msg_len>>>29 );
  word_array.push( (msg_len<<3)&0x0ffffffff );
  for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
      for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
      for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
      A = H0;
      B = H1;
      C = H2;
      D = H3;
      E = H4;
      for( i= 0; i<=19; i++ ) {
          temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
          E = D;
          D = C;
          C = rotate_left(B,30);
          B = A;
          A = temp;
      }
      for( i=20; i<=39; i++ ) {
          temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
          E = D;
          D = C;
          C = rotate_left(B,30);
          B = A;
          A = temp;
      }
      for( i=40; i<=59; i++ ) {
          temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
          E = D;
          D = C;
          C = rotate_left(B,30);
          B = A;
          A = temp;
      }
      for( i=60; i<=79; i++ ) {
          temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
          E = D;
          D = C;
          C = rotate_left(B,30);
          B = A;
          A = temp;
      }
      H0 = (H0 + A) & 0x0ffffffff;
      H1 = (H1 + B) & 0x0ffffffff;
      H2 = (H2 + C) & 0x0ffffffff;
      H3 = (H3 + D) & 0x0ffffffff;
      H4 = (H4 + E) & 0x0ffffffff;
  }
  var temp: any = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
  return temp.toLowerCase();
}