import {Component, ViewChild} from '@angular/core';
import {Searchbar, ViewController, NavParams} from 'ionic-angular';
import {TopicDataService} from "./topicdata.service";
import {Keyboard} from "ionic-native";

@Component({
  selector: 'topicpicker-page',
  templateUrl: 'topicpicker-page.component.html',
  providers: [TopicDataService]
})

export class TopicPickerPageComponent {
  searchQuery: string = '';
  topics: string[] = [];
  filteredTopics: string[] = [];
  @ViewChild(Searchbar)
  public searchbar: Searchbar;
  constructor(public viewCtrl: ViewController,
              public params: NavParams,
              private topicDataService: TopicDataService) {
    this.topics = topicDataService.getTopicNames();
    this.filteredTopics = this.topics;
  }
  ionViewDidLoad() {
    setTimeout(()=>{
      this.searchbar.setFocus();
      Keyboard.show();
    }, 400);
  }
  doSearch(): void{
    this.filteredTopics = this.topics.filter(m=> (
    m.toLocaleLowerCase().indexOf(this.searchQuery.toLocaleLowerCase()) !== -1));
  }
  clearSearchbar(): void{
    this.searchQuery = '';
    this.filteredTopics = this.topics;
  }
  returnWordFromTopic(topic: string): void{
    let data={
      word:this.topicDataService.getWordFromTopic(topic),
      topic:topic
    };
    this.viewCtrl.dismiss(data);
  }
}
