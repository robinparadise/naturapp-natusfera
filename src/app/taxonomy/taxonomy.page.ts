import { Component, OnInit } from '@angular/core';
import {NatuClientService} from '../providers/natu-client.service';
import {ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {ChooseProjectComponent} from '../observe/choose-project/choose-project.component';

@Component({
  selector: 'app-taxonomy',
  templateUrl: './taxonomy.page.html',
  styleUrls: ['./taxonomy.page.scss'],
})
export class TaxonomyPage implements OnInit {

  data: any;
  private modal: HTMLIonModalElement;
  parentItem: any;

  parentLoadItems = [];

  constructor(private modalCtrl: ModalController,
              private natuClient: NatuClientService,
              private router: Router
  ) { }

  async ngOnInit() {
    this.natuClient.taxa().subscribe( d => this.data = d)
    this.modal = await this.modalCtrl.getTop();
  }

  close() {
    this.modal.dismiss();
  }
  // async viewSubChild(obj: any) {
  //   const modal = await this.modalCtrl.create({
  //     component: ChooseProjectComponent,
  //     backdropDismiss: true,
  //     componentProps: { parent: obj },
  //     cssClass: 'select-modal',
  //     id: 'subchild'
  //   });
  //   modal.onDidDismiss().then( (d) =>{
  //     console.log('dismiss addProject ', d)
  //   })
  //
  //   return await modal.present();
  // }
  viewSubChild(obj: any) {
    // this.modal.router
    // this.router.navigate(['taxonomyDetails']);
    this.parentItem = obj;
    this.parentLoadItems.push( this.data );
    this.data = [];
    this.natuClient.taxa({id: obj.id}).subscribe( d => this.data = d );
  }
  select($event: Event, obj: any) {
    $event.stopPropagation();
    this.modal.dismiss(obj, 'taxo');
  }
  goParentBack() {
    this.data = this.parentLoadItems.pop();
    this.parentItem = null;
  }
}
