import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {HomePage} from './home/home.page';
import {ExploreDetailPage} from './home/explore-detail/explore-detail-page.component';
import {AboutPage} from './about/about.page';
import {Environment} from '@ionic-native/google-maps';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {TranslateService} from '@ngx-translate/core';
// import {ImageLoader} from 'ionic-image-loader';
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private keyboard: Keyboard,
    private translate: TranslateService,
    private router: Router
    // private imageLoaderConfig: ImageLoaderConfigService
  ) {
    this.initializeApp();

    // imageLoaderConfig.fallbackUrl = 'assets/img/default.png'
      // imageLoaderConfig.fal
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initializeApp() {
    this.initTranslate();
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#ffffff');

      // set status bar to white
      this.splashScreen.hide();

      Environment.setEnv({
        // api key for server
        'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyBT1_SyBMMdaQnCUMfphdps1HVlrcStqYc',
        // api key for local development
        'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyBT1_SyBMMdaQnCUMfphdps1HVlrcStqYc'
      }); 

      this.keyboard.onKeyboardShow().subscribe(() => {
        document.body.classList.add('keyboard-is-open');
      });
      this.keyboard.onKeyboardHide().subscribe(() => {
        document.body.classList.remove('keyboard-is-open');
      });
      this.router.navigate(['/me'])
    });
  }

  initTranslate(){
      this.translate.setDefaultLang('en');
      let lang = localStorage.getItem('lang') || '';
      if(lang!=''){
          this.translate.use(lang);
          return;
      }
      if (this.translate.getBrowserLang() !== undefined){
          this.translate.use(this.translate.getBrowserLang());
      }else{
          this.translate.use('en'); // Set your language here
      }
  }
}
