import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { OverviewPageComponent } from './hangman/overview-page.component';
import { LoginPageComponent } from './hangman/login-page.component';
import { SignupPageComponent } from './hangman/signup-page.component';
import { ResetPasswordPageComponent } from './hangman/resetpassword-page.component';
import {AngularFireModule} from "angularfire2";
import {UserPickerPageComponent} from "./hangman/userpicker-page.component";
import {TopicPickerPageComponent} from "./hangman/topicpicker-page.component";
import {ProfilePageComponent} from "./hangman/profile-page.component";
import {StatisticPageComponent} from "./hangman/statistic-page.component";
import {AchievementPageComponent} from "./hangman/achievement-list-page.component";
import '../../node_modules/chart.js/dist/Chart.bundle.min.js';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import {GamePageComponent} from "./hangman/game-page.component";


export const firebaseConfig = {
  apiKey: "AIzaSyD83ZpeKd7QPOfVebnnex-tpv_pgD0AN6c",
  authDomain: "hangman-84413.firebaseapp.com",
  databaseURL: "https://hangman-84413.firebaseio.com",
  storageBucket: "hangman-84413.appspot.com",
  messagingSenderId: "736804327381"
};

@NgModule({
  declarations: [
    MyApp,
    OverviewPageComponent,
    LoginPageComponent,
    ResetPasswordPageComponent,
    SignupPageComponent,
    UserPickerPageComponent,
    TopicPickerPageComponent,
    ProfilePageComponent,
    StatisticPageComponent,
    AchievementPageComponent,
    GamePageComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OverviewPageComponent,
    LoginPageComponent,
    ResetPasswordPageComponent,
    SignupPageComponent,
    UserPickerPageComponent,
    TopicPickerPageComponent,
    ProfilePageComponent,
    StatisticPageComponent,
    AchievementPageComponent,
    GamePageComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
