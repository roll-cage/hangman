import { Injectable } from '@angular/core';
import {Game} from "./game.model";
import {Observable} from "rxjs";
import {FirebaseListObservable, FirebaseObjectObservable, AngularFire} from "angularfire2";


@Injectable()
export class UserDataService {
  fbGames: FirebaseListObservable<any[]>;
  fbAchievs: FirebaseListObservable<any[]>;
  fbUsername: FirebaseObjectObservable<any>;
  games: Observable<Game[]>;
  achievs: Observable<string[]>;
  username: string;

  constructor(private af: AngularFire) {}

  object(path: string): FirebaseObjectObservable<any> {
    return this.af.database.object(path);
  }

  initializeService(uid: string): void {
    this.username = "";
    this.fbGames = this.af.database.list("users/" + uid + "/games");
    this.fbAchievs = this.af.database.list("users/" + uid + "/achievements");
    this.fbUsername = this.af.database.object("users/" + uid + "/username", { preserveSnapshot: true });
    let subscription = this.fbUsername.subscribe(
      snapshot => {
        if(this.username.localeCompare("")==0){
          this.username = snapshot.val();
          console.log("username set to " + snapshot.val());
        }
        subscription.unsubscribe();
      }
    );
    this.games = this.fbGames.map(
      (fbGames: any[]): Game[] => {
        return fbGames.map(
          fbItem => {
            return new Game(fbItem.$key, fbItem.topic, fbItem.word, fbItem.badChars, fbItem.singleplayer, fbItem.opponentName, fbItem.badCharsOpponent);
          })
      });
    this.achievs = this.fbAchievs.map(
      (fbAchievs: any[]): string[] => {
        return fbAchievs.map(
          fbItem => {
            return fbItem.$key;
          })
      });
  }

  getUsername(): string{
    return this.username;
  }

  findGames(): Observable<Game[]> {
    return this.games;
  }

  findAchievIDs(): Observable<string[]> {
    console.log(this.achievs)
    return this.achievs;
  }

  persist(game: Game): string {
    return this.fbGames.push(game).key;
  }

  delete(id: any): void {
    this.fbGames.remove(id);
  }
  update(game: Game): void {
    this.fbGames.update(game.id, game);
  }
}
