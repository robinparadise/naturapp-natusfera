import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {NatuClientService} from '../providers/natu-client.service';
import {ModalController, NavController, Platform} from '@ionic/angular';
import {Router, ActivatedRoute} from '@angular/router';
import {ParamExpService} from '../providers/param-exp.service';
import {GoogleMaps, GoogleMap, Marker, GoogleMapsEvent, LatLng, VisibleRegion} from '@ionic-native/google-maps/ngx';
import {UserLocationService} from '../providers/user-location.service';
import {ContactPage} from '../contact/contact.page';
import {SearchPage} from '../search/search.page';

enum LISTSTATE { GMAP = 0, GRID = 1, LIST = 2  }
declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  @ViewChild('mapCanvas') mapElement: ElementRef;
  data: any = [];
  loadedResults: any = [];
  dataWithoutLocation: any = [];
  dataMap: any = [];
  points: any = [];
  page = 1;
  state: LISTSTATE = 0;
  loadingText = 'Loading more data';
  private total: any;
  map: GoogleMap;
  private coords: any = {latitude:40,longitude:-3};
  searchMode = false;
  private modalSearch: HTMLIonModalElement;

  localRegion: VisibleRegion = null;
  searchElement: any = null;
  queryParams: any = null;

  mapEle: any
  mapJs: any
  marker: any

  constructor(public natuClient: NatuClientService,
              public router: Router,
              public params: ParamExpService,
              public userLocation: UserLocationService,
              private modalController: ModalController,
              private platform: Platform
              ) {}

  async ngOnInit() {
    this.loadData();
    await this.platform.ready();
    if (this.platform.is('cordova')) {
      await this.loadMap();
    } else {
      await this.loadMapJs();
    }
    this.userLocation.getLocation().then(coords => {
      this.coords = coords || this.coords;
      console.log('Coords ', coords);
      this.updatePosition();
        // this.natuClient.observationsPhoto(1, coords).subscribe(t => this.loadData(t))
      }
    );
  }

  async loadMap() {
    this.map = GoogleMaps.create('map_canvas', {});
    this.map.on(GoogleMapsEvent.CAMERA_MOVE_END)
    .subscribe(() => {
      if(this.state != 0 || (this.searchElement && this.searchElement.typeSearch !== 'taxa')) return;
      const reg = this.map.getVisibleRegion();
      console.log('Region move_end2', reg);
      this.loadData(reg);
      // this.natuClient.observationsPhoto(1, reg)//.toPromise().then((d)=>{this.loadDataMap(d.body)})
      //     .subscribe(d => this.loadData(d.body) );
      this.localRegion = reg;
    });
  }

  async loadMapJs() {
    this.mapEle = this.mapElement.nativeElement;
    this.mapJs = new google.maps.Map(this.mapEle, {
     center: {lat: 40, lng: -3},
     zoom: 8
   });
  }

  private updatePosition() {
    if (this.map) {
      const latlng = new LatLng(this.coords.latitude, this.coords.longitude);
      console.log(" posit ", latlng);
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
  private centerMap(item: any){
    const latlng = new LatLng(parseFloat(item.latitude), parseFloat(item.longitude) );
    console.log(latlng)
    this.map.animateCamera({
      target: latlng,
      zoom: 10,
      tilt: 30
    });
  }

  loadData(reg: VisibleRegion = null) {
    this.natuClient.observationsPhoto(this.page, reg, this.queryParams)
    .subscribe(t => {
      this.total = t.headers.get('X-Total-Entries'); //CORS ISSUE WITHOUT EXPOSED HEADER can't READ
      // this.total = t.headers.get("X-TOTAL-COUNT");
      console.log('Total ', this.total, t.headers.get('X-Total-Entries'), t.headers.get('X-Per-Page'));
      this.data = t.body;
      this.loadMarkersData(t.body);
      if( !this.searchElement)this.loadedResults = t.body;
    });
  }
  private loadMarkersData(data:any) {

    data.forEach( (d, n) => {
        if (d.latitude != null && d.longitude != null) {
            this.points.push( {position: {lat: d.latitude, lng: d.longitude}} );
            let iconSymbol :any = '';
            if( !d.iconic_taxon_name){
                iconSymbol = 'assets/img/marker_unknown.png';
            } else if(['Plantae'].indexOf(d.iconic_taxon_name) !== -1){
                iconSymbol = 'assets/img/marker_green.png';
            }else if(['Aves', 'Mammals', 'Animalia', 'Mammalia', 'Reptilia', 'Actinopterygii'].indexOf(d.iconic_taxon_name) !== -1){
                iconSymbol = 'assets/img/marker_blue.png';
            }else if(['Insecta', 'Mollusca', 'Arachnida'].indexOf(d.iconic_taxon_name) !== -1){
                iconSymbol = 'assets/img/marker_red.png';
            }else if(['Fungus','Fungi'].indexOf(d.iconic_taxon_name) !== -1){
                iconSymbol = 'assets/img/marker_pink.png';
            }else if(['Protozoa'].indexOf(d.iconic_taxon_name) !== -1){
                iconSymbol = 'assets/img/marker_purple.png';
            }else if(['Chromista'].indexOf(d.iconic_taxon_name) !== -1){
                iconSymbol = 'assets/img/marker_brown.png';
            }
            const marker: Marker = this.map.addMarkerSync( {position: {lat: d.latitude, lng: d.longitude},
                item_id: d.id,
                item_n: n,
                icon: iconSymbol
            });
            marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe( (params) => this.onMarkerClick(params));
        }
    });
  }
  changeView(i: LISTSTATE) {
    if (this.data.length == 0 ) {
      return;
    }
    this.state = i;
  }

  loadMoreData(e: any) {
    if(this.localRegion || this.searchElement) return;
    this.page++;
    this.natuClient.observationsPhoto(this.page)
    .subscribe( t => {
      e.target.complete();
      console.log('load more data ', this.page, t,  t.headers.get('X-Total-Entries'),
                  t.headers.get('x-total-entries'), t.headers['x-total-entries']);
      this.data = this.data.concat(t.body);
    });
  }
  select(item: any) {
    this.params.item = item;
    this.router.navigate(['explore']);
  }

  onMarkerClick(params: any) {
    const marker: Marker = <Marker>params[1];
    const item = this.data[ marker.get('item_n') ];
    console.log('item marker ', item);
    this.select(item);
  }
  onMarkerClickMap(params: any) {
    const marker: Marker = <Marker>params[1];
    const item = this.dataMap[ marker.get('item_n') ];
    console.log('item marker ', item);
    this.select(item);
  }
  async toggleSearch(){
    if(this.searchMode){
      this.modalSearch.dismiss();
    }else{
      this.searchView();
    }
  }

  async searchView() {
    this.modalSearch = await this.modalController.create({
      component: SearchPage,
      backdropDismiss: true,
      componentProps: { value: 123 },
      cssClass: 'top-margin',
      id: 'search'
    });
    this.modalSearch.onDidDismiss().then( (d) => {
      console.log('dismiss ', d);
      this.searchMode = false;
      if(d.data){
        if(d.data.type == 'users'){
          this.searchElement = d.data.item;
          this.filterByUser(d.data.item);
        }
        if(d.data.type == 'taxa'){
          this.searchElement = d.data.item;
          this.searchElement.typeSearch = 'taxa';
          this.filterByTaxa(d.data.item);
        }
        if(d.data.type == 'place'){
          this.searchElement = d.data.item;
              //center map
              this.centerMap(this.searchElement);
            }
          }
        });
    this.searchMode = true;
    return await this.modalSearch.present();
  }

  async removeLocation() {
    this.data = this.loadedResults;
    if(this.searchElement){
      this.map.clear();
      this.searchElement = null;
      this.loadMarkersData(this.data);
      console.log("clear searchmode ", this.searchMode);
      return;
    }
    console.log("clear location ", this.localRegion, this.searchMode);
    this.localRegion = null;
    this.page=1;
    this.loadData();
  }

  filterByUser(user: any) {
    //save data in local
    this.loadedResults = this.data;
    this.map.clear();
    this.natuClient.observationFilter(user).subscribe( t=>{
      this.data = t;
      if(this.data.length > 0) {
        this.loadMarkersData(t);
        setTimeout(()=>{
          this.centerMap(t[0]);
        },2500);
      }
    });
  }
  filterByTaxa(taxa: any) {
    this.loadedResults = this.data;
    this.queryParams = {taxon_id: taxa.id};
    this.map.clear();
    this.loadData(this.localRegion)
  }

  private pinSymbol(color) {
    return {
      path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#000',
      strokeWeight: 2,
      scale: 1,
    };
  }

}
