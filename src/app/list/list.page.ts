import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { ToastController, Platform, } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {

  username  = "";
  serverURL="";
  alquileres : any[]=[];
  
  
  constructor(
    private http:HTTP,
    private toastController:ToastController,
    private platform : Platform, 
    private storage:Storage,
    private router:Router
    ) {
    
  }
 
  ngOnInit() {
  }

  ionViewWillEnter(){
    this.alquileres=[];
    this.username="";
    this.platform.ready().then(()=>{
      this.storage.get("userLoginInfo").then(e=>this.username=e.username)
      this.storage.get("serverURL").then((serverURL=>{
        this.serverURL = serverURL;
        this.refreshPage();
      }))
    })

  }

  ViewDetails(alquiler){
    console.log(alquiler)
    console.log(JSON.stringify(alquiler))
    this.router.navigate(["/travelinfo/"+alquiler.alquilerguid])
  }

  async doRefresh(event){
    await this.refreshPage();
    event.target.complete();
  }

  async refreshPage():Promise<any>{
    this.http.get(this.serverURL+"alquileres/porcliente?username="+this.username,{},{}).then(response=>{
      let responseBody = JSON.parse(response.data);
      if (responseBody.body!=[] && responseBody.body!=null){

        console.log(responseBody)
        let tempListaAlquileres :any[] = responseBody.body;
        console.log(tempListaAlquileres)
        for (var i=0;i<tempListaAlquileres.length;i++){
        
          var tempAlquiler:any = tempListaAlquileres[i];
          var tempfecha :String = tempAlquiler.timestamp;
          var tempduration : String = tempAlquiler.duration;
          let alquilertoPush={
            username: tempAlquiler.cliente,
            alquilerguid: tempAlquiler.guid,
            fechaAlquiler: "",
            precioAlquiler:tempAlquiler.price,
            duracion:"",
            ubicacionesDeReferencia:[]
          }

          if (tempduration!=undefined && tempduration!=null){
            alquilertoPush.duracion = tempduration.substr(12,8).replace("[a-zA-Z]","");
          }
          if (tempfecha!=undefined && tempfecha!=null){
            alquilertoPush.fechaAlquiler = tempfecha.substr(0,19).replace("T"," ");
          }
          
          if (tempAlquiler.geometria){
            var tempgeometry: any = tempAlquiler.geometria;
            alquilertoPush.ubicacionesDeReferencia = tempgeometry.puntos
          }
          this.alquileres.push(alquilertoPush);
        
        }
      }
      
    }).catch(err=>{
      this.toastController.create({
        message:"Error"+err,
        duration:3000
      }).then(e=>e.present())
    })
  }
}


