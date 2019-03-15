import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-photo-viewer-zoom',
  templateUrl: './photo-viewer-zoom.page.html',
  styleUrls: ['./photo-viewer-zoom.page.scss'],
})
export class PhotoViewerZoomPage implements OnInit {

  modal: HTMLIonModalElement;
  slideOpts = {
    effect: 'flip'
  };
  images: [];

  constructor(private modalCtrl: ModalController) { }

  async ngOnInit() {
    this.modal = await this.modalCtrl.getTop();
  }
  async close(){this.modal.dismiss(); }

}
