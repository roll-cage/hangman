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
  findFinishedMPGames(): Observable<MPGame[]> {
    return this.finishedMPGames;
  }
  addFinishedMPGame(game: Game): void{
    this.af.database.object("/finishedMPGames/" + game.id).set(new MPGame(null, game.topic, game.word, game.badChars, this.userdataService.getUsername(), game.opponentName));
  }
  deleteFinishedMPGame(gameId: string): void{
    this.fbFinishedMPGames.remove(gameId);
  }
}
