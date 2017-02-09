import {NavController, LoadingController, AlertController, NavParams} from "ionic-angular";
import {Component} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "./auth.service";


@Component({
  selector: 'game-page',
  templateUrl: 'game-page.component.html',
})
export class GamePageComponent {
  isMultiplayer:boolean;
  oponentName:string;
  word:any[]=[];
  letters:any[]=[];
  foundMatchingLetters:number;
  foundWrongLetters:number;
  maxtrys:number;
  imagepath:string;

  constructor(public navParams:NavParams, public navCtrl:NavController, public authData:AuthService, public formBuilder:FormBuilder,
              public alertCtrl:AlertController, public loadingCtrl:LoadingController) {
    this.isMultiplayer = navParams.data.isMultiplayer;
    this.oponentName = navParams.data.opponentName;
    console.log(navParams.data.word);

    let wordLetters=navParams.data.word.split("");
    wordLetters.forEach(letter => {
      this.word.push({is:letter,found:false});
    });
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜß".split("");
    alphabet.forEach(letter => {
      this.letters.push({is:letter,disabled:null});
    });
    this.foundMatchingLetters=0;
    this.maxtrys=5;
    this.foundWrongLetters=0;

  }

  press(letter:any){
    letter.disabled=true;
    let foundOne=false;

    this.word.forEach(wordLetter=>{

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


    if(this.foundMatchingLetters>=this.word.length){
      console.log("Gewonnen")
    }
    if(this.foundWrongLetters>=this.maxtrys){
      console.log("Verloren")
    }
  }
}
