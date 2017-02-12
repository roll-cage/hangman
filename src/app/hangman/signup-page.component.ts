import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators,FormControl } from '@angular/forms';
import { AuthService } from './auth.service';
import { OverviewPageComponent } from './overview-page.component';
import {UsernamesService} from "./usernames.service";



@Component({
  selector: 'signup-page',
  templateUrl: 'signup-page.component.html'
})
export class SignupPageComponent {
  public signupForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;
  static usernamesService:UsernamesService;


  constructor(public nav: NavController, public authData: AuthService, public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController, public alertCtrl: AlertController, public usernamesService:UsernamesService) {
    SignupPageComponent.usernamesService=this.usernamesService;
    this.signupForm = formBuilder.group({
      'email': ['', [Validators.required, this.emailValidator.bind(this)]],
      'password': ['', Validators.compose([Validators.minLength(6), Validators.required])],
      'name': ['', [Validators.compose([Validators.required, Validators.minLength(4)]), this.nameValidator.bind(this)],/*SignupPageComponent.checkUsername*/]
    })
  }

  nameValidator(control: FormControl): {[s: string]: boolean} {
    if (!control.value.match("^[0-9a-zA-Z,.'-]+$")) {
      return {invalidName: true};
    }
}
  emailValidator(control: FormControl): {[s: string]: boolean} {
    if (!(control.value.toLowerCase().match('^\\S+@\\S+'))) {
      return {invalidEmail: true};
    }
  }

  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }


  signupUser(){
    this.submitAttempt = true;
    if(this.signupForm.valid){
    let error,username;
    if(this.usernamesService.checkUsername(this.signupForm.controls.name.value)){
      username=true;
      error = this.alertCtrl.create({
        title: "Nutzername bereits vergeben",
        buttons: [
          {
            text: 'OK'
          },
        ]
      });
      error.present();
    }


    if(!username){
      let loading = this.loadingCtrl.create({
        content: 'Bitte warten...'
      });
      loading.present();

      this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.name).subscribe(registerData => {
        this.usernamesService.addUsername(this.signupForm.value.name);
        setTimeout(() => {
          loading.dismiss();
          this.nav.setRoot(OverviewPageComponent);
        }, 1000);
      }, registerError => {
        setTimeout(() => {
          loading.dismiss();

          let message;
          if(registerError.code==="auth/email-already-in-use"){
            message="E-Mail bereits vergeben"
          }
          if(registerError.code==="auth/network-request-failed"){
            message="Netzwerkfehler"
          }
          error = this.alertCtrl.create({
            title: message,
            buttons: [
              {
                text: 'OK'
              },
            ]
          });
          error.present();
        }, 1000);
      });
    }
    }


  }
  checkUsername(control: FormControl,usernamesService: UsernamesService): any {

    return new Promise(resolve => {

        if(SignupPageComponent.usernamesService.checkUsername(control.value)){
          resolve({
            "username taken": true
          });
        } else {
          resolve(null);
        }
    });
  }
}




