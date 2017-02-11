import {Game} from "./game.model";
import {Achievement} from "./achievement.model";
import {UserDataService} from "./userdata.service";
import {AlertController} from "ionic-angular";
import {AchievementDataService} from "./achievementdata.service";

export class AchievementManager {
  spWins: number = 0;
  mpWins: number = 0;
  other_achievements: Achievement[] = [];
  user_achievements: Achievement[] = [];
  user_games: Game[] = [];

  constructor(private userDataService: UserDataService,
              private achievementDataService: AchievementDataService,
              public alertCtrl: AlertController) {

    achievementDataService.findAchievs().subscribe(                // iterate over all achievements
      (achievs: Achievement[]) => { this.other_achievements = achievs; }
    );

    userDataService.findGames().subscribe(
      (games: Game[]) => { this.user_games = games; }
    );

    userDataService.findAchievIDs().subscribe(
      (a_ID: string[]) => {
        a_ID.forEach((a_ID) => {
          var a: Achievement = achievementDataService.findAchievByID(a_ID);
          if(this.user_achievements.indexOf(a) <= -1){
            this.user_achievements.push(a);
            for (let index in this.other_achievements) {
              if(this.other_achievements[index].id == a.id) {
                this.other_achievements.splice(Number(index), 1);
              }
            }
          }
        });
      }
    );

    this.user_games.forEach(game => {
      if(game.singleplayer && game.badChars < 10) this.spWins++;
      if(!game.singleplayer && game.badChars < game.badCharsOpponent) this.mpWins++;
    });
  }

  userHasAchievement(title: string): boolean {
    this.user_achievements.forEach(achiev => {
      if(achiev.title == title) return true;
    });
    return false;
  }

  checkForNewAchievement(game: Game) {
    var isSPWin: boolean = game.singleplayer && game.badChars < 10;
    var isMPWin: boolean = !game.singleplayer && game.badChars < game.badCharsOpponent;

    if(!isSPWin && !isMPWin) return;  // if loss no achievement
    this.other_achievements.forEach(achiev => {
      var msg: string = "";
      switch (achiev.id) {
        case "-KcThJ3rVn1Oc1Mr91PK":    // 10 Wins
          if ((this.spWins + this.mpWins) == 9) msg = "Du hast 10 Spiele in einem beliebigen Modus gewonnen!";
          break;
        case "-KcThJ3t7xg9-PGxaWm6":    // 100 Wins
          if ((this.spWins + this.mpWins) == 99) msg = "Du hast 100 Spiele in einem beliebigen Modus gewonnen!";
          break;
        case "-KcThJ3t7xg9-PGxaWm7":    // 50 Wins in SP
          if (isSPWin && this.spWins == 49) msg = "Du hast 50 Spiele im Single Player Modus gewonnen!";
          break;
        case "-KcThJ3t7xg9-PGxaWm8":    // 50 Wins in MP
          if (isMPWin && this.mpWins == 49) msg = "Du hast 50 Spiele im Multi Player Modus gewonnen!";
          break;
        case "-KcThJ3uP4MRWuF-s_w6":    // Win with no badChars
          if (game.badChars == 0) msg = "Du hast ein Spiel ohne einen falschen Buchstaben gewonnen!";
          break;
        default:
          console.log("ERROR: unimplemented achievement!");
      }

      if (msg != "") {
        let alert = this.alertCtrl.create({
          title: '[Errungenschaft]',
          subTitle: msg,
          buttons: ['OK']
        });
        alert.present();
        this.userDataService.persistAchiev(achiev.id, achiev.points);   // store achievement in database
      }
    });
  }
}

