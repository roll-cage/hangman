import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {Game} from "./game.model";
import {getUserConfigFile} from "@ionic/app-scripts/dist";

@Injectable()
export class UserDataService {
  profileData: any;

  constructor() {
  }

  getUserProfile(): any {
    return firebase.database().ref('/users').child(firebase.auth().currentUser.uid);
  }

  addActiveGame(game: Game): void {
    let currentActiveGames: Game[] = [];

    this.getUserProfile().on('value', (data) => {
      this.profileData = data.val();
      currentActiveGames = this.profileData.activeGames;
    });
    let newActiveGames = currentActiveGames.concat(game);
    this.getUserProfile().update({
      activeGames: newActiveGames
    })
  }


  getActiveGames(): Game[] {
    let currentActiveGames: Game[] = [];
    this.getUserProfile().on('value', (data) => {
      this.profileData = data.val();
      currentActiveGames = this.profileData.activeGames;
    });
    return currentActiveGames;
  }
}
