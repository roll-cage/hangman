import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { OverviewPageComponent } from './hangman/overview-page.component';
import { LoginPageComponent } from './hangman/login-page.component';
import { SignupPageComponent } from './hangman/signup-page.component';
import { ResetPasswordPageComponent } from './hangman/resetpassword-page.component';


@NgModule({
  declarations: [
    MyApp,
    OverviewPageComponent,
    LoginPageComponent,
    ResetPasswordPageComponent,
    SignupPageComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OverviewPageComponent,
    LoginPageComponent,
    ResetPasswordPageComponent,
    SignupPageComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
