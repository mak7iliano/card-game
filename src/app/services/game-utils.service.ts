import { Injectable } from '@angular/core';
import {ICard} from "../models/card";
import * as _ from 'lodash';
import {GameStorageService} from "./game-storage.service";
import {tap} from "rxjs";
import {GameActionsService} from "./game-actions.service";

@Injectable({
  providedIn: 'root'
})
export class GameUtilsService {
  constructor(private gameStorage: GameStorageService) {}

  get deck() {
    return this.gameStorage.deck
  }

  get myHand() {
    return this.gameStorage.myHand
  }

  get opponentHand() {
    return this.gameStorage.opponentHand
  }

  get gameTrump() {
    return this.gameStorage.gameTrump
  }

  set gameTrump(value) {
    this.gameStorage.gameTrump = value;
  }

  shuffleDeck(list: ICard[]) {
    return list.sort((a, b) => 0.5 - Math.random());
  }

  updateCardWeight() {
    const lastCard = this.deck[this.deck.length - 1];
    this.gameTrump = lastCard.suit;
    const trumpList = _.filter(this.deck, { suit: this.gameTrump });
    _.each(trumpList, card => card.weight *= 10);
  }
  checkTurn() {
    const myTrumps = _.map(_.filter(this.myHand, { suit: this.gameTrump }), it => {
      return {
        weight: it.weight,
        my: true
      }
    });
    const opponentTrumps = _.map(_.filter(this.opponentHand, { suit: this.gameTrump }), it => {
      return {
        weight: it.weight,
        my: false
      }
    });
    const minTrump = _.minBy([...myTrumps, ...opponentTrumps], 'weight');
    // const myTurn = minTrump?.my || false;
    const myTurn = false;
    this.gameStorage.myTurn.next(myTurn);
    this.gameStorage.myAttackTurn.next(myTurn);
    return myTurn;
  }

  async deal(dealToMe = false) {
    while ((this.myHand.length < 6 || this.opponentHand.length < 6) && this.deck.length) {
      const currentCard: any = this.deck.shift();
      if (dealToMe) {
        this.myHand.push(currentCard);
      } else {
        this.opponentHand.push(currentCard);
      }
      dealToMe = !dealToMe;

      await this.actionDelay(100);
    }
  }

  actionDelay(delay = 2000) {
    return new Promise<void>(resolve => {
      setTimeout(() => resolve(), delay);
    })
  }
}
