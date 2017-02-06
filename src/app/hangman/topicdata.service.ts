import { Injectable } from '@angular/core';
import {Topic} from "./topic.model";
import {Observable} from "rxjs";
import {FirebaseListObservable, AngularFire} from "angularfire2";

@Injectable()
export class TopicDataService {
  fbTopics: FirebaseListObservable<any[]>;
  topics: Observable<Topic[]>;
  topicList: Topic[];
  constructor(private af: AngularFire) {
    this.fbTopics = af.database.list('/topics');
    this.topics = this.fbTopics.map(
      (fbTopics: any[]): Topic[] => {
        return fbTopics.map(
          fbItem => {
            return new Topic(fbItem.$key, fbItem.name, fbItem.words);
          })
      });
    this.topics.subscribe(
      (topics: Topic[])=> {
        this.topicList = topics;
      }
    );
  }

  getTopicNames(): string[] {
    //if called to early, the topicList is not set. maybe has to be redone
    let topicNames: string[] = [];
      this.topicList.forEach((topic) => {
        topicNames.push(topic.name);
      });
    return topicNames;
  }

  getWordFromTopic(topicName: string): string {
    //if called to early, the topicList is not set. maybe has to be redone
    let words: string[] = this.topicList.find(topic => topic.name == topicName).words;
    return words[Math.floor(Math.random() * words.length)]
  }

  persist(topic: Topic): void {
    this.fbTopics.push(topic);
  }

}
