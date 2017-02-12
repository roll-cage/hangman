import { Injectable } from '@angular/core';
import {Game} from "./game.model";
import {Observable} from "rxjs";
import {FirebaseListObservable, FirebaseObjectObservable, AngularFire} from "angularfire2";

@Injectable()
export class UserDataService {
  fbUserEmail: FirebaseObjectObservable<any>;
  fbGames: FirebaseListObservable<any[]>;
  fbAchievs: FirebaseListObservable<any[]>;
  achievObjectPath: string;
  fbUsername: FirebaseObjectObservable<any>;
  games: Observable<Game[]>;
  achievs: Observable<string[]>;
  username: string;
  usermail: string;

  constructor(private af: AngularFire) {}

  /**
   * Returns a Firebase Object to a given path.
   *
   * @param path The path to searched Object
   * @returns {FirebaseObjectObservable<any>} The searched Firebase Object.
   */
  public object(path: string): FirebaseObjectObservable<any> {
    return this.af.database.object(path);
  }

  /**
   * Used to initialize all user related database Observables. Needs to be called after every login and is therefore not
   * done in the constructor.
   *
   * @param uid Firebase ID of the currently logged in user
   */
  public initializeService(uid: string): void {
    this.username = "";
    this.usermail = "";
    this.achievObjectPath = "users/" + uid + "/achievements/";
    this.fbGames = this.af.database.list("users/" + uid + "/games");
    this.fbAchievs = this.af.database.list("users/" + uid + "/achievements");

    // load userName
    this.fbUsername = this.af.database.object("users/" + uid + "/username", { preserveSnapshot: true });
    let subscription1 = this.fbUsername.subscribe(
      snapshot => {
        if(this.username.localeCompare("")==0){
          this.username = snapshot.val();
        }
        if(subscription1) {
          subscription1.unsubscribe();
        }
      }
    );
    // load userEmail
    this.fbUserEmail = this.af.database.object("users/" + uid + "/email", { preserveSnapshot: true });
    let subscription2 = this.fbUserEmail.subscribe(
      snapshot => {
        if(this.usermail.localeCompare("")==0){
          this.usermail = snapshot.val();
        }
        if(subscription2) {
          subscription2.unsubscribe();
        }
      }
    );
    // load user games
    this.games = this.fbGames.map(
      (fbGames: any[]): Game[] => {
        return fbGames.map(
          fbItem => {
            let newGame = new Game(fbItem.$key, fbItem.topic, fbItem.word, fbItem.badChars, fbItem.singleplayer, fbItem.opponentName, fbItem.badCharsOpponent);
            newGame.visible = fbItem.visible;
            return newGame;
          })
      });
    // load user achievements
    this.achievs = this.fbAchievs.map(
      (fbAchievs: any[]): string[] => {
        return fbAchievs.map(
          fbItem => {
            return fbItem.$key;
          })
      });
  }

  /**
   * Returns username of the user
   * @returns {string}
   */
  public getUsername(): string{
    return this.username;
  }

  /**
   * Returns email of the user
   * @returns {string}
   */
  public getUserEmail(): string {
    return this.usermail;
  }

  /**
   * Returns an observable of all games
   * @returns {Observable<Game[]>}
   */
  public findGames(): Observable<Game[]> {
    return this.games;
  }

  /**
   * Returns an observable of all achievements
   * @returns {Observable<string[]>}
   */
  public findAchievIDs(): Observable<string[]> {
    return this.achievs;
  }

  /**
   * Persists the given game in the user database and returns the key under which it is available.
   * @param game The game to persist.
   * @returns {string|null} The key that was used to persist it.
   */
  public persistGame(game: Game): string {
    return this.fbGames.push(game).key;
  }

  /**
   * Stores a user achievement to the db in format id - points
   * @param id
   * @param points
   */
  public persistAchiev(id: string, points: number) {
    return this.af.database.object(this.achievObjectPath+id).set(points);
  }

  /**
   * Update the given game to be invisible for the user. It isn't really deleted to save it's data for the statistics.
   * @param game The game to make invisible
   */
  public deleteGame(game: Game): void {
    game.visible = false;
    if(game.singleplayer){
      game.opponentName = null;
      game.badCharsOpponent = null;
    }
    this.fbGames.update(game.id, game);
  }

  /**
   * Updates a user game with game by param
   * @param game
   */
  public updateGame(game: Game): void {
    this.fbGames.update(game.id, game);
  }
}
