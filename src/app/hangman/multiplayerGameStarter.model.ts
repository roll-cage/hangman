export class MPGameStarter{
  id: string;
  topic: string;
  word: string;
  badChars: number;
  gameId: string;
  username: string;
  opponent: string;
  constructor(id: string, topic: string, word: string, badChars: number, gameId: string, username: string, opponent: string){
    this.id = id;
    this.topic = topic;
    this.word = word;
    this.badChars = badChars;
    this.gameId = gameId;
    this.username = username;
    this.opponent = opponent;
  }
}
