import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import {OverviewPageComponent} from "./hangman/overview-page.component";
import {AuthService} from "./hangman/auth.service";
import {UserDataService} from "./hangman/userdata.service";
import * as firebase from "firebase";

@Component({
  selector: 'my-app',
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [AuthService, UserDataService]
})
export class MyApp {
  rootPage = OverviewPageComponent;

  constructor(platform: Platform) {
    firebase.initializeApp({
      apiKey: "AIzaSyD83ZpeKd7QPOfVebnnex-tpv_pgD0AN6c",
      authDomain: "hangman-84413.firebaseapp.com",
      databaseURL: "https://hangman-84413.firebaseio.com",
      storageBucket: "hangman-84413.appspot.com",
      messagingSenderId: "736804327381"
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
