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

  object(path: string): FirebaseObjectObservable<any> {
    return this.af.database.object(path);
  }

  /**
   * Initializes variables for usage
   * @param uid
   */
  initializeService(uid: string): void {
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
        subscription1.unsubscribe();
      }
    );
    // load userEmail
    this.fbUserEmail = this.af.database.object("users/" + uid + "/email", { preserveSnapshot: true });
    let subscription2 = this.fbUserEmail.subscribe(
      snapshot => {
        if(this.usermail.localeCompare("")==0){
          this.usermail = snapshot.val();
        }
        subscription2.unsubscribe();
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
  getUsername(): string{
    return this.username;
  }

  /**
   * Returns email of the user
   * @returns {string}
   */
  getUserEmail(): string {
    return this.usermail;
  }

  /**
   * Returns an observable of all games
   * @returns {Observable<Game[]>}
   */
  findGames(): Observable<Game[]> {
    return this.games;
  }

  /**
   * Returns an observable of all achievements
   * @returns {Observable<string[]>}
   */
  findAchievIDs(): Observable<string[]> {
    return this.achievs;
  }

  /**
   * Stores a user game to the db
   * @param game
   * @returns {string|null}
   */
  persistGame(game: Game): string {
    return this.fbGames.push(game).key;
  }

  /**
   * Stores a user achievement to the db in format id - points
   * @param id
   * @param points
   */
  persistAchiev(id: string, points: number) {
    return this.af.database.object(this.achievObjectPath+id).set(points);
  }

  /**
   * Deletes/Updates a user game from the db by disabling visability and resetting values (SP)
   * @param game
   */
  deleteGame(game: Game): void {
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
  updateGame(game: Game): void {
    this.fbGames.update(game.id, game);
  }
}
