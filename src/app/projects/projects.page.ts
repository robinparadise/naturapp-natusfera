import { MePage } from './../me/me.page';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {NatuClientService} from '../providers/natu-client.service';
import {UserLocationService} from '../providers/user-location.service';
import {Router} from '@angular/router';
import {ParamExpService} from '../providers/param-exp.service';
import {LoadingController} from '@ionic/angular';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit {
  @ViewChild('inputEl') inputEl: ElementRef;
  cache = {"join":[], "featured":[],"near":[]};
  type: string = 'near';
  private coords: Coordinates;
  seacrhQuery$: Subject<string> = new Subject();
  page = 1;
  query = '';
  close: boolean
  square: boolean
  constructor(public natuClient: NatuClientService,
              private userLocation: UserLocationService,
              private params: ParamExpService,
              private loadingController: LoadingController,
              private router: Router
              ) {
    this.seacrhQuery$.pipe(debounceTime(500),distinctUntilChanged())
    .subscribe((query)=>{
      this.page = 1;
      if (query == '') {
      this.cache['search'] = [];
      this.type = 'near';
      } else {
      this.query = query;
      this.natuClient.proyectosSearch(query,this.page)
      .subscribe((res)=>{
        this.cache['search'] = [];
        this.cache['search'] = res;
        this.type = 'search';
      })
      this.natuClient.proyectosSearch(query,this.page + 1)
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

  async ngOnInit() {
    // let loading = await this.loadingController.create({spinner: 'crescent', duration: 2000});
    // await loading.present();
    this.userLocation.getLocation()
        .then( coords=> this.loadProjects(coords) )
        .catch(err => this.loadProjects(null));
        // .catch(err => this.natuClient.proyectos().subscribe(d=>{ this.cache[this.type] = d }))
    

    if (this.natuClient.user != null) {
      this.natuClient.proyectosJoined()
      .subscribe(d=>{
        this.cache['join']=d.map(p=>p.project);
        let listJoined = d.map( p=> p.project.id);
        this.natuClient.setJoinedList(listJoined);
        console.log("joineds ", listJoined);
        //save
      });
    }
  }
  private async loadProjects(coords: Coordinates){
    let loading = await this.loadingController.create({spinner: 'crescent', duration: 2000});
    await loading.present();
    this.natuClient.proyectosLocation(coords).subscribe(d=>{
      this.cache[this.type] = d;
      loading.dismiss();
    });
  }

  segmentChanged($event) {
    console.log("semgnet ", this.type)
    if(this.cache[this.type].length == 0 ){
      if(this.type == "featured") this.natuClient.proyectosFeatured().subscribe(d=>this.cache[this.type]=d)
      // if(this.type == "join") this.natuClient.proyectosFeatured().subscribe(d=>this.cache[this.type]=d)
    }
  }

  select(obj: any) {
    this.params.project = obj;
    this.router.navigate(['project-detail']);
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
