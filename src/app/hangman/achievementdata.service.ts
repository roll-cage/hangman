import {Injectable} from '@angular/core';
import {Achievement} from "./achievement.model";
import {Observable} from "rxjs";
import {FirebaseListObservable, AngularFire} from "angularfire2";

@Injectable()
export class AchievementDataService {
  fbAchievs: FirebaseListObservable<any[]>;   // observable
  achievs: Observable<Achievement[]>;         // observable achievement-list
  achievList: Achievement[];                  // achievement-list

  /**
   * Initializes variables for usage
   * @param af
   */
  constructor(private af: AngularFire) {
    this.fbAchievs = af.database.list('/achievement');
    // load every achievement
    this.achievs = this.fbAchievs.map(
      (fbAchievs: any[]): Achievement[] => {
        return fbAchievs.map(
          fbItem => {
            return new Achievement(fbItem.$key, fbItem.title, fbItem.text, fbItem.points);
          })
      });
    // load achievement-list
    this.achievs.subscribe(
      (achiev: Achievement[])=> {
        this.achievList = achiev;
      }
    );
  }

  /**
   * Returns an observable of all achievements
   * @returns {Observable<Achievement[]>}
   */
  findAchievs(): Observable<Achievement[]> {
    return this.achievs;
  }

  /**
   * Returns an achievement-object by given firebase-id.
   * Returns null if no achievement with given firebase-id in achievement-list.
   * @param id
   * @returns {Achievement}
   */
  findAchievByID(id: string): Achievement {
    return this.achievList.filter(x => x.id == id)[0];
  }

  /**
   * Stores an achievement into db
   * @param achiev
   */
  persist(achiev: Achievement): void {
    this.fbAchievs.push(achiev);
  }

  /**
   * Deletes an achievement from db by firebase-id
   * @param id
   */
  delete(id: any): void {
    this.fbAchievs.remove(id);
  }

  /**
   * Updates an achievement with achievement by param
   * @param achiev
   */
  update(achiev: Achievement): void {
    this.fbAchievs.update(achiev.id, achiev);
  }
}
