import {Game} from "./game.model";
export class User {
  name: string;
  email: string;
  password: string;
  activeGames: Game[];
  pastGames: Game[];
  //TODO: Add achievments
  constructor(name: string, email: string, password: string){
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
