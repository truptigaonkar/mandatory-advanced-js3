import { BehaviorSubject } from 'rxjs';

/**
 * Simple token store
 */

export const token$ = new BehaviorSubject(window.localStorage.getItem('token') ||
  null);

export function updateToken(newToken) {
  if (!newToken) {
    window.localStorage.removeItem('token');
  } else {
    window.localStorage.setItem('token', newToken);
  }

  token$.next(newToken);
}



// import {BehaviorSubject} from "rxjs";

// export const token$ = new BehaviorSubject(window.localStorage.getItem("token"));

// export function updateToken(newToken){
    
//     if(newToken === null){
//         window.localStorage.removeItem("token");
//     }else{
//         token$.next(newToken);
//     }
// }


