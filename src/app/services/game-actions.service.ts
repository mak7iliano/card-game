import { Injectable } from '@angular/core';
import {GameStorageService} from "./game-storage.service";
import * as _ from 'lodash';
import {ICard} from "../models/card";
import {GameUtilsService} from "./game-utils.service";

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

  myAttack(card: any) {
    if (this.battleSet.length && !_.find(this.battleSet, { value: card.value })) {
      return;
    }

    this.battleSet.push(card);
    _.remove(this.gameStorage.myHand, card);

    this.gameStorage.myTurn.next(false);
    this.opponentStruggle();
  }

  opponentStruggle() {
    const cardForAnswer = (card: ICard) => {
      const bySuit = _.find(_.orderBy(this.gameStorage.opponentHand, 'weight'), ocard => {
        return ocard.suit === card.suit && ocard.weight > card.weight;
      });
      const byTrump = _.find(_.orderBy(this.gameStorage.opponentHand, 'weight'), ocard => {
        return ocard.suit === this.gameStorage.gameTrump;
      });
      return bySuit || byTrump;
    };

    if (this.battleSet.length) {
      const attackCard = this.battleSet[this.battleSet.length - 1];
      const batCard = attackCard && cardForAnswer(attackCard);

      if (batCard) {
        batCard.parentId = attackCard.id;
        this.battleSet.push(batCard);
        _.remove(this.gameStorage.opponentHand, batCard);
      } else {
        const backSet = [...this.battleSet];
        _.each(backSet, card => {
          delete card.parentId;
          this.gameStorage.opponentHand.push(card);
        });
        this.battleSet.length = 0;

        this.gemeUtils.deal(true);
      }
    }

    this.gameStorage.myTurn.next(true);
  }
}
