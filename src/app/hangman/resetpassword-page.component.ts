import {
  NavController,
  LoadingController,
  AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators,FormControl } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'resetpassword-page',
  templateUrl: 'resetpassword-page.component.html',
})
export class ResetPasswordPageComponent {
  public resetPasswordForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;


  constructor(public authData: AuthService, public formBuilder: FormBuilder, public nav: NavController,
              public loadingCtrl: LoadingController, public alertCtrl: AlertController) {

    this.resetPasswordForm = formBuilder.group({
      'email': ['', [Validators.required, this.emailValidator.bind(this)]]
    })
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


  resetPassword(){

    this.submitAttempt = true;
    if (!this.resetPasswordForm.valid){
      console.log(this.resetPasswordForm.value);
    } else {
      //TODO Funktioniert nicht mit dieser Ionic Version
      //this.authData.resetPassword(this.resetPasswordForm.value.email).then((user) => {
        let alert = this.alertCtrl.create({
          message: "E-Mail mit Wiederherstellungslink versandt.",
          buttons: [
            {
              text: "Ok",
              role: 'cancel',
              handler: () => {
                this.nav.pop();
              }
            }
          ]
        });
        alert.present();

      /*}, (error) => {
        var errorMessage: string = error.message;
        let errorAlert = this.alertCtrl.create({
          message: errorMessage,
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });

        errorAlert.present();
      });
      */
    }
  }
}
