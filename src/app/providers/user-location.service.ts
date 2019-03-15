import { Injectable } from '@angular/core';
import {Coordinates, Geolocation} from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class UserLocationService {

  coords: Coordinates;

  constructor(private geolocation: Geolocation) {
   let  watchID = navigator.geolocation.watchPosition(this.onSuccess, this.onError, { timeout: 30000 });
  }

  onSuccess = (position) =>{
    var element = document.getElementById('geolocation');
    element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
                        'Longitude: ' + position.coords.longitude     + '<br />' +
                        '<hr />'      + element.innerHTML;
}

// onError Callback receives a PositionError object
//
onError = (error) => {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

// Options: throw an error if no update is received every 30 seconds.
//


  getLocation() : Promise<Coordinates> {
      return new Promise<Coordinates>( (resolve, reject)=>{
          if(this.coords) resolve(this.coords);
          this.geolocation.getCurrentPosition().then((resp) => {
              // resp.coords.latitude
              // resp.coords.longitude
              console.log(resp);
              
              this.coords = resp.coords;
              resolve(resp.coords)

          }).catch((error) => {
              console.log('Error getting location', error);
              reject(error)
          });
      })
  }
}
