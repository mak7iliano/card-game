import {Component} from '@angular/core';
import { cards } from './constants/cards';
import { GameUtilsService } from "./services/game-utils.service";
import {GameStorageService} from "./services/game-storage.service";
import {GameActionsService} from "./services/game-actions.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(private gameUtils: GameUtilsService, public gameStorage: GameStorageService, public gameAction: GameActionsService) {}

  myHand = this.gameStorage.myHand;
  myOptions = {
    allowAction: true,
    isVisible: true,
    isMy: true
  };

  opponentHand = this.gameStorage.opponentHand;
  opponentOptions = {
    isVisible: true,
    isMy: false
  };

  deck = this.gameStorage.deck;
  battleSet = this.gameStorage.battleSet;

  gameProcess = false;

  async startGame() {
    this.deck = this.gameStorage.deck = this.gameUtils.shuffleDeck(cards);

    this.gameUtils.updateCardWeight()

    this.gameProcess = true;
    await this.gameUtils.deal();

    const myTurn = this.gameUtils.checkTurn();
    !myTurn && this.gameAction.opponentAttack(); //TODO: rework for watcher
  };
}
