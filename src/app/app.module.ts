import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { OverviewPageComponent } from './hangman/overview-page.component';
import {AngularFireModule} from "angularfire2";

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
    OverviewPageComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OverviewPageComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
