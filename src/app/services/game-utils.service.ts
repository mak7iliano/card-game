import { Injectable } from '@angular/core';
import {ICard} from "../models/card";
import * as _ from 'lodash';
import {GameStorageService} from "./game-storage.service";
import {SoundService} from "./sound.service";

@Injectable({
  providedIn: 'root'
})
export class GameUtilsService {
  constructor(private gameStorage: GameStorageService, private sound: SoundService) {}

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
    const shuffled = [...list].sort((a, b) => 0.5 - Math.random());

    const lastCard = shuffled[shuffled.length - 1];
    this.gameTrump = lastCard.suit;
    const trumpList = _.filter(shuffled, { suit: this.gameTrump });
    _.each(trumpList, card => card.weight *= 10);


    return shuffled;
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
    const myTurn = minTrump?.my || false;
    this.gameStorage.myTurn.next(myTurn);
    this.gameStorage.myAttackTurn.next(myTurn);
    return myTurn;
  }

  async deal(dealToMe = false) {
    if (this.deck.length) {
      while ((this.myHand.length < 6 || this.opponentHand.length < 6) && this.deck.length) {
        const currentCard: any = this.deck.shift();
        if (dealToMe) {
          this.myHand.push(currentCard);
        } else {
          this.opponentHand.push(currentCard);
        }
        dealToMe = !dealToMe;
        await this.sound.deal();
        await this.actionDelay(500);
      }
    } else {
      await this.actionDelay(100);
    }
  }

  actionDelay(delay = 2000) {
    return new Promise<void>(resolve => {
      setTimeout(() => resolve(), delay);
    })
  }

  battleSetUpdate(card: ICard) {
    this.gameStorage.battleSet = [...this.gameStorage.battleSet, card];
  }

  battleSetClear() {
    this.gameStorage.battleSet = [];
  }
}
