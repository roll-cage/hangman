export class Topic{
  id: string;
  name: string;
  words: string[];
  constructor(id: string, name: string, words: string[]){
    this.id = id;
    this.name = name;
    this.words = words;
  }
}
