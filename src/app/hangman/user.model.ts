import {Game} from "./game.model";
export class User {
  name: string;
  activeGames: Game[];
  pastGames: Game[];
  //TODO: Add achievments
  constructor(name?: string){
    this.name = name;
  }
}
