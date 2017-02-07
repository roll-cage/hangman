import {
  NavController,
  LoadingController,
  AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import {OverviewPageComponent} from "./overview-page.component";
import { SignupPageComponent } from './signup-page.component';
import { ResetPasswordPageComponent } from './resetpassword-page.component';
import {UserDataService} from "./userdata.service";



@Component({
  selector: 'profile-page',
  templateUrl: 'profile-page.component.html',
})
export class ProfilePageComponent {

  username:string;
  constructor(private userDataService: UserDataService,public nav: NavController, public authData: AuthService, public formBuilder: FormBuilder,
              public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.username=userDataService.username;


  }

  goToAchievements(){
    
  }
  goToStats(){
    
  }
}
