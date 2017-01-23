import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import {LoginPageComponent} from "./hangman/login-page.component"
import {AuthService} from "./hangman/auth.service";
import {UserDataService} from "./hangman/userdata.service";
import * as firebase from "firebase";

@Component({
  selector: 'my-app',
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [AuthService, UserDataService]
})
export class MyApp {
  rootPage = LoginPageComponent;

  constructor(platform: Platform) {
    platform.ready().then(() => {

      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
