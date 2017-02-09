import { Injectable } from '@angular/core';
import {Achievement} from "./achievement.model";
import {Observable} from "rxjs";
import {FirebaseListObservable, AngularFire} from "angularfire2";

@Injectable()
export class AchievementDataService {
  fbAchievs: FirebaseListObservable<any[]>;
  achievs: Observable<Achievement[]>;
  achievList: Achievement[];

  constructor(private af: AngularFire) {
    this.fbAchievs = af.database.list('/achievement');
    this.achievs = this.fbAchievs.map(
      (fbAchievs: any[]): Achievement[] => {
        return fbAchievs.map(
          fbItem => {
            return new Achievement(fbItem.$key, fbItem.title, fbItem.text, fbItem.points);
          })
      });
    this.achievs.subscribe(
      (achiev: Achievement[])=> {
        this.achievList = achiev;
      }
    );
  }

  findAchievs(): Observable<Achievement[]> {
    return this.achievs;
  }

  findAchievByID(id: string): Achievement {

    return this.achievList.filter(x => x.id == id)[0];
  }

  persist(achiev: Achievement): void {
    this.fbAchievs.push(achiev);
  }

  delete(id: any): void {
    this.fbAchievs.remove(id);
  }

  update(achiev: Achievement): void {
    this.fbAchievs.update(achiev.id, achiev);
  }
}
