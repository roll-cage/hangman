export class Achievement {
  id:string;
  title:string;
  text:string;
  points:number;

  constructor(id:string, title:string, text:string, points:number) {
    this.id = id;
    this.title = title;
    this.text = text;
    this.points = points;
  }
}
