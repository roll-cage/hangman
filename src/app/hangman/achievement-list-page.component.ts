import {NavController, AlertController, Searchbar} from 'ionic-angular';
import {Component, ViewChild} from '@angular/core';
import {AchievementDataService} from "./achievementdata.service";
import {Achievement} from './achievement.model';

@Component({
  selector: 'achievement-page',
  templateUrl: 'achievement-list-page.component.html',
})
export class AchievementPageComponent {
  achievs: Achievement[] = [];
  isSearching: boolean = false;
  _searchbar;

  searchQuery: string = '';
  filteredAchievs: Achievement[] = [];

  @ViewChild(Searchbar)
  set searchBar(sb: Searchbar) {
    this._searchbar = sb;
    if(sb) {
      setTimeout(()=>{sb.setFocus()},0);
    }
  }
  constructor(private achievementDataService: AchievementDataService, public nav: NavController, public alertCtrl: AlertController) {
    achievementDataService.findAchievs().subscribe(                // iterate over all achievements
      (achiev: Achievement[]) => {
        achiev.forEach((achiev) => {
          this.achievs.push(achiev);
        });
      }
    );
    this.filteredAchievs = this.achievs;
  }

  showAchievs(): void {
    this.isSearching = true;
  }

  doSearch() {
    this.filteredAchievs = this.achievs.filter(
      achiev => achiev.title.indexOf(this.searchQuery) != -1 ||
        achiev.text.indexOf(this.searchQuery) != -1);
  }
  clearSearchbar() {
    this.searchQuery = '';
    this.filteredAchievs = this.achievs;
  }

  public cancel():void{
    this.isSearching=false;
  }
}
