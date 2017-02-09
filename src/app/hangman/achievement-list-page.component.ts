import {NavController, AlertController, Searchbar} from 'ionic-angular';
import {Component, ViewChild} from '@angular/core';
import {UserDataService} from "./userdata.service";
import {AchievementDataService} from "./achievementdata.service";
import {Achievement} from './achievement.model';

@Component({
  selector: 'achievement-page',
  templateUrl: 'achievement-list-page.component.html',
})
export class AchievementPageComponent {
  achiev_Points: number = 0;
  all_Achievs: Achievement[] = [];
  user_Achievs: Achievement[] = [];
  isSearching: boolean = false;
  _searchbar;

  searchQuery: string = '';
  filtered_all_Achievs: Achievement[] = [];
  filtered_user_Achievs: Achievement[] = [];

  @ViewChild(Searchbar)
  set searchBar(sb: Searchbar) {
    this._searchbar = sb;
    if(sb) {
      setTimeout(()=>{sb.setFocus()},0);
    }
  }
  constructor(private userDataService: UserDataService, private achievementDataService: AchievementDataService,
              public nav: NavController, public alertCtrl: AlertController) {

    achievementDataService.findAchievs().subscribe(                // iterate over all achievements
      (achievs: Achievement[]) => { this.all_Achievs = achievs; }
    );

    userDataService.findAchievIDs().subscribe(
      (a_ID: string[]) => {
        a_ID.forEach((a_ID) => {
          var a: Achievement = achievementDataService.findAchievByID(a_ID);
          if(this.user_Achievs.indexOf(a) <= -1){
            this.user_Achievs.push(a);
            this.achiev_Points += a.points;

            for (let index in this.all_Achievs) {
              if(this.all_Achievs[index].id == a.id) {
                this.all_Achievs.splice(Number(index), 1);
              }
            }
          }
        });
      }
    );
    this.filtered_user_Achievs = this.user_Achievs;
    this.filtered_all_Achievs = this.all_Achievs;
  }

  showAchievs(): void {
    this.isSearching = true;
  }

  doSearch() {
    this.filtered_all_Achievs = this.all_Achievs.filter(
      achiev => achiev.title.indexOf(this.searchQuery) != -1 ||
        achiev.text.indexOf(this.searchQuery) != -1);
    this.filtered_user_Achievs = this.user_Achievs.filter(
      achiev => achiev.title.indexOf(this.searchQuery) != -1 ||
      achiev.text.indexOf(this.searchQuery) != -1);
  }
  clearSearchbar() {
    this.searchQuery = '';
    this.filtered_all_Achievs = this.all_Achievs;
    this.filtered_user_Achievs = this.user_Achievs;
  }

  public cancel():void{
    this.isSearching=false;
  }
}
