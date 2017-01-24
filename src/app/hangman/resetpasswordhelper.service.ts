import firebase from 'firebase';

export class ResetPasswordHelper {
  public static resetPassword(email: string){
    firebase.auth().sendPasswordResetEmail(email);
  }
}
