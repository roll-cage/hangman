import {Injectable} from '@angular/core';
import {User} from './user.model';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2";
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
@Injectable()
export class UserService {
  fbUser: FirebaseObjectObservable<any[]>;
  fbUserList: FirebaseListObservable<any[]>;
  user: Observable<User>;
  af: AngularFire;
  constructor(af: AngularFire) {
    this.af = af;
  }

  loadUser(user_id: string): void {
    let userString = "/users/" + user_id;
    this.fbUser = this.af.database.object(userString);
    this.user = this.fbUser.map(
      (fbUser: any): User => {
        return fbUser.map(
          fbItem => {
            let user = User.createWith(fbItem);
            user.user_id = fbItem.$key;
            return user;
          })
      });
  }

  getUser(): Observable<User> {
    return this.user;
  }

  persist(user: User): void {
    this.fbUserList = this.af.database.list('/Users');
    this.fbUserList.push(this.copyAndPrepareUser(user));
  }

  update(user: User): void {
    this.fbUser.update(this.copyAndPrepareUser(user));
  }

  //probably not necessary
  delete(): void {
    this.fbUser.remove();
  }
  private copyAndPrepareUser(user: any): User {
    let newUser = User.createWith(user);
    newUser.user_id = null;
    newUser.pastGames = newUser.pastGames || null;
    newUser.activeGames = newUser.activeGames || null;
    return newUser;
  }

}
