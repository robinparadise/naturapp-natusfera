import {Component, NgZone, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ActionSheetController, AlertController, LoadingController, ModalController, NavController, ToastController} from '@ionic/angular';
import {ChooseProjectComponent} from './choose-project/choose-project.component';
import {UserLocationService} from '../providers/user-location.service';
import {PhotoProviderService} from '../providers/photo-provider.service';
import {NgForm} from '@angular/forms';
import {ParamsObserverService} from '../providers/params-observer.service';
import {NatuClientService} from '../providers/natu-client.service';
import {SelectSpeciesComponent} from '../shared/select-species/select-species.component';
import {ParamExpService} from '../providers/param-exp.service';
import {Storage} from '@ionic/storage';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-observe',
  templateUrl: './observe.page.html',
  styleUrls: ['./observe.page.scss'],
})
export class ObservePage implements OnInit {
    ac = localStorage.getItem('Autocomplete') || 'true'; 
    imageScroll: HTMLElement;
    help_me: any;
    captive: any;
    dateNow = new Date().toISOString();
    photosUpload = [];

    observe:any;
    private coords: Coordinates;
    select_position: { latitude: any; longitude: any; };

    project: any;
    taxo: any;

    editMode = false;
    photosEdit = [];
    obsEdit: any;
    obsSaved: any = null;

  constructor(private router: Router,
              private nav : NavController,
              private natuClient: NatuClientService,
              private params: ParamsObserverService,
              private edit: ParamExpService,
              private userLocation: UserLocationService,
              public photoService: PhotoProviderService,
              private modalController: ModalController,
              private actionSheetController: ActionSheetController,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private toastController: ToastController,
              private translate: TranslateService,
              private storage: Storage,
              private ngZone: NgZone
  ) {
      // translate.use(constants.DEFAULT_LANG);
      if(edit.item){
          this.editMode = true;
          const obsEdit = edit.item;

          if(obsEdit.type == 'guide'){
              this.observe = {
                  specie_guess: obsEdit.specie_guess
              };
              this.taxo = obsEdit.taxon;
              return;
          }
          if(obsEdit.type == 'project'){
              this.observe = {
                  specie_guess: obsEdit.specie_guess
              };
              this.taxo = obsEdit.taxon;
              this.project = obsEdit.project;
              return;
          }

          this.ngZone.run(()=> {
              if(obsEdit.form == null){

                  this.observe = {
                      help_me: obsEdit.id_please,
                      captive: obsEdit.captive,
                      images: obsEdit.photos,
                      description: obsEdit.description,
                      taxo: obsEdit.iconic_taxon_name, // != null ? obsEdit.ionic_taxon_name : null,
                      specie_guess: obsEdit.iconic_taxon_name,
                      date: obsEdit.created_at,
                      geo_privacy: obsEdit.geoprivacy,
                  };
                  this.photosEdit = obsEdit.photos;
                  this.taxo = obsEdit.taxon;
                  this.obsEdit = obsEdit;
              }else{ //saved item
                  this.observe = {
                      help_me: obsEdit.form.help_me,
                      captive: obsEdit.form.captive,
                      description: obsEdit.form.description,
                      taxo: obsEdit.form.species_guess,
                      specie_guess: obsEdit.form.species_guess,
                      date: obsEdit.form.date,
                      geo_privacy: obsEdit.form.geoprivacy,
                  };
                  this.select_position = obsEdit.position;
                  this.project = obsEdit.project;
                  this.photosUpload = obsEdit.photos;
                  this.taxo = obsEdit.taxo;
                  this.obsSaved = obsEdit;
              }
              });
      } else this.initObserve()
  }

  ngOnInit() {
    this.imageScroll = document.getElementById('scroll-images');
    this.userLocation.getLocation().then( coords=> {
      this.select_position = coords
      this.coords = coords
    });
      this.params.publish = (item) => {
          if(item.type == "position") {
            this.ngZone.run(() => {
              this.select_position = {
                latitude: item.coords.latitude.toFixed(2),
                longitude: item.coords.longitude.toFixed(2)
              };
              console.log(this.select_position)
            })
          }
      }
  }

  async addTaxo() {
      const modal = await this.modalController.create({
          component: SelectSpeciesComponent,
          backdropDismiss: true,
          componentProps: { specie_guess: this.observe.specie_guess},
          cssClass: 'select-modal',
          id: 'taxo'
      });
      modal.onDidDismiss().then( (d) => {
          console.log("dismiss addTaxo ", d)
          if (d.data) {
            this.observe.specie_guess = d.data.name;
            this.taxo = d.data;
          }
      })

      return await modal.present();
  }
  async addProject() {
    const modal = await this.modalController.create({
        component: ChooseProjectComponent,
        backdropDismiss: true,
        componentProps: { coords: this.coords },
        cssClass: 'select-modal',
        id: 'search'
    });
    modal.onDidDismiss().then( (d) =>{
        console.log('dismiss addProject ', d)
        this.project = d.data;
    })

    return await modal.present();
  }

  private initObserve() {
    this.observe = {
        help_me : false,
        captive: false,
        images : [],
        notes: null,
        taxo: null,
        geoprivacy: 'open',
        date: new Date().toISOString(),
        geo_privacy: false,
    }
  }

    removeProject($event: MouseEvent) {
        this.project = null;
        $event.stopPropagation();
    }
    removeTaxo($event: MouseEvent) {
        this.taxo = null;
        this.observe.specie_guess = '';
        $event.stopPropagation();
    }
    changeOrder() {
        console.log("change ")
    }

    async presentSelectSourceImage() {
        const actionSheet = await this.actionSheetController.create({
            buttons: [{
                text: this.translate.instant('CAMERA'),
                icon: 'camera',
                handler: () => {
                    this.photoService.takePicturePromise().then( (photo)=>{
                        console.log('FOTO',photo);
                            this.photosUpload.push(photo);
                        });
                }
            }, {
                text: this.translate.instant('GALLERY'),
                icon: 'image',
                handler: () => {
                    this.photoService.selectPhotoPromise().then( (photo)=>{
                        this.photosUpload.push(photo);
                    });
                }
            }]
        });
        await actionSheet.present();
    }
    removeSelectedPosition($event: MouseEvent) {
        $event.stopPropagation();
        this.select_position = null;
    }
    changePosition() {
        this.router.navigate(['/position/select'])
    }

    checkLoginAndSubmit(observeForm: NgForm){
        if (this.natuClient.user) {
            this.submitObservation(observeForm);
        }else{
            this.router.navigate(['/login']);
        }
    }

    async submitObservation(observeForm: NgForm) {
        console.log('submit form ', observeForm, observeForm.value);
        const v = observeForm.value;
        if (!observeForm.valid) return;
        const body: any = {
            species_guess: v.species_guess,
            id_please: v.help_me ? 1 : 0,
            observed_on_string: v.date,
            time_zone: 'Madrid', // save in user
            description: v.description
        };
        if(this.taxo){
            body.taxon_id = this.taxo.id;
        }
        if (this.select_position || this.coords) {
            const coords = this.select_position || this.coords;
            body.latitude = coords.latitude;
            body.longitude = coords.longitude;
        }
        console.log('form valid', body);
        let loader = await this.loadingController.create({});
            loader.present();
            if (this.editMode && this.obsEdit) {
                // loader.dismiss();
                const promises = [];
                if (this.project) {
                    //add to project
                    this.natuClient.putObservationProject(this.obsEdit.id, this.project.id)
                        .subscribe((res)=>console.log("Added to project",res));
                }
                this.natuClient.updateObservation(this.obsEdit.id, body)
                    .subscribe(()=>{
                        if(this.photosUpload.length==0){
                            loader.dismiss();
                            //ok updated
                            this.finishUpload(observeForm);
                        }
                    });
                if(this.photosUpload.length>0) promises.push( this.uploadPhotos(this.obsEdit.id));
                    Promise.all(promises).then(resp => {
                            console.log("updated ", resp);
                            loader.dismiss();
                            //ok updated
                            // history.back()
                            this.finishUpload(observeForm);
                    });

            } else {
                this.natuClient.postObservation(body)
                    .subscribe(resp => {
                        console.log('resp observation post', resp);
                        // check send adding project...
                        if (resp[0]) {
                            const id = resp[0].id;
                            if (this.project) {
                                //add to project
                                this.natuClient.putObservationProject(id, this.project.id)
                                    .subscribe((res)=>console.log("Added to project",res));
                            }
                            if (this.photosUpload.length > 0) {
                                console.log('Add images to id ', id, this.photosUpload);
                                const promises = [];
                                this.photosUpload.forEach(photo => {
                                    promises.push(this.natuClient.postObservationPhoto(id, photo));
                                });
                                Promise.all(promises)
                                    .then(finish => {
                                        console.log('finish ', finish);
                                        //finish
                                        loader.dismiss();
                                        this.finishUpload(observeForm);
                                    });
                                return;
                            }

                            //correct clean the form
                            this.finishUpload(observeForm);
                            loader.dismiss();
                            return;
                        }

                        // });
                    });
            }
        // ));

    }
    uploadPhotos(id){
        console.log('Add images to id ', id, this.photosUpload);
        const promises = [];
        this.photosUpload.forEach(photo => {
            promises.push(this.natuClient.postObservationPhoto(id, photo));
        });
        return promises;
    }
    finishUpload(observeForm: NgForm){
        //uploaded id, show new detail
        this.resetForm(observeForm)
        this.edit.reload = true;
        this.router.navigate(['me']);
    }

    async showDeleteImage(index: any, photo = null) {
            const alert = await this.alertController.create({
                header: this.translate.instant('DELETE'),
                message: this.translate.instant('DELETE_ASK_IMAGE'),
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary'
                    }, {
                        text: 'Ok',
                        handler: () => {
                            console.log('Confirm Okay');
                            if(photo == null) {
                                this.photosUpload.splice(index, 1)
                            }else{
                                this.deleteImage(photo, index);
                            }
                        }
                    }
                ]
        });

        await alert.present();
    }
    private async deleteImage(photo, index){
        let loading = await this.loadingController.create({});
        loading.present();
        this.natuClient.deleteObservationPhoto(photo.id)
            .subscribe( ()=>{
                this.photosEdit.splice(index, 1)
                loading.dismiss();
            })
    }

    swipePhotosRight($event) {
        this.imageScroll.scrollLeft -= $event.deltaX;
    }

    async save(observeForm: NgForm) {
      console.log("saved ", observeForm.value)
        let loader = await this.loadingController.create({});
            loader.present();
            this.storage.get('obs').then((observations) => {
                let obs = observations || [];
                if(this.obsSaved){
                 obs.splice(this.obsSaved.index, 1);
                }
                obs.push({
                    photos: this.photosUpload,
                    form: observeForm.value,
                    position: this.select_position?this.select_position:this.coords,
                    taxo: this.taxo,
                    project: this.project
                });
                this.storage.set('obs', obs).then( ()=>{
                    loader.dismiss();
                    this.toastSaved();
                    this.resetForm(observeForm);
                });
            });
    }

    private async toastSaved() {
        const toast = await this.toastController.create({
            message: this.translate.instant('SAVED'),
            duration: 2000
        });
        toast.present();
    }

    private resetForm(observeForm: NgForm) {
        observeForm.reset();
        this.project = null;
        this.select_position = null;
        this.taxo = null;
    }
}
