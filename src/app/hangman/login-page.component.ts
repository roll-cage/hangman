import {
  NavController,
  LoadingController,
  AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators,FormControl } from '@angular/forms';
import { AuthService } from './auth.service';
import {OverviewPageComponent} from "./overview-page.component";
import { SignupPageComponent } from './signup-page.component';
import { ResetPasswordPageComponent } from './resetpassword-page.component';



@Component({
  selector: 'login-page',
  templateUrl: 'login-page.component.html',
})
export class LoginPageComponent {
  public loginForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;
  error: any;

  constructor(public nav: NavController, public authData: AuthService, public formBuilder: FormBuilder,
              public alertCtrl: AlertController, public loadingCtrl: LoadingController) {


    this.loginForm = formBuilder.group({
      email: ['', [Validators.required, this.emailValidator.bind(this)]],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
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

  loginUser(){

    this.submitAttempt = true;

    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      /*this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password).then( authData => {
        this.nav.setRoot(OverviewPageComponent);
      }, error => {
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      });

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    */
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();

      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password).subscribe(data => {
        loading.dismiss();
        this.nav.setRoot(OverviewPageComponent);
      }, err => {
        loading.dismiss();
        if(err.code==="auth/user-not-found"){
          let confirm = this.alertCtrl.create({
            title: 'E-Mail nicht registriert',
            buttons: [
              {
                text: 'OK'
              },
            ]
          });
          confirm.present();
        }
        this.error = err;
      });
    }
  }

  goToSignup(){
    this.nav.push(SignupPageComponent);
  }

  goToResetPassword(){
    this.nav.push(ResetPasswordPageComponent);
  }


}
