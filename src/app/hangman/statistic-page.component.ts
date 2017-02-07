import {
  NavController,
  LoadingController,
  AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from './auth.service';
import {UserDataService} from "./userdata.service";

@Component({
  selector: 'statistic-page',
  templateUrl: 'statistic-page.component.html',
})
export class StatisticPageComponent {
  username:string;
  constructor(private userDataService: UserDataService,public nav: NavController, public authData: AuthService, public formBuilder: FormBuilder,
              public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.username=userDataService.username;
  }

  // Doughnut
  private doughnutChartLabels:string[] = ['Siege', 'Niederlagen'];
  private doughnutChartType:string = 'doughnut';

  // Single Player
  private doughnutChartDataSP:number[] = [26, 3];
  private doughnutChartColorsSP: any[] = [{ backgroundColor: ["#fd4545", "#969696"], hoverBackgroundColor : ["#ea2a2a", "#565353"] }];

  // Multi Player
  private doughnutChartDataMP:number[] = [14, 33];
  private doughnutChartColorsMP: any[] = [{ backgroundColor: ["#fd4545", "#969696"], hoverBackgroundColor : ["#ea2a2a", "#565353"] }];

  // events
  public chartClicked(e:any):void {
  }

  public chartHovered(e:any):void {
  }
}
