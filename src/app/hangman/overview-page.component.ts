import {Component} from '@angular/core';
import {NavController} from "ionic-angular";
import {AuthService} from "./auth.service";
import {User} from "./user.model";
import {UserDataService} from "./userdata.service";
import firebase from 'firebase';
import {Game} from "./game.model";
import {LoginPageComponent} from "./login-page.component"

@Component({
  selector: 'overview-page',
  templateUrl: 'overview-page.component.html'
})

export class OverviewPageComponent {
  user: User;
  activeGames: Game[];
  constructor(public navCtrl: NavController, private userService: AuthService, private userDataService: UserDataService){
    //userService.loginUser("hansgjhgkjgjgjgjg@ggmail.com", "password");
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //userDataService.addActiveGame(new Game("id", new Topic(), "Hangman", true));
        this.activeGames = userDataService.getActiveGames();
        console.log(this.activeGames);
      } else {
        console.log("No user is signed in.");
      }
    });
  }

  showProfile(): void {
  }

  logOut(){
    this.userService.logoutUser().then(() => {
      this.navCtrl.setRoot(LoginPageComponent);
    });
  }
}
