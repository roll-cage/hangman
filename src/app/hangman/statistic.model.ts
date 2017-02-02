export class Statistics{

  sp: [number, number] = [0,0]
  mp: [number, number] = [0,0]

  constructor(sp?:[number, number], mp?:[number, number]) {
    // init sp and mp with given wins and losses, or with 0/0
    this.sp = sp ? sp : [0,0]
    this.mp = mp ? mp : [0,0]
  }

  add_sp_win() {this.sp[0]++}
  add_mp_win() {this.mp[0]++}
  add_sp_loss() {this.sp[1]++}
  add_mp_loss() {this.mp[1]++}
  get_sp_win():number {return this.sp[0]}
  get_mp_win():number {return this.mp[0]}
  get_sp_loss():number {return this.sp[1]}
  get_mp_loss():number {return this.sp[1]}
}
