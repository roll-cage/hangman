import { Injectable } from '@angular/core';
import {Game} from "./game.model";
import {Observable} from "rxjs";
import {FirebaseListObservable, FirebaseObjectObservable, AngularFire} from "angularfire2";


@Injectable()
export class UserDataService {
  fbGames: FirebaseListObservable<any[]>;
  games: Observable<Game[]>
  constructor(private af: AngularFire) {
  }

  object(path: string): FirebaseObjectObservable<any> {
    return this.af.database.object(path);
  }

  initializeService(): void {
    this.af.auth.subscribe(authData => {
      if(authData){
        this.fbGames = this.af.database.list("users/" + authData.uid + "/games");
      }
    });
    this.games = this.fbGames.map(
      (fbGames: any[]): Game[] => {
        return fbGames.map(
          fbItem => {
            return new Game(fbItem.$key, fbItem.topic, fbItem.word, fbItem.singleplayer);
          })
      });
  }

  findGames(): Observable<Game[]> {
    return this.games;
  }

  persist(game: Game): void {
    this.fbGames.push(game);
  }

  delete(id: any): void {
    this.fbGames.remove(id);
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
