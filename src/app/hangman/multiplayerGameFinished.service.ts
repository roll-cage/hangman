import { Injectable } from '@angular/core';
import {Game} from "./game.model";
import {Observable} from "rxjs";
import {FirebaseListObservable, AngularFire} from "angularfire2";
import {MPGame} from "./multiplayerGame.model";
import {UserDataService} from "./userdata.service";


@Injectable()
export class MPGameFinishedService {
  fbFinishedMPGames: FirebaseListObservable<any[]>;
  finishedMPGames: Observable<MPGame[]>;

  constructor(private af: AngularFire, private userdataService: UserDataService) {
    this.fbFinishedMPGames = af.database.list('/finishedMPGames');
    this.finishedMPGames = this.fbFinishedMPGames.map(
      (fbNewMPGames: any[]): MPGame[] => {
        return fbNewMPGames.map(
          fbItem => {
            return new MPGame(fbItem.$key, fbItem.topic, fbItem.word, fbItem.badChars, fbItem.username, fbItem.opponent);
          })
      });
  }

  /**
   * The returned Observable contains all multiplayer games that have been started by any player where the opponent has
   * played his round of the game. If the opponent name found in any MPGame out of the MPGame[] matches the own
   * username, the given MPGame is addressed to this user.
   *
   * @returns {Observable<MPGame[]>} Observable on the array of multiplayer games
   */
  public findFinishedMPGames(): Observable<MPGame[]> {
    return this.finishedMPGames;
  }

  /**
   * The method adds a finished multiplayer game that was addressed to the local user to a firebase list.
   * Other users check this list for games related to them and update their local unfinished game with the acquired data.
   * The key of the game has to be set to the key the original MPGame from the MulitplayerGameStarter Service had,
   * so the opponent can connect them.
   *
   * @param game The game the local user finished.
   */
  public addFinishedMPGame(game: Game): void{
    this.af.database.object("/finishedMPGames/" + game.id).set(new MPGame(null, game.topic, game.word, game.badChars, this.userdataService.getUsername(), game.opponentName));
  }

  /**
   * Deletes a finished mulitplayer game. Has to be done after the user found a finished multiplayer game that fits to
   * a mulitplayer game he started and saved the acquired data in his started game.
   * @param gameId
   */
  public deleteFinishedMPGame(gameId: string): void{
    this.fbFinishedMPGames.remove(gameId);
  }
}
