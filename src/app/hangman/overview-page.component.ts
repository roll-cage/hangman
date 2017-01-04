import {Component} from '@angular/core';
import {NavController} from "ionic-angular";
import {UserService} from "./user.service";
import {User} from "./user.model";
@Component({
  selector: 'overview-page',
  templateUrl: 'overview-page.component.html'
})

export class OverviewPageComponent {
  user: User;
  constructor(public navCtrl: NavController, private userService: UserService){
    /*userService.loadUser();
    userService.getUser().subscribe(
      (user:User)=> {
        this.user = user;
      }
    );
    userService.persist(new User("dieter","testmail","password"));*/
  }

  showProfile(): void {

  }
}
