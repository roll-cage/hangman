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
  findNewMPGames(): Observable<MPGame[]> {
    return this.newMPGames;
  }
  addNewMPGame(game: Game): void{
    let gameId = this.userdataService.persistGame(game);
    this.af.database.object("/newMPGames/" + gameId).set(new MPGame(null, game.topic, game.word, game.badChars, this.userdataService.getUsername(), game.opponentName));
  }
  deleteFinishedMPGame(gameId: string): void{
    this.fbNewMPGames.remove(gameId);
  }
}
