import { Injectable } from '@angular/core';
import {ICard} from "../models/card";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameStorageService {
  myTurn = new Subject<boolean> ();
  myAttackTurn = new Subject<boolean> ();
  gameTrump: string;
  deck: ICard[] = [];
  myHand: ICard[] = [];
  opponentHand: ICard[] = [];
  battleSet: ICard[] = [];
}
