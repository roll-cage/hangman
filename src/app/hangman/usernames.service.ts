import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {AngularFire, FirebaseObjectObservable} from "angularfire2";

@Injectable()
export class UsernamesService {
  fbUsernames: FirebaseObjectObservable<any>;
  usernames: Observable<string[]>;
  usernamesList: string[] = [];
  lowercase: string[] = [];

  constructor(private af: AngularFire) {
    this.fbUsernames = af.database.object('/usernames', { preserveSnapshot: true });
    this.fbUsernames.subscribe(
      snapshot => {
        this.usernamesList = snapshot.val();
        this.lowercase=this.usernamesList.join('|').toLowerCase().split('|');
      }
    );
  }

  findUsernames(): FirebaseObjectObservable<any>{
    return this.fbUsernames;
  }

  public addUsername(username: string){
    let newUsernames = this.usernamesList;
    newUsernames.push(username);
    this.fbUsernames.set(newUsernames);
  }

  public getUsernames(): string[]{
    //takes some time to return the correct array. if too late, this needs to be redone
    return this.usernamesList;
  }

  public checkUsername(username: string): boolean{
    return (this.lowercase.indexOf(username) !== -1);
  }
}
