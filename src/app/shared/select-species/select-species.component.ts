import { Component, OnInit } from '@angular/core';
import {NatuClientService} from '../../providers/natu-client.service';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-select-species',
  templateUrl: './select-species.component.html',
  styleUrls: ['./select-species.component.scss']
})
export class SelectSpeciesComponent implements OnInit {
  private modal: HTMLIonModalElement;
  specie_guess: string;
  data: any;
  parentItem: any;

  constructor(private natuClient: NatuClientService, private modalCtrl: ModalController) { }

  async ngOnInit() {
    this.modal = await this.modalCtrl.getTop();

    if(this.specie_guess){
      this.natuClient.taxaSearch(this.specie_guess).subscribe(d => this.data=d);
    }else{
      this.natuClient.taxa().subscribe( d => this.data=d);
    }
  }

  close(){
    this.modalCtrl.dismiss();
  }
  search($event: Event) {
    const input: HTMLInputElement = $event.target as HTMLInputElement;
    console.log("search :",input.value);
    if (input.value.length < 4) return;
    this.natuClient.taxaSearch(input.value).subscribe(d => this.data=d);
  }
  select($event: Event, obj: any) {
    $event.stopPropagation();
    this.modal.dismiss(obj,'select-specie');
  }
}
