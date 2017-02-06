import {Component} from '@angular/core';
import {NavController, AlertController, ModalController} from "ionic-angular";
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
import {MPGame} from "./multiplayerGame.model";
import {MPGameFinishedService} from "./multiplayerGameFinished.service";
import {UserPickerPageComponent} from "./userpicker-page.component";
import {TopicPickerPageComponent} from "./topicpicker-page.component";

@Component({
  selector: 'overview-page',
  templateUrl: 'overview-page.component.html'
})

export class OverviewPageComponent {
  user: User;
  pastGames: Game[] = [];
  startedMPGames: Game[] = [];
  mpGamesToAccept: MPGame[] = [];
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController,
              private userService: AuthService, private userDataService: UserDataService, private tds: TopicDataService,
              private usernamesService: UsernamesService, private mpgamestarter: MPGameStarterService,
              private mpGameFinished: MPGameFinishedService, public af: AngularFire){
    //userService.loginUser("hansgjhgkjgjgjgjg@ggmail.com", "password");
    userDataService.initializeService();
    userDataService.findGames().subscribe(
      (games: Game[])=> {
        this.pastGames = [];
        this.startedMPGames = [];
        games.forEach((game) => {
          if(game.singleplayer || game.badCharsOpponent != null){
            this.pastGames.push(game);
          } else {
            this.startedMPGames.push(game);
          }
        });
      }
    );
    mpgamestarter.findNewMPGames().subscribe(
      (newMpGames: MPGame[]) => {
        newMpGames.forEach((newMpGame) => {
          if(userDataService.getUsername().localeCompare(newMpGame.opponent) == 0){
            this.mpGamesToAccept.push(new MPGame(newMpGame.id, newMpGame.topic, newMpGame.word, newMpGame.badChars, userDataService.getUsername(), newMpGame.username));
            //dont forget to delete it after game finished
          }
        });
      }
    );
    mpGameFinished.findFinishedMPGames().subscribe(
      (finishedMpGames: MPGame[]) => {
        finishedMpGames.forEach((finishedMpGame) => {
          this.startedMPGames.forEach((startedMPGame) => {
            if(startedMPGame.id.localeCompare(finishedMpGame.id) == 0){
              userDataService.update(new Game(startedMPGame.id, startedMPGame.topic, startedMPGame.word,
                startedMPGame.badChars, false, startedMPGame.opponentName, finishedMpGame.badChars));
              mpGameFinished.deleteFinishedMPGame(startedMPGame.id);
            }
          });
        });
      }
    );
    //mpgamestarter.addNewMPGame(new Game(null, "Tiere", "Koalabaer", 3, false, "testuser", null));
    /*let tiere: string[] = ["Elefant", "Koalabaer", "Galapagosschildkröte"];
    tds.persist(new Topic(null, "Tiere", tiere));*/
  }

  chooseGameMode(): void {
    let confirm = this.alertCtrl.create({
      title: 'Alleine oder gegen Freunde?',
      message: 'Willst du dich alleine an einem Wort versuchen oder einem Freund zeigen, wo der Hammer hängt?',
      buttons: [
        {
          text: 'Multiplayer',
          handler: () => {
            this.presentUserPickerModal();
          }
        },
        {
          text: 'Singleplayer',
          handler: () => {
            this.presentTopicPickerModal(false, null);
          }
        }
      ]
    });
    confirm.present();
  }

  presentUserPickerModal(): void{
    let modal = this.modalCtrl.create(UserPickerPageComponent);
    modal.present();
    modal.onDidDismiss(username => {
      if(username){
        this.presentTopicPickerModal(true, username);
      }
    });
  }

  presentTopicPickerModal(isMultiplayer: boolean, username: string): void{
    let modal = this.modalCtrl.create(TopicPickerPageComponent);
    modal.present();
    modal.onDidDismiss(word => {
      if(word){
        console.log(word + " " + username);
      }
    });
  }

  showProfile(): void {
  }

  deleteGame(game: Game){
    this.userDataService.delete(game.id);
  }

  logOut(){
    this.userService.logoutUser();
    this.navCtrl.setRoot(LoginPageComponent);
  }
}
