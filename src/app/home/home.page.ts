import { Component } from '@angular/core';
import { QrscannerPage } from '../qrscanner/qrscanner.page';
import { Router } from '@angular/router';
import { GoogleMapComponent } from './google-map/google-map.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isStart = true;

  startTravel(){
    this.router.navigate(['qrscanner']);
    this.isStart=false;
  }

  stopTravel(){
    this.isStart=true;
  }

  constructor(private router: Router, private google:GoogleMapComponent){}
}
