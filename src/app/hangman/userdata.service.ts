import { Injectable } from '@angular/core';
import {Game} from "./game.model";
import {Observable} from "rxjs";
import {FirebaseListObservable, FirebaseObjectObservable, AngularFire} from "angularfire2";


@Injectable()
export class UserDataService {
  fbRecords: FirebaseListObservable<any[]>;
  games: Observable<Game[]>
  constructor(private af: AngularFire) {
  }
  object(path: string): FirebaseObjectObservable<any> {
    return this.af.database.object(path);
  }
  /*
   getUserProfile(): any {
     return firebase.database().ref('/users').child(firebase.auth().currentUser.uid);
   }

   addGame(game: Game): void {
     let savedGames: Game[] = this.getGames();
     savedGames.push(game);
     this.getUserProfile().update({
       games: savedGames
     })
   }

   getGames(): Game[] {
     let currentGames: Game[] = [];
     firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/games').on('value', (data) => {
       currentGames= data.val();
     });
     return currentGames;
   }*/
}
