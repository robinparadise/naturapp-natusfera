import { NatuClientService } from './../../providers/natu-client.service';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';

import {TranslateService} from '@ngx-translate/core';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  language = 'default';
  app:{version:string} ={version:null};
  ac = !localStorage.getItem('Autocomplete') || localStorage.getItem('Autocomplete') === 'true' ? true : false; 
  la = !localStorage.getItem('Autocomplete') || localStorage.getItem('Autocomplete') === 'true' ? true : false; 
  constructor(private router: Router,
              public natuClient: NatuClientService,
              private translate: TranslateService,
              private appVersion: AppVersion,
              private emailComposer: EmailComposer
  ) { }

  ngOnInit() {
    this.language = localStorage.getItem('lang') || 'default';
    this.getVersion();
  }

  contact(){
     let email = {
       to: 'Info@naturapp.org',
       subject: 'naturapp support team.',
       body: '',
       isHtml: true
     }
     
     // Send a text message using default options
     this.emailComposer.open(email);
  }
 


  async getVersion(){
    this.app.version =await this.appVersion.getVersionNumber();
  }

  signout() {                 
    this.natuClient.rmUser()
    this.router.navigate(['login'], { replaceUrl: true });
  }

  close() {
    this.router.navigateByUrl('/tabs/me');
  }

  setAutocoplete(){
    let ac = localStorage.getItem('Autocomplete');
    if(ac){
      if (ac == 'false') {
        localStorage.setItem('Autocomplete','true');
        this.ac= true;
      } else {
        localStorage.setItem('Autocomplete','false');
        this.ac= false;
      }
    }else{
      localStorage.setItem('Autocomplete','false');
      this.ac = false;
    }
  }
  languageSet() {
    if(this.language=='default'){
      localStorage.removeItem('lang');
    }else{
      localStorage.setItem('lang',this.language);
      this.translate.use(this.language);
    }
  }
}
