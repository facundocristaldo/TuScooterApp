import { Component, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { filter } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';

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
serverURL="";

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
  availableScooters : any[]=[];
  constructor(public platform:Platform, 
    private geo : Geolocation,
    private storage:Storage,
    private http:HTTP,
    ) {
    
  }
  ngOnInit(){
    this.platform.ready().then(()=>{
      
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
       this.drawScootersinMap();
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

  drawScootersinMap(){
    this.availableScooters.forEach(onescooter => {

      let scootermarker = new google.maps.Marker({
        map: this.map,
        position: new google.maps.LatLng(onescooter.latlng.lat.onescooter.latlng.lng),
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#00F',
            fillOpacity: 0.6,
            strokeColor: '#00A',
            strokeOpacity: 0.9,
            strokeWeight: 1,
            scale: 3
          }
        });
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

  ionViewWillEnter(){
    this.platform.ready().then(()=>{
      this.storage.get("serverURL").then(data=>{
        this.serverURL=data;
      }).then(()=>{
        this.http.setDataSerializer('json');
        this.http.get(this.serverURL+"scooter/disponibles",{},{'Accept':'*/*'}).then(response=>{
          let tempScooterArray = response.data;
          this.availableScooters = [];
          tempScooterArray.forEach(onescooter=> {
            let geometry = onescooter.geometria;
            this.availableScooters.push({
              guid:onescooter.guid,
              bateryLevel:onescooter.bateryLevel,
              latlng:geometry.puntos[0]
            })
          });
        })
      })
    })
  }

  ionViewWillLeave(){
    this.stopTracking();
    //this.positionSubscription.unsubscribe();
  }
}
/*[
    {
        "bateryLevel": 100,
        "geometria": {
            "puntos": [
                {
                    "lat": -71.06032,
                    "lng": 48.432045
                }
            ],
            "type": "POINT"
        },
        "guid": "osadf-afd-asg-rt",
        "isAvailable": true,
        "isRented": false
    },
    {
        "bateryLevel": 100,
        "geometria": {
            "puntos": [
                {
                    "lat": -71.06032,
                    "lng": 48.432045
                }
            ],
            "type": "POINT"
        },
        "guid": "rgewrasfdawertqw",
        "isAvailable": true,
        "isRented": false
    },
    {
        "bateryLevel": 100,
        "geometria": {
            "puntos": [
                {
                    "lat": -71.06032,
                    "lng": 48.432045
                }
            ],
            "type": "POINT"
        },
        "guid": "rgewr234sfdawertqw",
        "isAvailable": true,
        "isRented": false
    }
]*/