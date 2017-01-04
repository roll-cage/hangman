import {Game} from "./game.model";
export class User {
  user_id: string;
  name: string;
  email: string;
  password: string;
  activeGames: Game[];
  pastGames: Game[];
  //TODO: Add achievments
  constructor(name?: string, email?: string, password?: string){
    this.name = name;
    this.email = email;
    this.password = password;
  }

  public static createWith(user:any): User{
    let newUser: User = new User;
    newUser.name = user.name;
    newUser.email = user.email;
    newUser.password = user.password;
    newUser.activeGames = user.activeGames;
    newUser.pastGames = user.pastGames;
    return newUser;
  }
}
