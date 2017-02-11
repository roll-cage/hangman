import {Component} from '@angular/core';
import {NavController, AlertController, ModalController} from "ionic-angular";
import {AuthService} from "./auth.service";
import {UserDataService} from "./userdata.service";
import {AchievementDataService} from "./achievementdata.service"
import {Game} from "./game.model";
import {LoginPageComponent} from "./login-page.component"
//import {Topic} from "./topic.model";
import {AngularFire} from "angularfire2";
import {TopicDataService} from "./topicdata.service";
import {UsernamesService} from "./usernames.service";
import {MPGameStarterService} from "./multiplayerGameStarter.service";
import {MPGame} from "./multiplayerGame.model";
import {MPGameFinishedService} from "./multiplayerGameFinished.service";
import {UserPickerPageComponent} from "./userpicker-page.component";
import {TopicPickerPageComponent} from "./topicpicker-page.component";
import {ProfilePageComponent} from "./profile-page.component";
import {GamePageComponent} from "./game-page.component";


@Component({
  selector: 'overview-page',
  templateUrl: 'overview-page.component.html'
})

export class OverviewPageComponent {
  pastGames: Game[] = [];
  startedMPGames: Game[] = [];
  mpGamesToAccept: MPGame[] = [];
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController,
              private userService: AuthService, private userDataService: UserDataService, private tds: TopicDataService,
              private usernamesService: UsernamesService, private mpgamestarter: MPGameStarterService,
              private mpGameFinished: MPGameFinishedService, public af: AngularFire,
              private achievementDataService: AchievementDataService){
    //userService.loginUser("hansgjhgkjgjgjgjg@ggmail.com", "password");
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
        this.pastGames = this.pastGames.reverse();
      }
    );

    //after logging in the username is not available immediately
    setTimeout(()=>{
    mpgamestarter.findNewMPGames().subscribe(
      (newMpGames: MPGame[]) => {
        this.mpGamesToAccept = [];
        newMpGames.forEach((newMpGame) => {
          if(userDataService.getUsername().localeCompare(newMpGame.opponent) == 0){
            this.mpGamesToAccept.push(new MPGame(newMpGame.id, newMpGame.topic, newMpGame.word, newMpGame.badChars, userDataService.getUsername(), newMpGame.username));
            //dont forget to delete it after game finished
          }
        });
      }
    );}, 300);

    mpGameFinished.findFinishedMPGames().subscribe(
      (finishedMpGames: MPGame[]) => {
        finishedMpGames.forEach((finishedMpGame) => {
          this.startedMPGames.forEach((startedMPGame) => {
            if(startedMPGame.id.localeCompare(finishedMpGame.id) == 0){
              userDataService.updateGame(new Game(startedMPGame.id, startedMPGame.topic, startedMPGame.word,
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
    //let items: string[] = ["Tasse", "Messer", "Handtuch", "Brille", "Waschlappen", "Kuehlschrank", "Tisch", "Fernsehgeraet"];
    // tds.persist(new Topic(null, "Gegenstaende", items));
    //let cities: string[] = ["Paris", "Berlin", "Timbuktu", "Shanghai", "Delhi", "Jakarta", "London",
    //  "Moskau", "Hongkong", "Yokohama", "Nagasaki", "Johannesburg", "Budapest"];
    //tds.persist(new Topic(null, "Städte", cities));
    /**achievementDataService.persist(new Achievement(null, "10 Siege", "Gewinne 10 Spiele in einem beliebigen Modus!", 10));
    achievementDataService.persist(new Achievement(null, "100 Siege", "Gewinne 100 Spiele in einem beliebigen Modus!", 100));
    achievementDataService.persist(new Achievement(null, "50 Siege im SP", "Gewinne 50 Spiele im Single Player Modus!", 30));
    achievementDataService.persist(new Achievement(null, "50 Siege im MP", "Gewinne 50 Spiele im Multi Player Modus!", 30));
    achievementDataService.persist(new Achievement(null, "Spiel ohne Fehler", "Gewinne ein Spiel ohne einen Falschen Buchstaben!", 80));*/
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
    modal.onDidDismiss(opponentName => {
      if(opponentName){
        this.presentTopicPickerModal(true, opponentName);
      }
    });
  }

  presentTopicPickerModal(isMultiplayer: boolean, opponentName: string): void{
    let modal = this.modalCtrl.create(TopicPickerPageComponent);
    modal.present();
    modal.onDidDismiss(data => {
      if(data){
        let gameData={
          isMultiplayer:isMultiplayer,
          isStarter: true,
          word:data.word,
          topic:data.topic,
          opponentName:opponentName
        };
        this.navCtrl.push(GamePageComponent,gameData);
      }
    });
  }

  startMPChallengedGame(mpGame: MPGame): void{
    let gameData={
      isMultiplayer: true,
      isStarter: false,
      mpGame: mpGame
    };
    this.navCtrl.push(GamePageComponent, gameData);
  }

  showProfile(): void {
    this.navCtrl.push(ProfilePageComponent);
  }

  deleteGame(game: Game): void{
    this.userDataService.deleteGame(game);
  }

  logOut(){
    this.userService.logoutUser();
    this.navCtrl.setRoot(LoginPageComponent);
  }
}
