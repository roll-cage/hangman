import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators,FormControl } from '@angular/forms';
import { AuthService } from './auth.service';
import { OverviewPageComponent } from './overview-page.component';


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


  constructor(public nav: NavController, public authData: AuthService, public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController, public alertCtrl: AlertController) {

    this.signupForm = formBuilder.group({
      'email': ['', [Validators.required, this.emailValidator.bind(this)]],
      'password': ['', Validators.compose([Validators.minLength(6), Validators.required])],
      'name': ['', [Validators.required, Validators.minLength(4), this.nameValidator.bind(this)]],
    })
  }

  //TODO auch für login
  nameValidator(control: FormControl): {[s: string]: boolean} {
    if (!control.value.match("^[a-zA-Z ,.'-]+$")) {
      return {invalidName: true};
    }
}
  emailValidator(control: FormControl): {[s: string]: boolean} {
    if (!(control.value.toLowerCase().match('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$') || control.value.toLowerCase().match('^[a-zA-Z]\\w*@yahoo\\.com$'))) {
      return {invalidEmail: true};
    }
  }

  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }


  signupUser(){
    this.submitAttempt = true;

    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {
      let loading = this.loadingCtrl.create({
        content: 'Bitte warten...'
      });
      loading.present();

      this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.name).subscribe(registerData => {
        this.authData.loginUser(registerData.email, registerData.password).subscribe(loginData => {
          setTimeout(() => {
            loading.dismiss();
            this.nav.setRoot(OverviewPageComponent);
          }, 1000);
        }, loginError => {
          setTimeout(() => {
            loading.dismiss();
            console.log("loginError");
          }, 1000);
        });
      }, registerError => {
        setTimeout(() => {
          loading.dismiss();
          console.log("registerError");
        }, 1000);
      });
    }
  }
}
