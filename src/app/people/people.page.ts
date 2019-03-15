import { Component, OnInit } from '@angular/core';
import {ParamExpService} from '../providers/param-exp.service';
import {NatuClientService} from '../providers/natu-client.service';
import {Router} from '@angular/router';
declare var window:any;
@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: [ '../me/me.page.scss','./people.page.scss'],
})
export class PeoplePage implements OnInit {

  user: any;
  data: any;

  constructor(
      private natuClient: NatuClientService,
      private params: ParamExpService,
      private router: Router
  ) {
    this.user = params.user;
    if(this.user == null){
      this.router.navigate(['tabs','home']);
    }
window.people=this.user;
  }

  ngOnInit() {
    this.natuClient.observationFilter(this.user)
        .subscribe(t=> this.data=t)
  }

  back() {
    // this.router.navigated
  }

  viewItem(obj: any) {
    this.params.item = null;
    this.params.item = obj;
    this.router.navigate(['/explore/sub'],{queryParams: {id: obj.id}});
  }
}
