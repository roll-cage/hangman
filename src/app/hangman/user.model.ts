import {Game} from "./game.model";
import {Achievement} from "./achievement.model";

export class User {
  name: string;
  activeGames: Game[];
  pastGames: Game[];
  achievements: String[];   // only keys are saved

  constructor(name?: string, achievements?: string[]){
    this.name = name;
    this.achievements = achievements;
  }
}
