import { Injectable } from '@angular/core';
import {Game} from "./game.model";
import {Observable} from "rxjs";
import {FirebaseListObservable, FirebaseObjectObservable, AngularFire} from "angularfire2";


@Injectable()
export class UserDataService {
  fbGames: FirebaseListObservable<any[]>;
  fbUsername: FirebaseObjectObservable<any>;
  games: Observable<Game[]>;
  username: string;
  constructor(private af: AngularFire) {
    this.af.auth.subscribe(authData => {
      if(authData){
        this.fbGames = this.af.database.list("users/" + authData.uid + "/games");
        this.fbUsername = this.af.database.object("users/" + authData.uid + "/username", { preserveSnapshot: true });
        this.fbUsername.subscribe(
          snapshot => {
            this.username = snapshot.val();
          }
        );
      }
    });
  }

  object(path: string): FirebaseObjectObservable<any> {
    return this.af.database.object(path);
  }

  initializeService(): void {
    this.games = this.fbGames.map(
      (fbGames: any[]): Game[] => {
        return fbGames.map(
          fbItem => {
            return new Game(fbItem.$key, fbItem.topic, fbItem.word, fbItem.badChars, fbItem.singleplayer, fbItem.opponentName, fbItem.badCharsOpponent);
          })
      });
  }

  getUsername(): string{
    return this.username;
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
