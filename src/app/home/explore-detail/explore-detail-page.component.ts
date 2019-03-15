import {AfterViewInit, Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {LoadingController, ModalController, Platform, NavController, Events} from '@ionic/angular';
import {ParamExpService} from '../../providers/param-exp.service';
import {GoogleMap, GoogleMaps} from '@ionic-native/google-maps/ngx';
import {NatuClientService} from '../../providers/natu-client.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {SelectSpeciesComponent} from '../../shared/select-species/select-species.component';
import {PhotoViewerZoomPage} from '../../shared/photo-viewer-zoom/photo-viewer-zoom.page';

declare var window:any;
declare var google:any;
@Component({
  selector: 'app-explore-detail',
  templateUrl: './explore-detail-page.component.html',
  styleUrls: ['./explore-detail-page.component.scss'],
})
export class ExploreDetailPage implements OnInit, AfterViewInit {
  @ViewChild('mapCanvas') mapElement: ElementRef;
  item: any;
  slideOpts = {
    effect: 'flip'
  };
  map: GoogleMap;
  private itemMore: any;
  taxo: any;
  private message: any = { body: '', taxo: null};

  editable = false;
  formText = 'Añadir mensaje';
  formMessage = true;

  mapEle: any
  mapJs: any
  marker: any;

  constructor(private params: ParamExpService,
              private natuClient: NatuClientService,
              private router: Router,
              private loadingController: LoadingController,
              rout: ActivatedRoute,
              private modalController: ModalController,
              private platform: Platform,
              private navCtrl: NavController,
              private events: Events
              )
  {
      // this.router.routeReuseStrategy.shouldReuseRoute = ()=> {return false}
      // rout.params.forEach(params => {
      // //     myInit(params['paramId']);
      //     console.log("router change ");
      //     this.ngOnInit();
      // });
    }


    async ngAfterViewInit() {
    }
    async ngOnInit(){

      this.item = this.params.item;
      if(this.params.item == null){
        this.navCtrl.navigateBack('/tabs/me');
        return;
      }
      window.item = this.item;
      await this.platform.ready();
      if (this.item.latitude != null ) {
        await this.loadMap();
      }
      this.natuClient.getObservationID(this.item.id).subscribe(d=> {
        this.itemMore = d;
      });
      //show editable
      this.editable = this.item.user_login == this.natuClient.user.name;
    }

    private loadMap() {

      if (this.platform.is('cordova')) {
        const element: HTMLElement = document.getElementById('map_canvas2');
        const pos = {
          lat: this.item.latitude,
          lng: this.item.longitude
        };
        this.map = GoogleMaps.create('map_canvas2',{
          camera: {
            target: pos,
            zoom: 14,
            tilt: 30
          }
        });
        this.map.addMarkerSync( { position: pos } )
      } else {
        this.loadMapJs()
      }
   // this.map = GoogleMaps.create('map_canvas');
 }

 isOwner () {
  if (this.item && this.natuClient.user)
    return this.item.user_id == this.natuClient.user.id
  else return false
}

async loadMapJs() {
  const myLatLng = {lat: Number(this.item.latitude), lng: Number(this.item.longitude)};
  this.mapEle = this.mapElement.nativeElement;
  this.mapJs = new google.maps.Map(this.mapEle, {
    center: myLatLng,
    zoom: 6
  });

  this.marker = new google.maps.Marker({
    position: myLatLng,
    map: this.mapJs,
    title: 'my location'
  });
}

goTaxonomy(iconic_taxon: any) {
}

async selectTaxo() {
  const modal = await this.modalController.create({
    component: SelectSpeciesComponent,
    backdropDismiss: true,
    cssClass: 'select-modal',
    id: 'taxo'
  });
  modal.onDidDismiss().then( (d)=> {
    console.log("dismiss addTaxo ", d)
    if(d){
      console.log("addTaxo ", d);
      if(d.data.name){
        this.message.taxo = d.data.name;
            // this.observe.specie_guess = d
            this.taxo = d.data;
            this.formText = 'Añadir identificación';
            this.formMessage = false;
          }
        }
      });
  return await modal.present();
}
removeTaxo($event: Event, form: NgForm){
  $event.stopPropagation();
  this.taxo = null;
  this.message.taxo = null;
  this.formText = 'Añadir mensaje';
  this.formMessage = true;
  form.reset('taxo');
  console.log("remove taxo ")
}
async sendMessage(form: NgForm) {
  console.log("form msg", form, this.taxo);
  let loader = await this.loadingController.create({});
  loader.present();
  if(this.taxo){
    console.log("send taxo identifications")
    const bodyPost = { body: this.message.body, taxo: this.taxo.id };
    this.natuClient.postIdentification(this.item.id, bodyPost)
    .subscribe( resp =>{
      console.log("response ", resp)
      this.item.identifications_count++;
      this.itemMore = this.itemMore || {}
      this.itemMore.identifications = this.itemMore.identifications || []
      this.itemMore.identifications.push( {
        user: {
          user_icon_url: this.natuClient.user.picture,
          login: this.natuClient.user.name,
        },
        taxon: {
          name: this.taxo.name
        },
        body: bodyPost.body,
        created_at: new Date().toISOString()
      });
      form.reset();
      loader.dismiss();
    });
  }else{
    this.natuClient.postCommentObservation(this.item.id, form.value)
    .subscribe( resp => {
      console.log("response ", resp)
      this.itemMore = this.itemMore || {}
      this.itemMore.comments = this.itemMore.comments || []

      this.itemMore.comments.push( {
        user: {
          user_icon_url: this.natuClient.user.picture,
          login: this.natuClient.user.name,
        },
        body: form.value.msg,
        created_at: new Date().toISOString()
      });
      form.reset();
      loader.dismiss();
    });
    console.log("send normal msg")
  }
}

edit() {
    // this.params.item = this.itemMore
    this.router.navigate(['observe'])
  }

  async showImage() {
    const modal = await this.modalController.create({
      component: PhotoViewerZoomPage,
      backdropDismiss: true,
      componentProps: { images: this.item.photos },
      cssClass: 'select-modal',
      id: 'photo-zoom'
    });
    return await modal.present();
  }

  userProfile(some: any) {
    if(this.editable){
      this.router.navigate(['/tabs/me']);
      return
    }
    this.natuClient.getUser(this.item.user_login)
    .subscribe( obj=>{
      console.log("obj user downl", obj)
      this.params.user = obj;
      setTimeout( ()=>{
        this.router.navigate(['/people']);
      },500);
    });
  }

  delete () {
    this.natuClient.deleteObservation(this.item.id)
    .subscribe(() => {
      this.navCtrl.navigateBack('/tabs/me');
      this.events.publish('me:reload');
    }, () => {
      this.navCtrl.navigateBack('/tabs/me');
      this.events.publish('me:reload');
    })
  }
}
