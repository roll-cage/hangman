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
  constructor(private af: AngularFire) {}

  object(path: string): FirebaseObjectObservable<any> {
    return this.af.database.object(path);
  }

  initializeService(uid: string): void {
    this.username = "";
    this.fbGames = this.af.database.list("users/" + uid + "/games");
    this.fbUsername = this.af.database.object("users/" + uid + "/username", { preserveSnapshot: true });
    let subscription = this.fbUsername.subscribe(
      snapshot => {
        if(this.username.localeCompare("")==0){
          this.username = snapshot.val();
        }
        subscription.unsubscribe();
      }
    );
    this.games = this.fbGames.map(
      (fbGames: any[]): Game[] => {
        return fbGames.map(
          fbItem => {
            let newGame = new Game(fbItem.$key, fbItem.topic, fbItem.word, fbItem.badChars, fbItem.singleplayer, fbItem.opponentName, fbItem.badCharsOpponent);
            newGame.visible = fbItem.visible;
            return newGame;
          })
      });
  }

  getUsername(): string{
    return this.username;
  }

  findGames(): Observable<Game[]> {
    return this.games;
  }

  persistGame(game: Game): string {
    return this.fbGames.push(game).key;
  }

  deleteGame(game: Game): void {
    game.visible = false;
    if(game.singleplayer){
      game.opponentName = null;
      game.badCharsOpponent = null;
    }
    this.fbGames.update(game.id, game);
  }
  updateGame(game: Game): void {
    this.fbGames.update(game.id, game);
  }
}
