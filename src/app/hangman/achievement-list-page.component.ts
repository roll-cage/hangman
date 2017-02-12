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
  achiev_Points: number = 0;          // counter for points of unlocked achievements
  all_Achievs: Achievement[] = [];    // contains every achievement
  user_Achievs: Achievement[] = [];   // contains all achievements unlocked by user
  isSearching: boolean = false;       // switch of searchbar (html)
  _searchbar;                         // searchbar
  searchQuery: string = '';           // typed string to search for
  filtered_all_Achievs: Achievement[] = [];   // all achievements filtered by searchQuery
  filtered_user_Achievs: Achievement[] = [];  // all user achievements filtered by searchQuery

  // timeout for correct visibilty
  @ViewChild(Searchbar)
  set searchBar(sb: Searchbar) {
    this._searchbar = sb;
    if(sb) {
      setTimeout(()=>{sb.setFocus()},0);
    }
  }
  constructor(private userDataService: UserDataService, private achievementDataService: AchievementDataService,
              public nav: NavController, public alertCtrl: AlertController) {

    // load all achievements
    achievementDataService.findAchievs().subscribe(
      (achievs: Achievement[]) => { this.all_Achievs = achievs; }
    );

    // load all achievements unlocked by user
    userDataService.findAchievIDs().subscribe(
      (a_ID: string[]) => {
        a_ID.forEach((a_ID) => {
          var a: Achievement = achievementDataService.findAchievByID(a_ID);
          if(this.user_Achievs.indexOf(a) <= -1){
            this.user_Achievs.push(a);
            this.achiev_Points += a.points;

            for (let index in this.all_Achievs) {
              if(this.all_Achievs[index].id == a.id) {
                // delete unlocked achievement from list of not unlocked achievements
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

  /**
   * Enable searchbar
    */
  showAchievs(): void {
    this.isSearching = true;
  }

  /**
   * Set filtered achievements (all/user) by searchQuery
   */
  doSearch() {
    this.filtered_all_Achievs = this.all_Achievs.filter(
      achiev => achiev.title.indexOf(this.searchQuery) != -1 ||
        achiev.text.indexOf(this.searchQuery) != -1);
    this.filtered_user_Achievs = this.user_Achievs.filter(
      achiev => achiev.title.indexOf(this.searchQuery) != -1 ||
      achiev.text.indexOf(this.searchQuery) != -1);
  }

  /**
   * Clear searchQuery and reset filtered achievments (all/user)
   */
  clearSearchbar() {
    this.searchQuery = '';
    this.filtered_all_Achievs = this.all_Achievs;
    this.filtered_user_Achievs = this.user_Achievs;
  }

  /**
   * Disable searchbar
   */
  public cancel():void{
    this.isSearching=false;
  }
}
