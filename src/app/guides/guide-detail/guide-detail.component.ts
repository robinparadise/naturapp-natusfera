import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import {ParamExpService} from '../../providers/param-exp.service';
import {LoadingController, NavController} from '@ionic/angular';
import {NatuClientService} from '../../providers/natu-client.service';
import {Router} from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-guide-detail',
  templateUrl: './guide-detail.component.html',
  styleUrls: ['./guide-detail.component.scss']
})
export class GuideDetailComponent implements OnInit {
  item: any;
  data: Array<any>;
  isJoined: Boolean = false;
  
  filter = [];
  query$:Subject<string> = new Subject();
  constructor(private params: ParamExpService,
              private navCtrl: NavController,
              private loadingController: LoadingController,
              private router: Router,
              private natuClient: NatuClientService
  ) {
    this.item = params.item;
  }

  ngOnInit() {
    // @ts-ignore
    this.natuClient.getGuideTaxa(this.item.id).subscribe( d => {this.data = d.guide_taxa; this.filter = this.data;});

    this.query$.pipe(debounceTime(400),distinctUntilChanged())
    .subscribe((query)=>{
      if (query == '') {
        this.filter = this.data;
      }else{
        this.filter = this.data.filter(obs => {
          return obs.name.toLocaleLowerCase().indexOf(query) != -1 ;
        })
      }
    })
  }


  async toggleFollow() {
    let loader = await this.loadingController.create({});
    loader.present();
    if( !this.isJoined)
      this.natuClient.joinGuide(this.item.id).subscribe( resp => {
        this.natuClient.addJoinedGuide(this.item.id);
        this.isJoined = true;
        loader.dismiss();
      },(err)=>{
        console.log(err);
        
        loader.dismiss();
      });
    else
      this.natuClient.joinGuide(this.item.id, false).subscribe( resp => {
        console.log("response leave ",resp);
        this.natuClient.rmJoined(this.item.id);
        this.isJoined = false;
        loader.dismiss();
      });
  }

  addObservation($event: Event, obj: any) {
    this.params.item = {specie_guess: obj.name, taxon: obj.taxon, type: 'guide'};
    this.router.navigate(['observe'])
  }
}
