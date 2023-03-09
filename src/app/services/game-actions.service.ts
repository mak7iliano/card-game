import { Injectable } from '@angular/core';
import {GameStorageService} from "./game-storage.service";
import * as _ from 'lodash';
import {ICard} from "../models/card";
import {GameUtilsService} from "./game-utils.service";
import {tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameActionsService {
  constructor(private gameStorage: GameStorageService, private gemeUtils: GameUtilsService) {}

  get battleSet() {
    return this.gameStorage.battleSet;
  };

  set battleSet(value) {
    this.gameStorage.battleSet = value;
  };

  get myHand() {
    return this.gameStorage.myHand;
  };

  get opponentHand() {
    return this.gameStorage.opponentHand;
  };

  myAttack(card: ICard) {
    if (this.gameStorage.battleSet.length && !_.find(this.gameStorage.battleSet, { value: card.value })) {
      return;
    }

    this.gameStorage.battleSet.push(card); //TODO: move to function
    _.remove(this.myHand, card);

    this.gameStorage.myTurn.next(false);
    this.opponentStruggle();
  }

  myStruggle(card: ICard) {
    const attackCard = this.gameStorage.battleSet[this.gameStorage.battleSet.length - 1];
    if (card.weight < attackCard.weight || (card.suit !== attackCard.suit && card.suit !== this.gameStorage.gameTrump )) {
      return;
    }

    card.parentId = attackCard.id;
    this.gameStorage.battleSet.push(card);
    _.remove(this.myHand, card);
    this.gameStorage.myTurn.next(false);
    this.opponentAttack();
  }

  async myAttackComplete() {
    this.gameStorage.battleSet.length = 0;
    await this.gemeUtils.deal(true);
    this.gameStorage.myTurn.next(false);
    this.gameStorage.myAttackTurn.next(false);

    this.opponentAttack();
  }

  async myPickUp() {
    const backSet = [...this.gameStorage.battleSet];
    _.each(backSet, card => {
      delete card.parentId;
      this.myHand.push(card);
    });
    this.gameStorage.battleSet.length = 0;

    await this.gemeUtils.deal();
    this.gameStorage.myTurn.next(false);

    this.opponentAttack();
  }

  async opponentAttack() {
    if (this.gameStorage.battleSet.length) {
      const existCards: any = [] ;
      _.each(this.gameStorage.battleSet, bCard => {
        existCards.push(_.find(this.opponentHand, { value: bCard.value }));
      });
      const attackCard = existCards.length && _.sortBy(existCards, 'weight')[0];
      if (attackCard) {
        this.gameStorage.battleSet.push(attackCard);
        _.remove(this.opponentHand, attackCard);
      } else {
        // otboi
        this.gameStorage.battleSet.length = 0;
        this.gameStorage.myAttackTurn.next(true);
        await this.gemeUtils.deal();
      }
    } else {
      const findMinPair = () => {
        const groups = _.groupBy(this.opponentHand, 'value');
        const pairs = _.filter(_.toArray(groups),  (value) => value.length > 1 && !_.find(value, it => it.weight > 20));
        return pairs.length && pairs[0] || [];
      }
      const minCard = _.sortBy(this.opponentHand, 'weight')[0];
      const minPairCard = findMinPair()[0];

      if (minPairCard && minPairCard.weight - minCard.weight < 2) {
        this.gameStorage.battleSet.push(minPairCard);
        _.remove(this.opponentHand, minPairCard);
      } else {
        this.gameStorage.battleSet.push(minCard);
        _.remove(this.opponentHand, minCard);
      }
    }

    this.gameStorage.myTurn.next(true);
  }

  async opponentStruggle() {
    const cardForAnswer = (card: ICard) => {
      const bySuit = _.find(_.orderBy(this.opponentHand, 'weight'), ocard => {
        return ocard.suit === card.suit && ocard.weight > card.weight;
      });
      const byTrump = _.find(_.orderBy(this.opponentHand, 'weight'), ocard => {
        return ocard.suit === this.gameStorage.gameTrump;
      });
      return bySuit || byTrump;
    };

    if (this.gameStorage.battleSet.length) {
      const attackCard = this.gameStorage.battleSet[this.gameStorage.battleSet.length - 1];
      const batCard = attackCard && cardForAnswer(attackCard);

      if (batCard) {
        batCard.parentId = attackCard.id;
        this.gameStorage.battleSet.push(batCard);
        _.remove(this.opponentHand, batCard);
      } else {
        const backSet = [...this.gameStorage.battleSet];
        _.each(backSet, card => {
          delete card.parentId;
          this.opponentHand.push(card);
        });
        this.gameStorage.battleSet.length = 0;

        await this.gemeUtils.deal(true);
      }
    }

    this.gameStorage.myTurn.next(true);
  }
}
