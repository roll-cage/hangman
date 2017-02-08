export class Game {
  id: string;
  topic: string;
  word: string;
  badChars: number;
  singleplayer: boolean;
  opponentName: string;
  badCharsOpponent: number;
  visible: boolean;
  constructor (id: string, topic: string, word: string, badChars: number, singleplayer: boolean, opponentName: string, badCharsOpponent: number){
    this.id = id;
    this.topic = topic;
    this.word = word;
    this.badChars = badChars;
    this.singleplayer = singleplayer;
    this.opponentName = opponentName;
    this.badCharsOpponent = badCharsOpponent;
    this.visible = true;
  }
}
