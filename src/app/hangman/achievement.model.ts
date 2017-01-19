export class Achievement {
  title:string;
  text:string;
  points:number;

  constructor(title:string, text:string, points:number) {
    this.title = title;
    this.text = text;
    this.points = points;
  }
}
