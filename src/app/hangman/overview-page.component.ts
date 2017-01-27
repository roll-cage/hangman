import {Component} from '@angular/core';
import {NavController} from "ionic-angular";
import {AuthService} from "./auth.service";
import {User} from "./user.model";
import {UserDataService} from "./userdata.service";
import {Game} from "./game.model";
import {LoginPageComponent} from "./login-page.component"
import {Topic} from "./topic.model";
import {AngularFire} from "angularfire2";
import {TopicDataService} from "./topicdata.service";

@Component({
  selector: 'overview-page',
  templateUrl: 'overview-page.component.html'
})

export class OverviewPageComponent {
  user: User;
  pastGames: Game[] = [];
  constructor(public navCtrl: NavController, private userService: AuthService, private userDataService: UserDataService, private tds: TopicDataService, public af: AngularFire){
    //userService.loginUser("hansgjhgkjgjgjgjg@ggmail.com", "password");
    /*af.auth.onAuthStateChanged(function(user) {
      if (user) {
        //userDataService.addGame(new Game("id", new Topic(), "Hangman", true));
        this.pastGames = userDataService.getGames();
        console.log(this.pastGames);
      } else {
        console.log("No user is signed in.");
      }
    });
    setTimeout(()=> console.log(this.pastGames), 5000);*/
    userDataService.initializeService();
    userDataService.findGames().subscribe(
      (games: Game[])=> {
        this.pastGames = games;
        console.log(games[0]);
      }
    );
    let tiere: string[] = ["Elefant", "Koalabaer", "Galapagosschildkröte"];
    //tds.persist(new Topic(null, "Tiere", tiere));
    setTimeout(()=> console.log(tds.getWordFromTopic("Tiere")), 5000);
  }

  showProfile(): void {
  }

  deleteGame(game: Game){
    this.userDataService.delete(game.id);
  }

  logOut(){
    this.userService.logoutUser()
    this.navCtrl.setRoot(LoginPageComponent);
  }
}
