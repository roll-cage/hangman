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
import {UsernamesService} from "./usernames.service";
import {MPGameStarterService} from "./multiplayerGameStarter.service";
import {MPGameStarter} from "./multiplayerGameStarter.model";

@Component({
  selector: 'overview-page',
  templateUrl: 'overview-page.component.html'
})

export class OverviewPageComponent {
  user: User;
  pastGames: Game[] = [];
  constructor(public navCtrl: NavController, private userService: AuthService, private userDataService: UserDataService, private tds: TopicDataService,
              private usernamesService: UsernamesService, private mpgamestarter: MPGameStarterService, public af: AngularFire){
    //userService.loginUser("hansgjhgkjgjgjgjg@ggmail.com", "password");
    userDataService.initializeService();
    userDataService.findGames().subscribe(
      (games: Game[])=> {
        this.pastGames = games;
        //console.log(games[0]);
      }
    );
    mpgamestarter.findNewMPGames().subscribe(
      (newMpGames: MPGameStarter[]) => {
        newMpGames.forEach((newMpGame) => {
          if(newMpGame.opponent == userDataService.getUsername()){
            //Todo: add logic for new mp game
          }
        });
      }
    );
    /*let tiere: string[] = ["Elefant", "Koalabaer", "Galapagosschildkröte"];
    tds.persist(new Topic(null, "Tiere", tiere));*/
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
