import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {NatuClientService} from '../providers/natu-client.service';
import {UserLocationService} from '../providers/user-location.service';
import {Router} from '@angular/router';
import {ParamExpService} from '../providers/param-exp.service';
import {LoadingController, NavController} from '@ionic/angular';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.page.html',
  styleUrls: ['./guides.page.scss'],
})
export class GuidesPage implements OnInit {
  @ViewChild('inputEl') inputEl: ElementRef;
  public data: any;
  cache = {"join":[], "all":[],"near":[]};
  type: string = 'all';
  private coords: Coordinates;
  close: boolean
  square: boolean

  seacrhQuery$: Subject<string> = new Subject();
  page = 1;
  query = '';
  constructor(public natuClient: NatuClientService,
              private userLocation: UserLocationService,
              private loadingController: LoadingController,
              private params: ParamExpService,
              private router: Router,
              private navCtrl: NavController) { 
    this.seacrhQuery$.pipe(debounceTime(500),distinctUntilChanged())
    .subscribe((query)=>{
      this.page = 1;
      if (query == '') {
        this.cache['search'] = [];
        this.type = 'all';
      } else {
        this.query = query;
        this.natuClient.guidesSearch(query,this.page)
        .subscribe((res)=>{
          this.cache['search'] = [];
          this.cache['search'] = res;
          this.type = 'search';
        })
        this.natuClient.guidesSearch(query,this.page + 1)
        .subscribe((res)=>{
          this.cache['loadMore'] = [];
          this.cache['loadMore'] = res;
        })
      }

    })
  }

  loadMore(query){
    this.page++;
    let a= this.cache['search'].concat(this.cache['loadMore'])
    this.cache['search'] = a;
    this.natuClient.proyectosSearch(query,this.page + 1)
    .subscribe((res)=>{
      this.cache['loadMore'] = [];
      this.cache['loadMore'] = res;
    })
  }
  ngOnInit() {
    this.userLocation.getLocation().then(coords => this.coords = coords);

    this.loadGuides(null);
    if (this.natuClient.user != null) {
        this.natuClient.guidesJoined()
        .subscribe(d=>{
          this.cache['join']=d.map(p=>p.project);
          let listJoined = d.map( p=> p.project.id);
          this.natuClient.setJoinedGuideList(listJoined);
        });
    }
    
  }
  private async loadGuides(coords: Coordinates){
    let loading = await this.loadingController.create({spinner: 'crescent', duration: 2000});
    await loading.present();
    this.natuClient.guides(coords).subscribe(d=>{
      this.cache[this.type] = d;
      loading.dismiss();
    });
  }

  segmentChanged($event) {
    if (this.cache[this.type].length == 0 ) {
      if (this.type == 'near') this.natuClient.guidesLocation(this.coords).subscribe(d => this.cache[this.type] = d)
      if(this.type == 'join') this.natuClient.myGuides().subscribe(d=>this.cache[this.type]=d)
      if(this.type == 'all') this.natuClient.guides().subscribe(d=>this.cache[this.type]=d)
    }
  }

  select(obj: any) {
    this.params.item = obj;
    this.router.navigate(['guide-detail']);
    // this.navCtrl.navigateForward(['guide-detail']);
  }

  expand () {
    this.close = !this.close
    this.square = !this.square
    if (this.close) {
      this.inputEl.nativeElement.focus()
    } else {
      this.inputEl.nativeElement.blur()
    }
  }
}
