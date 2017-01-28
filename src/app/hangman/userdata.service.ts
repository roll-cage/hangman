import { Injectable } from '@angular/core';
import {Game} from "./game.model";
import {Observable} from "rxjs";
import {FirebaseListObservable, FirebaseObjectObservable, AngularFire} from "angularfire2";


@Injectable()
export class UserDataService {
  fbGames: FirebaseListObservable<any[]>;
  games: Observable<Game[]>;
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
            return new Game(fbItem.$key, fbItem.topic, fbItem.word, fbItem.badChars, fbItem.singleplayer, fbItem.opponentName, fbItem.badCharsOpponent);
          })
      });
  }

  findGames(): Observable<Game[]> {
    return this.games;
  }

  persist(game: Game): string {
    return this.fbGames.push(game).key;
  }

  delete(id: any): void {
    this.fbGames.remove(id);
  }
}
