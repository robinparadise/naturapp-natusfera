import {Component, OnInit} from '@angular/core';
import {GoogleMap, GoogleMaps} from '@ionic-native/google-maps/ngx';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss']
})
export class AboutPage implements OnInit {

  map: GoogleMap;

  constructor(private platform: Platform) {}

    async ngOnInit() {
      await this.platform.ready();
      await this.loadMap();
    }

    private loadMap() {

        // let element: HTMLElement = document.getElementById('map_canvas0');
        // console.log("elemeeent map ", element)

        this.map = GoogleMaps.create('map_canvas0')

        // this.map = GoogleMaps.create('map_canvas0', {
        //     camera: {
        //         target:{
        //             lat: 43.0741704,
        //             lng: -89.3809802
        //         },
        //         zoom: 18,
        //         tilt: 30
        //     }
        // });
    }


}
