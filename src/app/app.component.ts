import {Component, ViewChild} from '@angular/core';
import {Platform, Nav} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import {LoginPageComponent} from "./hangman/login-page.component"
import {AuthService} from "./hangman/auth.service";
import {UserDataService} from "./hangman/userdata.service";
import {OverviewPageComponent} from "./hangman/overview-page.component";
import {TopicDataService} from "./hangman/topicdata.service";
import {UsernamesService} from "./hangman/usernames.service";
import {AchievementDataService} from "./hangman/achievementdata.service";
import {MPGameStarterService} from "./hangman/multiplayerGameStarter.service";
import {MPGameFinishedService} from "./hangman/multiplayerGameFinished.service";

@Component({
  selector: 'my-app',
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [AuthService, UserDataService, TopicDataService, UsernamesService, MPGameStarterService, MPGameFinishedService, AchievementDataService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  isAppInitialized: boolean = false;

  constructor(private platform: Platform, protected auth: AuthService, private userData: UserDataService) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
  ngOnInit() {
    this.platform.ready().then(() => {
      this.auth.getUserData().subscribe(data => {
        if (!this.isAppInitialized) {
          this.userData.initializeService(data.uid);
          this.nav.setRoot(OverviewPageComponent);
          this.isAppInitialized = true;
        }
      }, err => {
        this.nav.setRoot(LoginPageComponent);
      });
    });
  }
}
