import { Injectable } from '@angular/core';
import {Game} from "./game.model";
import {Observable} from "rxjs";
import {FirebaseListObservable, AngularFire} from "angularfire2";
import {MPGameStarter} from "./multiplayerGameStarter.model";
import {UserDataService} from "./userdata.service";


@Injectable()
export class MPGameStarterService {
  fbNewMPGames: FirebaseListObservable<any[]>;
  newMPGames: Observable<MPGameStarter[]>;

  constructor(private af: AngularFire, private userdataService: UserDataService) {
    this.fbNewMPGames = af.database.list('/newMPGames');
    this.newMPGames = this.fbNewMPGames.map(
      (fbNewMPGames: any[]): MPGameStarter[] => {
        return fbNewMPGames.map(
          fbItem => {
            return new MPGameStarter(fbItem.$key, fbItem.topic, fbItem.word, fbItem.badChars, fbItem.gameId, fbItem.username, fbItem.opponent);
          })
      });
  }
  findNewMPGames(): Observable<MPGameStarter[]> {
    return this.newMPGames;
  }
  addNewMPGame(game: Game): void{
    let gameId = this.userdataService.persist(game);
    this.fbNewMPGames.push(new MPGameStarter(null, game.topic, game.word, game.badChars, gameId, this.userdataService.getUsername(), game.opponentName));
  }
}
