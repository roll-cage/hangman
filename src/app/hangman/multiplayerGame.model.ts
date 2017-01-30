export class MPGame{
  id: string;
  topic: string;
  word: string;
  badChars: number;
  username: string;
  opponent: string;
  constructor(id: string, topic: string, word: string, badChars: number, username: string, opponent: string){
    this.id = id;
    this.topic = topic;
    this.word = word;
    this.badChars = badChars;
    this.username = username;
    this.opponent = opponent;
  }
}
