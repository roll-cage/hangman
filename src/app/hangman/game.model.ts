import {Topic} from "./topic.model";
export class Game {
  id: string;
  topic: Topic;
  word: string;
  singleplayer: boolean;
  constructor (id: string, topic: Topic, word: string, singleplayer: boolean){
    this.id = id;
    this.topic = topic;
    this.word = word;
    this.singleplayer = singleplayer;
  }
}
