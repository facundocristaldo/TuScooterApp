import { Component, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { filter } from 'rxjs/operators';

declare var google;

@Component({
  selector: 'google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent{

  @Input()
  isTrack:boolean;

  watchPosition = true;
  map : any;
  pest: number = 1;
  positionSubscription;
  currentMapTrack;
  trackedRoute;
  isTracking = false;
  auxLat : number = 0;
  auxLng : number = 0;
  auxRadio : number = 300;

  AgregarMsg : number = 0;
  formEmp = {
    Rut : '',
    Nombre : '',
    URLocator : '',
    NombreRubro : '',
    Direccion : '',
    Descripcion : '',
    UserName : '',
    User : '',
    Pass : '',
    Logo: '',
    lat: '',
    lng: ''
  }
  constructor(public plt:Platform, 
    private geo : Geolocation
    ) {
    
  }
  ngOnInit(){
    this.plt.ready().then(()=>{
      let mapOptions={
        center: {lat: -34.90595, lng: -56.16381749999999},
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl:false,
        fullscreenControl:false

      }
      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);     
       this.geo.getCurrentPosition().then(data=>{
         this.map.setZoom(17);
         this.map.setCenter(new google.maps.LatLng(data.coords.latitude,data.coords.longitude));
       });
       if (this.isTrack ){
        if (!this.isTracking){
          console.log("Start tracking");
          this.trackedRoute = []
          this.isTracking = true;
        }
        this.positionSubscription = this.geo.watchPosition()
          .pipe(
            filter(p=> p.coords!==undefined)
          )
          .subscribe(data=>{
            setTimeout(()=>{
              console.log("user position:("+data.coords.latitude+","+data.coords.longitude+")");
              this.map.setZoom(17);
              this.map.setCenter(new google.maps.LatLng(data.coords.latitude,data.coords.longitude));
              this.drawPath(this.trackedRoute);
            });
          }); 
      }
    });
  }

  drawPath(path){
    if(this.currentMapTrack){
      this.currentMapTrack.setMap(null);
    }
    
    if(path.length>1){
      this.currentMapTrack = new google.maps.Polyline({
        path:path,
        geodesic: true,
        strokeColor: "#ff00ff",
        strokeOpacity:1.0,
        strokeWeight:3
      });
      this.currentMapTrack.setMap(this.map);
    }
  }

  stopTracking(){
    console.log("Stop tracking");
    let newRoute = {finished: new Date().getTime(),path:this.trackedRoute};
    this.isTracking = false;
    this.positionSubscription.unsubscribe();
    this.currentMapTrack.setMap(null);
  }

  ionViewWillLeave(){
    this.stopTracking();
    //this.positionSubscription.unsubscribe();
  }
}
