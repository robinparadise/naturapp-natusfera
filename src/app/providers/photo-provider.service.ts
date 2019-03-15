import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import {LoadingController} from '@ionic/angular';

class Photo {
    data: any;
}
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class PhotoProviderService {
    public photos: Photo[] = [];

    constructor(public http: HttpClient,
                private camera: Camera,
                private storage: Storage,
                // private filePath: FilePath,
                private loadingController: LoadingController) { }
    readonly options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };
    readonly optionsGalery : CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: PictureSourceType.PHOTOLIBRARY
    };
    takePicturePromise = ()=> this.camera.getPicture(this.options);
    selectPhotoPromise = ()=> this.camera.getPicture(this.optionsGalery);

    takePicture() {
        this.camera.getPicture(this.options).then(url => {
            this.photos.push({
                // data: 'data:image/jpeg;base64,' + imageData
                data: url
            });
            this.storage.set('photos', this.photos);
        }, (err) => {
            // Handle error
            console.log('Camera issue:' + err);
        });
    }

    async loadSaved() {
        this.loadingController.create({}).then((loader) => {
            loader.present();
            this.storage.get('photos').then((photos) => {
                this.photos = photos || [];
                loader.dismiss();
            });
        });
        return await true;
    }
    removePhotoIndex(n: number){
        this.photos.splice(n, 1);
        this.storage.set('photos', this.photos);
    }

    selectPhoto(): void {
        // const camera: any = navigator['camera'];
        this.camera.getPicture(this.optionsGalery).then( url => {
            console.log("load galery ", url);
            this.photos.push({
                data: url
            });
            this.storage.set('photos', this.photos);
        }, error => {
            console.log('Camera issue:' + error);
        });
    }
}
