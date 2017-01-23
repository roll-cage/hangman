import {Component} from '@angular/core';
import {NavController} from "ionic-angular";
import {AuthService} from "./auth.service";
import {User} from "./user.model";
import {UserDataService} from "./userdata.service";
import firebase from 'firebase';
import {Game} from "./game.model";
import {LoginPageComponent} from "./login-page.component"
import {Topic} from "./topic.model";

@Component({
  selector: 'overview-page',
  templateUrl: 'overview-page.component.html'
})

export class OverviewPageComponent {
  user: User;
  pastGames: Game[];
  constructor(public navCtrl: NavController, private userService: AuthService, private userDataService: UserDataService){
    //userService.loginUser("hansgjhgkjgjgjgjg@ggmail.com", "password");
    /*firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //userDataService.addGame(new Game("id", new Topic(), "Hangman", true));
        this.pastGames = userDataService.getGames();
        console.log(this.pastGames);
      } else {
        console.log("No user is signed in.");
      }
    });
    setTimeout(()=> console.log(this.pastGames), 5000)*/
  }

  showProfile(): void {
  }

  logOut(){
    this.userService.logoutUser().then(() => {
      this.navCtrl.setRoot(LoginPageComponent);
    });
  }
}
