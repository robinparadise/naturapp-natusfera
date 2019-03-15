import { Component, OnInit } from '@angular/core';
import {NatuClientService} from '../../providers/natu-client.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login.page.scss', './register.component.scss']
})
export class RegisterComponent implements OnInit {
  register: any;
  submitted = false;
  userExists = false;

  constructor(public natusClient: NatuClientService,
              private loadingController: LoadingController,
              private router: Router) { }

  ngOnInit() {
  }

  async onRegister(registerForm: NgForm) {
    this.submitted = true;
    this.userExists = false;
    console.log('submit something ', registerForm, this.register);
    if (registerForm.valid) {
      let loading = await this.loadingController.create({spinner: 'crescent', duration: 2000});
      await loading.present();
      this.natusClient.register(registerForm.value)
          .subscribe( (obs:any) => {
                loading.dismiss();
                if (obs.errors) {
                  this.userExists = true;
                }else{
                  this.router.navigate(['/'], { replaceUrl: true });
                }
              },
              error => {
                loading.dismiss();
                console.log('Error user... ', error);
                this.userExists = true;
              });
    }
  }
}
