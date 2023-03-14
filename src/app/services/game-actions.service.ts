import { Injectable } from '@angular/core';
import {GameStorageService} from "./game-storage.service";
import * as _ from 'lodash';
import {ICard} from "../models/card";
import {GameUtilsService} from "./game-utils.service";
import {tap} from "rxjs";
import {cards} from "../constants/cards";
import {SoundService} from "./sound.service";

@Injectable({
  providedIn: 'root'
})
export class GameActionsService {
  constructor(private gameStorage: GameStorageService,
              private gemeUtils: GameUtilsService,
              private gameUtils: GameUtilsService,
              private sound: SoundService) {}

  get myHand() {
    return this.gameStorage.myHand;
  };

  get opponentHand() {
    return this.gameStorage.opponentHand;
  };

  async startGame() {
    this.gameStorage.deck = this.gameUtils.shuffleDeck(cards);

    this.gameStorage.gameProcess = true;
    await this.gameUtils.deal();

    const myTurn = this.gameUtils.checkTurn();
    !myTurn && this.opponentAttack();
  }

  endGame() {
    console.log('end game');
    this.gameStorage.gameProcess = false;
    this.gameStorage.myHand.length = 0;
    this.gameStorage.opponentHand.length = 0;
    this.gameUtils.battleSetClear();
    this.sound.result();
  }

  async myAttack(card: ICard) {
    console.log('my attack');

    if (!this.opponentHand.length) {
      this.gameStorage.myTurn.next(false);
      this.gameStorage.myAttackTurn.next(false);
      this.opponentAttack();
      return;
    }

    if (this.gameStorage.battleSet.length && !_.find(this.gameStorage.battleSet, { value: card.value })) {
      return;
    }

    this.gameUtils.battleSetUpdate(card);
    _.remove(this.myHand, card);

    await this.sound.action();

    this.gameStorage.myTurn.next(false);
    this.opponentStruggle();
  }

  async myStruggle(card: ICard) {
    console.log('my strugle');
    const attackCard = this.gameStorage.battleSet[this.gameStorage.battleSet.length - 1];
    if (card.weight < attackCard.weight || (card.suit !== attackCard.suit && card.suit !== this.gameStorage.gameTrump )) {
      return;
    }

    card.parentId = attackCard.id;
    this.gameUtils.battleSetUpdate(card);
    _.remove(this.myHand, card);
    await this.sound.action();
    this.gameStorage.myTurn.next(false);
    this.opponentAttack();
  }

  async myAttackComplete() {
    console.log('my attack complete');
    this.gameUtils.battleSetClear();
    await this.sound.action();
    await this.gemeUtils.deal(true);
    this.gameStorage.myTurn.next(false);
    this.gameStorage.myAttackTurn.next(false);

    this.opponentAttack();
  }

  async myPickUp() {
    console.log('my pick up');
    const backSet = [...this.gameStorage.battleSet];
    _.each(backSet, card => {
      delete card.parentId;
      this.myHand.push(card);
    });
    this.gameUtils.battleSetClear();
    await this.sound.action();
    await this.gemeUtils.deal();
    this.gameStorage.myTurn.next(false);

    this.opponentAttack();
  }

  async opponentAttack() {
    console.log('opponent attack');
    await this.gameUtils.actionDelay(1000);

    const attackEnd = async () => {
      this.gameUtils.battleSetClear();
      this.gameStorage.myAttackTurn.next(true);
      await this.gemeUtils.deal();
    };

    if (!this.myHand.length && !this.gameStorage.deck.length) {
      this.gameStorage.endGameMessage = 'Congratulations, you have won the game!';
      this.endGame();
      return;
    }

    if (!this.myHand.length) {
      await attackEnd();
      return;
    }

    if (!this.opponentHand.length) {
      this.gameStorage.endGameMessage = 'Sorry, you have lost the game!';
      this.endGame();
      return;
    }

    if (this.gameStorage.battleSet.length) {
      const existCards: any = [] ;
      _.each(this.gameStorage.battleSet, bCard => {
        existCards.push(_.find(this.opponentHand, { value: bCard.value }));
      });
      const attackCard = existCards.length && _.sortBy(existCards, 'weight')[0];
      if (attackCard) {
        this.gameUtils.battleSetUpdate(attackCard);
        _.remove(this.opponentHand, attackCard);
      } else {
        await attackEnd();
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
        this.gameUtils.battleSetUpdate(minPairCard);
        _.remove(this.opponentHand, minPairCard);
      } else {
        this.gameUtils.battleSetUpdate(minCard);
        _.remove(this.opponentHand, minCard);
      }
    }

    await this.sound.action();
    this.gameStorage.myTurn.next(true);
  }

  async opponentStruggle() {
    console.log('opponent strugle');
    const cardForAnswer = (card: ICard) => {
      const bySuit = _.find(_.orderBy(this.opponentHand, 'weight'), ocard => {
        return ocard.suit === card.suit && ocard.weight > card.weight;
      });
      const byTrump = _.find(_.orderBy(this.opponentHand, 'weight'), ocard => {
        return ocard.suit === this.gameStorage.gameTrump && ocard.weight > card.weight;
      });
      return bySuit || byTrump;
    };

    const attackCard = this.gameStorage.battleSet[this.gameStorage.battleSet.length - 1];
    const batCard = attackCard && cardForAnswer(attackCard);

    await this.gameUtils.actionDelay(1000);
    if (batCard) {
      batCard.parentId = attackCard.id;
      this.gameUtils.battleSetUpdate(batCard);
      _.remove(this.opponentHand, batCard);
      await this.sound.action();
    } else {
      const backSet = [...this.gameStorage.battleSet];
      _.each(backSet, card => {
        delete card.parentId;
        this.opponentHand.push(card);
      });
      this.gameUtils.battleSetClear();
      await this.sound.action();
      await this.gemeUtils.deal(true);
    }

    this.gameStorage.myTurn.next(true);

    if (!this.myHand.length && this.gameStorage.deck.length) {
      await this.myAttackComplete();
    }

    if (!this.myHand.length && !this.gameStorage.deck.length) {
      this.gameStorage.endGameMessage = 'Congratulations, you have won the game!';
      this.endGame();
    }
  }
}
