import { Component, Input } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { filter } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var google;

@Component({
  selector: 'google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent {

  @Input()
  isTrack: boolean;
  @Input()
  alquiler: "";
  @Input()
  showScooters: boolean;
  @Input()
  followME : boolean;

  watchPosition = true;
  map: any;
  pest: number = 1;
  positionSubscription;
  currentMapTrack;
  trackedRoute;
  isTracking = false;
  auxLat: number = 0;
  auxLng: number = 0;
  auxRadio: number = 300;
  serverURL = "";
  markerYO;
  AgregarMsg: number = 0;
  formEmp = {
    Rut: '',
    Nombre: '',
    URLocator: '',
    NombreRubro: '',
    Direccion: '',
    Descripcion: '',
    UserName: '',
    User: '',
    Pass: '',
    Logo: '',
    lat: '',
    lng: ''
  }
  availableScooters: { guid, latlng: { lat, lng }, bateryLevel }[] = [];
  token = "";

  constructor(
    public platform: Platform,
    private geo: Geolocation,
    private storage: Storage,
    private http: HttpClient,
    private toastController: ToastController
  ) {
    this.platform.ready().then(()=>{
      this.storage.get("token").then(token=>{
        this.token = token;
      })
    })
  }
  ngOnDestroy() {
    console.log("gogle ng destroy")
  }

  ngOnInit() {
    document.getElementById("buttonArea").setAttribute("hidden","true");
    setTimeout(() => {
      this.cargarmapa();
    }, 300);

  }

  async cargarmapa() {
    console.log("gogle ng init")
    await this.platform.ready().then(() => {

      let mapOptions = {
        center: { lat: -34.897567, lng: -56.164346 },
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false

      }
      this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      

    });
    this.platform.ready().then(() => {
      this.storage.get("serverURL").then(data => {
        this.serverURL = data;
      }).then(() => {
        if (this.showScooters) {
          this.drawScootersinMap();
          this.centerME();
        }
        if (this.isTrack) {
          if (!this.isTracking) {
            this.trackedRoute = []
            this.isTracking = true;
          }
          this.positionSubscription = this.geo.watchPosition()
            .pipe(
              filter(p => p.coords !== undefined)
            )
            .subscribe(data => {
              setTimeout(() => {
                if (this.markerYO!=null || this.markerYO!=undefined){
                  this.markerYO.setMap(null);
                }

                this.markerYO = new google.maps.Marker({
                  position: new google.maps.LatLng(data.coords.latitude, data.coords.longitude),
                  map: this.map,
                  title: 'Yo',
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: '#00F',
                    fillOpacity: 0.6,
                    strokeColor: '#00A',
                    strokeOpacity: 0.9,
                    strokeWeight: 1,
                    scale: 7
                  }
                });
                if (this.followME){
                  this.map.setCenter(this.markerYO.position());
                  this.map.setZoom(15);
                }
              });

            });
        }
        if (this.alquiler != "" && this.alquiler != undefined) {
          let headers = new HttpHeaders({
            'Authorization':this.token
          })
          let option = {
            headers:headers
          }
          this.http.get(this.serverURL + "alquileres/find?guid=" + this.alquiler,option ).subscribe(response => {
            let responseBody:any = response;
            if (responseBody && responseBody.body != null) {
              let scooter :any = responseBody.body
              var travelcoordinates = scooter.geometria.puntos
              var lineSymbol = {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
              };
              var recorrido = new google.maps.Polyline({
                path: travelcoordinates,
                geodesic: true,
                strokeColor: '#5ABE2E',
                strokeOpacity: 1.0,
                strokeWeight: 4,
                icons: [{
                  icon: lineSymbol,
                  offset: '100%'
                }],
              });
              recorrido.setMap(this.map);
              var bounds = new google.maps.LatLngBounds();
              for (var i = 0; i < travelcoordinates.length; i++) {
                bounds.extend(travelcoordinates[i]);
              }
              console.log(bounds.getCenter());
              this.map.setCenter(bounds.getCenter());
              this.map.setZoom(15);
            }
          });
        }

        if (this.isTrack || this.showScooters) {
          let headers = new HttpHeaders({
            'Authorization':this.token
          })
          let option = {
            headers:headers
          }
          this.http.get(this.serverURL + "scooter/obtenerArea", option).subscribe(response => {
            if ( response == null) {
              this.toastController.create({
                message: "Error al obtener área permitida.",
                duration: 3000
              }).then(e => e.present());
            } else {
              let responseBody :any= response;
              let areaCoords = responseBody.body.puntos;
              var areaPermitida = new google.maps.Polygon({
                paths: areaCoords,
                strokeColor: '#77DD77',
                strokeOpacity: 0.4,
                strokeWeight: 0.1,
                fillColor: '#77DD77',
                fillOpacity: 0.1
              });
              areaPermitida.setMap(this.map);
            }
          });
        }
      })
    })
    document.getElementById("buttonArea").removeAttribute("hidden");
  }

  drawScootersinMap() {
    
    let headers = new HttpHeaders({
      'Authorization':this.token
    })
    let option = {
      headers:headers
    }
    this.http.get(this.serverURL + "scooter/disponibles", option).subscribe(response => {
      console.log("scooters disponibles response:->" + response)
      let responseBody :any =response
      if (responseBody.body) {
        let tempScooterArray: any = responseBody.body;
        console.log("responsebody:" + tempScooterArray.length)
        this.availableScooters = [];
        tempScooterArray.forEach(onescooter => {
          let geometry : any = onescooter.geometria;
          console.log("geometria ")
          console.log(geometry)
          this.availableScooters.push({
            "guid": onescooter.guid,
            "bateryLevel": onescooter.bateryLevel,
            "latlng": geometry.puntos[0],
          })
        });
        if (this.showScooters) {
          setTimeout(() => {
            var image = {
              url: "https://i.imgur.com/4PCncWk.png",
              size: new google.maps.Size(20, 32),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(0, 32)
            };
            var shape = {
              coords: [1, 1, 1, 20, 18, 20, 18, 1],
              type: 'poly'
            };
            this.availableScooters.forEach(onescooter => {
              let scootermarker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                map: this.map,
                position: new google.maps.LatLng(onescooter.latlng.lat, onescooter.latlng.lng),
                icon: image,
                shape: shape, strokeColor: '#00A',
                strokeOpacity: 0.9,
                strokeWeight: 1,
              });
            });
            // this.geo.getCurrentPosition().then(data => {
            //   this.map.setZoom(17);
            //   this.map.setCenter(new google.maps.LatLng(data.coords.latitude, data.coords.longitude));
            // });
          }, 200);
        }

      }
    })

  }

  drawPath(path) {
    if (this.currentMapTrack) {
      this.currentMapTrack.setMap(null);
    }

    if (path.length > 1) {
      this.currentMapTrack = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#ff00ff",
        strokeOpacity: 1.0,
        strokeWeight: 3
      });
      this.currentMapTrack.setMap(this.map);
    }
  }

  stopTracking() {
    console.log("Stop tracking");
    let newRoute = { finished: new Date().getTime(), path: this.trackedRoute };
    this.isTracking = false;
    this.positionSubscription.unsubscribe();
    this.currentMapTrack.setMap(null);
  }

  centerME() {
    this.geo.getCurrentPosition().then(data => {
      this.map.setZoom(17);
      this.map.setCenter(new google.maps.LatLng(data.coords.latitude, data.coords.longitude));
    });
  }
}