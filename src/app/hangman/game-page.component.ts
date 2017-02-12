import {NavController, LoadingController, AlertController, NavParams} from "ionic-angular";
import {Component} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "./auth.service";
import {UserDataService} from "./userdata.service";
import {AchievementDataService} from "./achievementdata.service";
import {Game} from "./game.model";
import {MPGameStarterService} from "./multiplayerGameStarter.service";
import {MPGameFinishedService} from "./multiplayerGameFinished.service";
import {MPGame} from "./multiplayerGame.model";
import {AchievementManager} from "./achievement-manager";

@Component({
  selector: 'game-page',
  templateUrl: 'game-page.component.html',
})
export class GamePageComponent {
  topic: string;
  word: string;
  isMultiplayer:boolean;
  isStarter: boolean;
  mpGame: MPGame;
  oponentName:string;
  word_arr:any[]=[];
  letters:any[]=[];
  foundMatchingLetters:number;
  foundWrongLetters:number;
  maxtrys:number;
  imagepath:string;
  imagePath:number[]=[0,1,2,3,4,5,6,7,8,9,10];
  achievManager: AchievementManager;

  constructor(public navParams:NavParams, public navCtrl:NavController, public authData:AuthService, public formBuilder:FormBuilder,
              public alertCtrl:AlertController, public loadingCtrl:LoadingController, public userDataService: UserDataService,
              private mpGameStarterService: MPGameStarterService, private mpGameFinishedService: MPGameFinishedService,
              private achievementDataService: AchievementDataService) {
    this.topic = navParams.data.topic;
    this.word = navParams.data.word;
    this.isMultiplayer = navParams.data.isMultiplayer;
    this.isStarter = navParams.data.isStarter;
    this.mpGame= navParams.data.mpGame;
    this.oponentName = navParams.data.opponentName;
    if(this.mpGame != null){
      this.word = this.mpGame.word;
      this.topic = this.mpGame.topic;
      this.oponentName = this.mpGame.opponent;
    }

    let wordLetters = this.word.split("");
    wordLetters.forEach(letter => {
      this.word_arr.push({is:letter,found:false});
    });
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜß".split("");
    alphabet.forEach(letter => {
      this.letters.push({is:letter,disabled:null});
    });
    this.foundMatchingLetters=0;
    this.maxtrys=10;
    this.foundWrongLetters=0;
    this.achievManager = new AchievementManager(userDataService, achievementDataService, alertCtrl);
  }

  press(letter:any){
    letter.disabled=true;
    let foundOne=false;

    this.word_arr.forEach(wordLetter=>{
      if(wordLetter.is.toLowerCase()===letter.is.toLowerCase()){
        wordLetter.found=true;
        this.foundMatchingLetters++;
        foundOne=true;
      }
    });
    if(!foundOne){
      this.foundWrongLetters++;
      this.imagepath="./images/"+this.foundWrongLetters+".png"
    }

    if(this.foundMatchingLetters>=this.word_arr.length){
      this.endGame(true);
    }
    if(this.foundWrongLetters>=this.maxtrys){
      this.endGame(false);
    }
  }
  endGame(won:boolean) {
    this.letters.forEach(letter => {
      letter.disabled = true;
    });

    let msg = "";
    if (!this.isMultiplayer) {
      let game = new Game(null, this.topic, this.word, this.foundWrongLetters, !this.isMultiplayer, this.oponentName, 0);
      this.userDataService.persistGame(game);
      this.achievManager.checkForNewAchievement(game);

      if(won){
        msg = "Du hast das Spiel zum Wort " + this.word + " gewonnen!";
      } else {
        msg = "Du hast das Spiel zum Wort " + this.word + " verloren!";
      }
    } else {
      if(this.isStarter){
        this.mpGameStarterService.addNewMPGame(new Game(null, this.topic, this.word, this.foundWrongLetters, !this.isMultiplayer, this.oponentName, null));
        this.achievManager.checkForNewAchievement(new Game(null, this.topic, this.word, this.foundWrongLetters, !this.isMultiplayer, this.oponentName, null));
        if(won){
          msg = "Du hast das Spiel zum Wort " + this.word + " gewonnen! Mal sehen, wie dein Gegner abschneidet.";
        } else {
          msg = "Du hast das Spiel zum Wort " + this.word + " verloren! Mal sehen, wie dein Gegner abschneidet.";
        }
      } else {
        this.mpGameStarterService.deleteFinishedMPGame(this.mpGame.id);
        this.userDataService.persistGame(new Game(this.mpGame.id, this.mpGame.topic, this.mpGame.word, this.foundWrongLetters, !this.isMultiplayer, this.mpGame.opponent, this.mpGame.badChars));
        this.achievManager.checkForNewAchievement(new Game(this.mpGame.id, this.mpGame.topic, this.mpGame.word, this.foundWrongLetters, !this.isMultiplayer, this.mpGame.opponent, this.mpGame.badChars));
        this.mpGameFinishedService.addFinishedMPGame(new Game(this.mpGame.id, this.mpGame.topic, this.mpGame.word, this.foundWrongLetters, !this.isMultiplayer, this.mpGame.opponent, null));
        if(this.foundWrongLetters < this.mpGame.badChars){
          msg = "Du hast das Spiel zum Wort " + this.word + " gegen " + this.mpGame.opponent + " gewonnen!";
        } else if(this.foundWrongLetters > this.mpGame.badChars) {
          msg = "Du hast das Spiel zum Wort " + this.word + " gegen " + this.mpGame.opponent + " verloren!";
        } else {
          msg = "Du hast im Spiel zum Wort " + this.word + " genau so viele Fehler gemacht wie Dein Gegner!";
        }
      }
    }

    let confirm = this.alertCtrl.create({
      title: 'Spiel beendet',
      message: msg,
      buttons: [
        {
          text: 'Zurück',
          handler: () => {
            this.navCtrl.pop();
          }
        },
      ]
    });
    confirm.present();
  }
}
