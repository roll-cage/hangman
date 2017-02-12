import { Injectable } from '@angular/core';
import {Game} from "./game.model";
import {Observable} from "rxjs";
import {FirebaseListObservable, AngularFire} from "angularfire2";
import {MPGame} from "./multiplayerGame.model";
import {UserDataService} from "./userdata.service";


@Injectable()
export class MPGameStarterService {
  fbNewMPGames: FirebaseListObservable<any[]>;
  newMPGames: Observable<MPGame[]>;

  constructor(private af: AngularFire, private userdataService: UserDataService) {
    this.fbNewMPGames = af.database.list('/newMPGames');
    this.newMPGames = this.fbNewMPGames.map(
      (fbNewMPGames: any[]): MPGame[] => {
        return fbNewMPGames.map(
          fbItem => {
            return new MPGame(fbItem.$key, fbItem.topic, fbItem.word, fbItem.badChars, fbItem.username, fbItem.opponent);
          })
      });
  }

  /**
   * The returned Observable contains all multiplayer games that have been started by any player where the opponent hasn't
   * played his round of the game yet. If the opponent name found in any MPGame out of the MPGame[] matches the own
   * username, the given MPGame is addressed to this user.
   *
   * @returns {Observable<MPGame[]>} Observable on the array of multiplayer games
   */
  public findNewMPGames(): Observable<MPGame[]> {
    return this.newMPGames;
  }

  /**
   * The method adds a started multiplayer game that has been finished by the local user and requires action by the
   * chosen opponent to the users array of games. It's important to only provide games, where
   * the opponents count of wrong chars is set to null to be able to locally differentiate between started and finished multiplayer
   * games.
   * The game is also saved in the firebase database so other players can recognize it and react to it. The key used
   * to save it is the same as the one used in the users game array so the finished game of the opponent can be connected
   * to the one of the user.
   *
   * @param game The game the local user played.
   */
  addNewMPGame(game: Game): void{
    let gameId = this.userdataService.persistGame(game);
    this.af.database.object("/newMPGames/" + gameId).set(new MPGame(null, game.topic, game.word, game.badChars, this.userdataService.getUsername(), game.opponentName));
  }

  /**
   * Deletes a game from the started multiplayer games list.
   * After the user has recognized a game that challenges him, he can play this game and delete its data from the list
   * of started mulitplayer games.
   *
   * @param gameId The ID of the game to delete.
   */
  deleteFinishedMPGame(gameId: string): void{
    this.fbNewMPGames.remove(gameId);
  }
}
