import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {NatuClientService} from '../../providers/natu-client.service';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: [ '../login.page.scss', './signin.component.scss']
})
export class SigninComponent implements OnInit {
    login: any;
    submitted = false;
    loginError = false;
    restartPass = false;
  constructor(public natusClient: NatuClientService,
              private loadingController: LoadingController,
              private router: Router,
              private iab: InAppBrowser,
              public alertController: AlertController
              ) { }

  ngOnInit() {
  }
  onRestartPass(){
    const browser = this.iab.create('https://natusfera.gbif.es/forgot_password.mobile','_self',{zoom:'no',hideurlbar:'yes',hidenavigationbuttons:'yes'});
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error de autenticación',
      message: 'Credenciales inválidas',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  async onLogin(loginForm: NgForm) {
    this.submitted = true;
    this.loginError = false;
      if (loginForm.valid) {
        let loading = await this.loadingController.create({spinner: 'crescent', duration: 2000});
        await loading.present();
        this.natusClient.loginEmail(loginForm.value)
            .subscribe( obs => {
              loading.dismiss();
              this.router.navigate(['/'], { replaceUrl: true });
            }, error => {
              loading.dismiss();
              this.presentAlert();
              this.loginError = true;
            });
      }else{
        this.presentAlert();
      }
  }
}
