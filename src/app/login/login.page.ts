import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UserService } from '../api/user.service';
import { Router } from '@angular/router';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usernameInput ="";
  passwordInput="";
  constructor(
    private menuCtl: MenuController,
    private userService:UserService,
    private router: Router) { 

    

  }

  ngOnInit() {
  }

  login(){
    console.log("Datos de login:("+this.usernameInput+","+this.passwordInput+")");
    let response = this.userService.userLogin(this.usernameInput,this.passwordInput)
    if (response.status==200){//login ok
      console.log("Login ok");
      this.router.navigate(["home"]);
    }else if(response.status=500){//error de validacion
      console.log("error de validacion")
    }else{ //usuario no existe
      console.log("usuario no existe");
    }
  }

  ionViewWillEnter(){
    this.menuCtl.enable(false);
  }

  ionViewWillLeave(){
    this.menuCtl.enable(true);
  }
}
