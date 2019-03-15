import { Component, OnInit } from '@angular/core';
import {ParamExpService} from '../../providers/param-exp.service';
import {NatuClientService} from '../../providers/natu-client.service';
import {Router} from '@angular/router';
import {LoadingController, NavController} from '@ionic/angular';



@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  item: any;
  data: any;
  isJoined: Boolean = false;
  auth:boolean = false;
  

  constructor(private params: ParamExpService,
              private natuClient: NatuClientService,
              private loadingController: LoadingController,
              private router: Router,
              private NavController:NavController
  ) {
    this.item = params.project;
    this.isJoined = natuClient.isJoined(this.item.id);
    this.auth = !natuClient.user ? false : true;
  }

  ngOnInit() {
    this.natuClient.getProjectObservations(this.item.cached_slug).subscribe(d => this.data = d);
    console.log(this.item);
  }

  select(obj: any) {
    this.params.item = obj;
    this.router.navigate(['explore']);
  }

  async toggleFollow() {
    let loader = await this.loadingController.create({});
    loader.present();
    if( ! this.isJoined)
      this.natuClient.joinProject(this.item.id).subscribe( resp => {
        // arr.push(this.item.id)
        // localStorage.setItem('join_project', arr);
        console.log("response ",resp);
        this.natuClient.addJoined(this.item.id);
        this.isJoined = true;
        loader.dismiss();
      });
    else
      this.natuClient.leaveProject(this.item.id).subscribe( resp => {
        console.log("response leave ",resp);
        this.natuClient.rmJoined(this.item.id);
        this.isJoined = false;
        loader.dismiss();
      });
  }

  addObservation() {
    this.params.item = {
      project_id: this.item.id,
      project_name: this.item.title,
    };
  }
}
