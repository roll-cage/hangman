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
  constructor(public af: AngularFire, private userData: UserDataService, @Inject(FirebaseApp) fa : any) {
    this.fireAuth = fa.auth;
  }

  /**
   * Returns an Observable that can be used to access the user data of the logged in user
   * @returns {any}
   */
  public getUserData(): any {
    return Observable.create(observer => {
      this.af.auth.subscribe(authData => {
        if (authData) {
          this.userData.object('users/' + authData.uid).subscribe(userData => {
            this.user = userData;
            observer.next(authData);
          });
        } else {
          observer.error();
        }
      });
    });
  }

  /**
   * Returns an Observable that logs in a user with the provided credentials or returns an error if login wasn't possible.
   *
   * @param email email to log in the user
   * @param password password of the user
   * @returns {any}
   */
  public loginUser(email: string, password: string): any {
    let credentials: any = {email: email, password: password};
    return Observable.create(observer => {
      this.af.auth.login(credentials, {
        provider: AuthProviders.Password,
        method: AuthMethods.Password
      }).then((authData) => {
        this.userData.initializeService(authData.uid);
        observer.next(authData);
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  /**
   * Returns an Observable that signs up a user with the provided credentials or returns an error if sign up wasn't possible.
   *
   * @param email
   * @param password
   * @param username
   * @returns {any}
   */
  public signupUser(email: string, password: string, username: string): any {
    let credentials: any = {email: email, password: password};
    return Observable.create(observer => {
      this.af.auth.createUser(credentials).then((authData: any) => {
        this.af.database.list('users').update(authData.uid, {
          email: authData.auth.email,
          username: username
        });
        setTimeout(() => {
          this.userData.initializeService(authData.uid);
        }, 2);
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

  public resetPassword(email: string): any {
    this.fireAuth.sendPasswordResetEmail(email);
  }

  public logoutUser() {
    this.af.auth.logout();
  }
}
