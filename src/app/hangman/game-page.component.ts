import {NavController, LoadingController, AlertController, NavParams} from "ionic-angular";
import {Component} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "./auth.service";
import {UserDataService} from "./userdata.service";
import {Game} from "./game.model";
import {MPGameStarterService} from "./multiplayerGameStarter.service";
import {MPGameFinishedService} from "./multiplayerGameFinished.service";
import {MPGame} from "./multiplayerGame.model";

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
  gameOver:boolean=false;
  gameWon:boolean=false;
  imagePath:number[]=[0,1,2,3,4,5,6,7,8,9,10];

  constructor(public navParams:NavParams, public navCtrl:NavController, public authData:AuthService, public formBuilder:FormBuilder,
              public alertCtrl:AlertController, public loadingCtrl:LoadingController, public userDataService: UserDataService,
              private mpGameStarterService: MPGameStarterService, private mpGameFinishedService: MPGameFinishedService ) {
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

    console.log(this.topic);
    console.log(this.word);

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

    if (!this.isMultiplayer) {
      let game = new Game(null, this.topic, this.word, this.foundWrongLetters, !this.isMultiplayer, this.oponentName, 0);
      console.log(game);
      this.userDataService.persistGame(game);
    } else {
      if(this.isStarter){
        this.mpGameStarterService.addNewMPGame(new Game(null, this.topic, this.word, this.foundWrongLetters, !this.isMultiplayer, this.oponentName, null));
      } else {
        this.mpGameStarterService.deleteFinishedMPGame(this.mpGame.id);
        this.userDataService.persistGame(new Game(this.mpGame.id, this.mpGame.topic, this.mpGame.word, this.foundWrongLetters, !this.isMultiplayer, this.mpGame.opponent, this.mpGame.badChars));
        this.mpGameFinishedService.addFinishedMPGame(new Game(this.mpGame.id, this.mpGame.topic, this.mpGame.word, this.foundWrongLetters, !this.isMultiplayer, this.mpGame.opponent, null));
      }
    }

    let msg = "Du hast das Spiel gewonnen!";
    if(won) {
      this.gameWon=true;
    } else {
      this.gameOver=true;
      msg = "Du hast das Spiel verloren!";
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
