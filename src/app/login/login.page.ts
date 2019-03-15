import { Component, OnInit } from '@angular/core';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {NatuClientService} from '../providers/natu-client.service';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private googlePlus: GooglePlus,
              private natuClient: NatuClientService,
              private loadingController: LoadingController,
              private router: Router) { }

  ngOnInit() {
  }

  googleSignIn() {
    this.googlePlus.login({
      'scopes': '',
      'webClientId': '986340483876-2ltkrdhrbibc2klugvan3rn8j7t60l7e.apps.googleusercontent.com',
      'offline': true
    })
    .then(res =>{
      console.error(res.toString())
      this.natuClient.loginOauth(res.accessToken)
        .subscribe(response=>{
          this.router.navigate(['/'], { replaceUrl: true });
        })
    })
    .catch(err => {
      console.error(err.toString())
    });
  }

  //   var provider = new window.firebase.auth.GoogleAuthProvider();

  //   firebase.auth().signInWithPopup(provider).then((result) => {
  //     console.log({result})
  //     // This gives you a Google Access Token. You can use it to access the Google API.
  //     var token = result.credential.accessToken;
  //     // The signed-in user info.
  //     var user = result.user;
  //     // ...
  //     alert(result.credential.accessToken)
  //     this.natuClient.loginOauth(result.credential.accessToken)
  //       .subscribe(response => {
  //         this.router.navigate(['/'], { replaceUrl: true });
  //       })
  //   }).catch((error) => {
  //     console.log({error})
  //     // Handle Errors here.
  //     var errorCode = error.code;
  //     var errorMessage = error.message;
  //     // The email of the user's account used.
  //     var email = error.email;
  //     // The firebase.auth.AuthCredential type that was used.
  //     var credential = error.credential;
  //     // ...
  //   });
  // }

}
