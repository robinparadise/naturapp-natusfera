import {Component, OnInit, ViewChild, ElementRef, ViewEncapsulation} from '@angular/core';
import {UserLocationService} from '../../providers/user-location.service';
import {Platform} from '@ionic/angular';
import {GoogleMap, GoogleMaps, LatLng} from '@ionic-native/google-maps/ngx';
import {Router} from '@angular/router';
import {ParamsObserverService} from '../../providers/params-observer.service';
declare var google: any;

@Component({
  selector: 'app-select-position',
  templateUrl: './select-position.component.html',
  styleUrls: ['./select-position.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class SelectPositionComponent implements OnInit {
  private coords: Coordinates;
  private map: GoogleMap;
  private modal: HTMLIonModalElement;
  mapEle: any
  mapJs: any
  marker: any
  @ViewChild('mapCanvas') mapElement: ElementRef;
  constructor(private userLocation: UserLocationService,
              private router: Router,
              // private modalCtrl: ModalController,
              private params: ParamsObserverService,
              private platform: Platform) { }

  async ngOnInit() {
    // this.modal = await this.modalCtrl.getTop();
    await this.platform.ready();
    setTimeout(async () => {
      await this.loadMap();
      this.userLocation.getLocation().then(coords => {
        this.coords = coords;
        console.log('Coords ', coords);
        this.updatePosition();
      });
    }, 1000)
  }
  private loadMap(){
    if (this.platform.is('cordova'))
      this.map = GoogleMaps.create('map_select', {});
    else {
      this.mapEle = this.mapElement.nativeElement;
      this.mapJs = new google.maps.Map(this.mapEle, {
         center: {lat: 40, lng: -3},
          zoom: 8
      });

      // mapData.forEach((markerData: any) => {
      //   const infoWindow = new google.maps.InfoWindow({
      //     content: `<h5>${markerData.name}</h5>`
      //   });

      //   const marker = new google.maps.Marker({
      //     position: markerData,
      //     map,
      //     title: markerData.name
      //   });

      //   marker.addListener('click', () => {
      //     infoWindow.open(map, marker);
      //   });
      // });
      google.maps.event.addListenerOnce(this.mapJs, 'idle', () => {
        this.mapEle.classList.add('show-map');
      });
    }

  }
  private updatePosition() {
    if (this.map) {
      const latlng = new LatLng(this.coords.latitude, this.coords.longitude);
      this.map.animateCamera({
        target: latlng,
        zoom: 12,
        tilt: 30
      });
    } else {
      var myLatLng = {lat: this.coords.latitude, lng: this.coords.longitude};

      this.marker = new google.maps.Marker({
        position: myLatLng,
        map: this.mapJs,
        title: 'my location'
      });
    }
  }

  close() {
    // this.modal.dismiss()
    this.router.navigateByUrl('/tabs/observe');
  }

  selected() {
    if (this.platform.is('cordova')) {
      const coords = this.map.getCameraPosition().target;
      console.log(" map center position ", coords);
      // this.modal.dismiss(coords, 'position')
      // this.router.navigate(['/tabs/(observe:observe)'])
      // this.params.item = { type: 'position', coords };
      const {lat, lng} = coords;
      this.params.publish({ type: 'position', coords: {latitude: lat, longitude: lng} });
    } else {
      const lat = this.marker.getPosition().lat();
      const lng = this.marker.getPosition().lng();
      this.params.publish({ type: 'position', coords: {latitude: lat, longitude: lng} });
    }
    this.close();
  }
}
