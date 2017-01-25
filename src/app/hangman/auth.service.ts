import {Injectable, Inject} from '@angular/core';
import 'rxjs/add/operator/map';
import {AngularFire, AuthProviders, AuthMethods, FirebaseApp} from "angularfire2";
import {Observable} from "rxjs";
import {UserDataService} from "./userdata.service";
//login logic adopted from https://github.com/rodrigoreal/ionic2-angularfire-login

@Injectable()
export class AuthService {
  fireAuth: any;
  user: any;
  constructor(public af: AngularFire, private data: UserDataService, @Inject(FirebaseApp) fa : any) {
    this.fireAuth = fa.auth;
  }

  getUserData(): any {
    return Observable.create(observer => {
      this.af.auth.subscribe(authData => {
        if (authData) {
          this.data.object('users/' + authData.uid).subscribe(userData => {
            console.log(userData);
            this.user = userData;
            observer.next(userData);
          });
        } else {
          observer.error();
        }
      });
    });
  }

  loginUser(email: string, password: string): any {
    let credentials: any = {email: email, password: password};
    return Observable.create(observer => {
      this.af.auth.login(credentials, {
        provider: AuthProviders.Password,
        method: AuthMethods.Password
      }).then((authData) => {
        observer.next(authData);
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  signupUser(email: string, password: string, username: string): any {
    let credentials: any = {email: email, password: password};
    return Observable.create(observer => {
      this.af.auth.createUser(credentials).then((authData: any) => {
        this.af.database.list('users').update(authData.uid, {
          email: authData.auth.email,
          username: username
        });
        credentials.created = true;
        observer.next(credentials);
      }).catch((error: any) => {
        if (error) {
          switch (error.code) {
            case 'INVALID_EMAIL':
              observer.error('E-mail ungültig.');
              break;
            case 'EMAIL_TAKEN':
              observer.error('E-mail bereits vergeben.');
              break;
            case 'NETWORK_ERROR':
              observer.error('Allgemeiner Netzwerkfehler');
              break;
            default:
              observer.error(error);
          }
        }
      });
    });
  }

  resetPassword(email: string): any {
    this.fireAuth.sendPasswordResetEmail(email);
  }

  logoutUser() {
    this.af.auth.logout();
  }

}
