import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NatuClientService} from '../../providers/natu-client.service';
import {LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
declare var window:any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationsPage implements OnInit {

  data: any = '';
  constructor(private natuClient: NatuClientService,
              private loadingController: LoadingController,
              private router: Router
  ) { }

  async ngOnInit() {
    let loader = await this.loadingController.create({});
    loader.present();
    this.natuClient.updates()
        .subscribe((t: string)=>{
          t = t.replace('<ul>','');
          t = t.replace('<li>','');
          t = t.substring(0, t.lastIndexOf('</ul>'));
          loader.dismiss();
          let arr = t.split('</li>');
          // arr.splice(0, -1);
          this.data = arr;

        });
  }

  select(obj: any) {
    if(obj.resource_type == "Observation"){

    }
  }
}
