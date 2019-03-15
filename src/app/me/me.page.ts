import {AfterViewInit, Component, OnInit, OnDestroy} from '@angular/core';
import {NatuClientService} from '../providers/natu-client.service';
import {AlertController, LoadingController, Platform, ToastController, Events, NavController} from '@ionic/angular';
import {ParamExpService} from '../providers/param-exp.service';
import {Router, ActivatedRoute} from '@angular/router';
import {Storage} from '@ionic/storage';
import {TranslateService} from '@ngx-translate/core';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit, AfterViewInit {

  localObservations = [];
  data: any;
  observations_count: number = 0
 
  constructor(public natuClient: NatuClientService,
              private params: ParamExpService,
              private alertController: AlertController,
              private router: Router,
              private translate: TranslateService,
              private loadingController: LoadingController,
              private toastController: ToastController,
              private storage: Storage,
              private platform: Platform,
              private route: ActivatedRoute,
              private events: Events,
              private navContrl:NavController
              ) {
                
  }
  user = this.natuClient.user;
  subRouterEvent:Subscription = null;
  
  ionViewWillEnter() {
    this.natuClient.changeUser
      .subscribe(user =>{
        this.user = user;
        this.natuClient.user = user;
        console.log(user);
        console.log('subb');
    })
  }
  async ngOnInit() {
    await this.platform.ready();
    this.loadUserObservations();
    this.loadUserData();
   
    this.events.subscribe('me:reload', () => {
      this.presentToastForReload();
      this.loadUserObservations();
    });
  }
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit....')
    if(this.params.reload ){
      this.params.reload = false;
      this.loadUserObservations();
    }
  }
  loadUserObservations(event = null){
    this.natuClient.getUserObservations().subscribe( d=> {
      this.data=d;
      if(event!=null)event.target.complete();
    });
  }

  loadUserData() {
    this.natuClient.getUserData(this.natuClient.user.id.toString())
    .subscribe((user: any) => {
      this.observations_count = user.observations_count || 0
    })
  }

  viewSavedItem(obj: any, index) {
    let item = obj.form;
    item.photos = obj.photos;
    obj.index=index;
    this.params.item = obj;
    this.router.navigate(['observe']);
  }
  viewItem(obj: any) {
    this.params.item = obj;
    this.router.navigate(['explore']);
  }

  async longPress($event, obj: any, index = -1) {
    console.log('Event pressed', obj, $event);
    $event.preventDefault();
    const alert = await this.alertController.create({
      header: this.translate.instant('DELETE'),
      message: this.translate.instant('OBSERVATION_DELETE'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay ', obj);
            if(index!==-1){
              this.deleteSaved(index);
            }else{
              this.deleteObs(obj);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToastForReload() {
    const message = this.translate.instant('DELETEDSUCCESS');
    const closeButtonText = this.translate.instant('RELOAD');
    const toast = await this.toastController.create({
      message,
      showCloseButton: true,
      position: 'top',
      closeButtonText
    });
    toast.present();
    await toast.onDidDismiss();
    // toast.dismiss((data?: any) => {
      // console.log('Dismissed toast');
    this.loadUserObservations()
    // });
  }

  doRefresh(event) {
    console.log('Log ', event);
    this.loadUserObservations(event);
  }

  private deleteSaved(index: number) {
    this.storage.get('obs').then((observations) => {
      let obs = observations || [];
      obs.splice(index, 1);
      this.storage.set('obs', obs).then( ()=>{
        this.loadUserObservations();
        this.toastShow('DELETED')
      });
    });
  }
  private async deleteObs(obs: any) {
    let loader = await this.loadingController.create({});
    loader.present();
    this.natuClient.deleteObservation(obs.id)
        .subscribe(()=>{
          this.loadUserObservations();
          loader.dismiss();
          this.toastShow('DELETED')
        });
  }
  private async toastShow(key: string) {
    const toast = await this.toastController.create({
      message: this.translate.instant(key),
      duration: 2000
    });
    toast.present();
  }
}
