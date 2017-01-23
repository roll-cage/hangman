import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import {AngularFire, AngularFireAuth, AuthProviders, AuthMethods} from "angularfire2";
import {Observable} from "rxjs";

@Injectable()
export class AuthService {
  fireAuth: AngularFireAuth;
  userProfile: any;
  constructor(public af: AngularFire) {
    this.fireAuth = af.auth;
    this.userProfile = firebase.database().ref('/users');
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
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): any {
    return this.fireAuth.logout();
  }

}
