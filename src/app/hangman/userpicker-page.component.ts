import {Component, ViewChild} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';
import {UsernamesService} from "./usernames.service";

@Component({
  selector: 'userpicker-page',
  templateUrl: 'userpicker-page.component.html',
  providers: [UsernamesService]
})

export class UserPickerPageComponent {
  usernameEntered: string;
  usernameWrong: boolean = false;
  constructor(public viewCtrl: ViewController, private usernamesService: UsernamesService){}

  checkUsername(): void{
    if(this.usernamesService.checkUsername(this.usernameEntered)){
      //let player pick topic
      this.viewCtrl.dismiss();
    } else {
      this.usernameWrong = true;
    }
  }
}
