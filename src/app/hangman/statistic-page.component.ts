import {
  NavController,
  AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import {UserDataService} from "./userdata.service";
import {Game} from "./game.model";

@Component({
  selector: 'statistic-page',
  templateUrl: 'statistic-page.component.html',
})
export class StatisticPageComponent {
  // counter for wins/losses
  sp_wins: number = 0;
  sp_losses: number = 0;
  mp_wins: number = 0;
  mp_losses: number = 0;

  // dictionaries for saving topicName and their recpective amounts
  topicListSP: {[tName: string]: number;} = {}
  topicListMP: {[tName: string]: number;} = {}

  // Bar Charts
  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  barChartLabels: string[] = ['SinglePlayer', 'MultiPlayer'];
  barChartType: string = 'bar';
  barChartLegend: boolean = true;
  barChartData: any[] = [];
  barChartColors: any[] = [{backgroundColor: ["#fd4545", "#969696"]}];

  // Doughnut Charts
  doughnutChartType: string = 'doughnut';
  // some random colors generated for 12 different topics
  doughnutChartColors: any[] =  [{backgroundColor: ["#7a9efa", "#b698b2", "#94dde7", "#0db59e",
                                                            "#f586ad", "#f586ed", "#45a73a", "#d1e734",
                                                            "#7a9efa", "#a85903", "#64da85", "#ccc67b"]}];

  // Single Player (initialized later)
  doughnutChartLabelsSP: string[] = [];
  doughnutChartDataSP: number[] = [];
  // Multi Player (initialized later)
  doughnutChartDataMP: number[] = [];
  doughnutChartLabelsMP: string[] = [];

  constructor(private userDataService: UserDataService, public nav: NavController, public alertCtrl: AlertController) {
    userDataService.findGames().subscribe(                // iterate over all games of user
      (games: Game[]) => {
        games.forEach((game) => {
          if (game.singleplayer) {                        // SinglePlayer
            if (game.topic != null) {                     // topic=undefined -> invalid
              if (game.topic in this.topicListSP) {
                this.topicListSP[game.topic]++;           // if topic exists increment
              } else {
                this.topicListSP[game.topic] = 1;         // else create new record in dict
              }
            }
            if (game.badChars <= 9) {                     // convention: loss at > 9
              this.sp_wins++;
            } else {
              this.sp_losses++;
            }
          } else if (game.badCharsOpponent != null) {     // MultiPlayer (only if badChars != null the game is finished)
            if (game.topic != null) {                     // topic=undefined -> invalid
              if (game.topic in this.topicListMP) {
                this.topicListMP[game.topic]++;           // if topic exists increment
              } else {
                this.topicListMP[game.topic] = 1;         // else create new record in dict
              }
              if (game.badChars < game.badCharsOpponent) {// if your badChars < opponent.badChars -> win
                this.mp_wins++;
              } else {
                this.mp_losses++;
              }
            }
          }
        });
      }
    );

    this.barChartData = [                                         // load countet wins/losses into barChart
      {data: [this.sp_wins, this.mp_wins], label: 'Siege'},
      {data: [this.sp_losses, this.mp_losses], label: 'Niederlagen'}
    ];

    // Singleplayer
    for (var key in this.topicListSP) {                           // load Single Player Topics
      this.doughnutChartLabelsSP.push(key)
      this.doughnutChartDataSP.push(this.topicListSP[key])
    }
    if(this.doughnutChartDataSP.length == 0) {                    // if no topics are found
      this.doughnutChartLabelsSP.push('Noch keine Spiele')
      this.doughnutChartDataSP.push(0)
    }
    // MultiPlayer
    for (var key in this.topicListMP) {                           // load Multi Player Topics
      this.doughnutChartLabelsMP.push(key)
      this.doughnutChartDataMP.push(this.topicListMP[key])
    }
    if(this.doughnutChartDataMP.length == 0) {                    // if no topics are found
      this.doughnutChartLabelsMP.push('Noch keine Spiele')
      this.doughnutChartDataMP.push(0)
    }
  }
}
