import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {Game} from "./game.model";
import {getUserConfigFile} from "@ionic/app-scripts/dist";

@Injectable()
export class UserDataService {

  constructor() {
  }

  getUserProfile(): any {
    return firebase.database().ref('/users').child(firebase.auth().currentUser.uid);
  }

  addGame(game: Game): void {
    let savedGames: Game[] = this.getGames();
    savedGames.push(game);
    this.getUserProfile().update({
      games: savedGames
    })
  }

  getGames(): Game[] {
    let currentGames: Game[] = [];
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/games').on('value', (data) => {
      currentGames= data.val();
    });
    return currentGames;
  }
}
