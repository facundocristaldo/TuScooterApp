import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-travelinfo',
  templateUrl: './travelinfo.page.html',
  styleUrls: ['./travelinfo.page.scss'],
})
export class TravelinfoPage implements OnInit {

  guidAlquiler;
  constructor(
    private navParams:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.guidAlquiler = this.navParams.snapshot.paramMap.get('alquiler');
  }

}
