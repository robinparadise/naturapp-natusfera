import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {NatuClientService} from '../../providers/natu-client.service';

declare var window:any;

@Component({
  selector: 'app-choose-project',
  templateUrl: './choose-project.component.html',
  styleUrls: ['./choose-project.component.scss']
})
export class ChooseProjectComponent implements OnInit {
  private modal: HTMLIonModalElement;

  coords;
  data: any;

  constructor(private modalCtrl: ModalController, private natuClient: NatuClientService) { }

  async ngOnInit() {
    this.modal = await this.modalCtrl.getTop()

    // if(this.coords) this.natuClient.proyectosLocation(this.coords).subscribe(d=> this.load(d)) //.subscribe(this.load)
    // else this.natuClient.proyectos().subscribe(this.load)
    this.natuClient.proyectosJoined().subscribe(d=> this.load(d))
  }

  load(d:any){
    console.log("load more data ", d)
    window.proj = d
    this.data = d.map(p=>p.project)
    let listJoined = d.map( p=> p.project.id);
    this.natuClient.setJoinedList(listJoined);
  }

  close() {
     this.modal.dismiss()
  }

  select(obj: any) {
    this.modal.dismiss(obj,'project')
  }
}
