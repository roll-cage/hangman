import {Component, ViewChild} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {UsernamesService} from "./usernames.service";
import {Keyboard} from "ionic-native";

@Component({
  selector: 'userpicker-page',
  templateUrl: 'userpicker-page.component.html',
  providers: [UsernamesService]
})

export class UserPickerPageComponent {
  usernameEntered: string;
  usernameWrong: boolean = false;
  @ViewChild('usernameInput') usernameInput ;
  constructor(public viewCtrl: ViewController, private usernamesService: UsernamesService){}

  ionViewDidLoad() {
    setTimeout(()=>{
        this.usernameInput.setFocus();
        Keyboard.show();
      }, 400);
  }

  eventHandler(keyCode: number): void{
    if(keyCode == 13){
      this.checkUsername();
    }
  }

  checkUsername(): void{
    if(this.usernamesService.checkUsername(this.usernameEntered)){
      //let player pick topic
      this.viewCtrl.dismiss(this.usernameEntered);
    } else {
      this.usernameWrong = true;
    }
  }
}
