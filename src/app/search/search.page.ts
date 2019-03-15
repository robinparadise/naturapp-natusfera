import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {NatuClientService} from '../providers/natu-client.service';
import {ParamExpService} from '../providers/param-exp.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  obs = [
    {tag : 0, name: 'Buscar observaciones cercanas'},
    {tag : 1, name: 'Buscar mis observaciones'},
  ]
  modal: HTMLIonModalElement;

  items = [];
  itemsUsers = [];
  itemsTaxa = [];
  itemsPlace = [];
  selector = 'taxo';

  cacheTaxa = [];

  constructor(private viewCtrl: ModalController,
              private router: Router,
              private params: ParamExpService,
              private natuClient: NatuClientService) { }

  async ngOnInit() {
    this.modal = await this.viewCtrl.getTop();

    this.natuClient.taxa().subscribe( resp => {
      this.itemsTaxa = resp;
      this.cacheTaxa = resp;
    });
  }

  search($event: Event) {
    console.log("search for ", $event)
    const input: HTMLInputElement = $event.target as HTMLInputElement;
    // if (input.value.length > 0) this.items = this.searchText;
    // else this.items = this.obs;
    if (input.value.length < 3){

      if(input.value.length <=1){
        this.itemsTaxa = this.cacheTaxa;
      }
      return;
    }
    // this.natuClient.observations(input.value).subscribe( resp => {
    //
    // });
    this.natuClient.taxaSearch(input.value).subscribe( resp=>{
      this.itemsTaxa = resp;
    });
    this.natuClient.userSearch(input.value).subscribe( resp => {
      this.itemsUsers = resp;
      console.log("resp ", resp);
    });
    this.natuClient.getPlaces(input.value).subscribe( resp => {
      this.itemsPlace = resp;
    });

  }

  cancel() {
    // dismiss()
  }

  async select(type: string, item: any) {
    console.log("search for item ", item)
    // this.viewCtrl.dismiss(item, "search", "204")
    this.modal.dismiss({item: item, type: type}, 'search');
  }

  segmentChanged($event) {

  }

  userProfile(event: Event, user) {
    event.stopPropagation();
    this.modal.dismiss();
    console.log("open user profile ", user);
    this.params.user = user;
    this.router.navigate(['/people']);
  }
}
