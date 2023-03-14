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
  constructor(public gameStorage: GameStorageService, public gameAction: GameActionsService) {}

  myOptions = {
    allowAction: true,
    isVisible: true,
    isMy: true
  };

  opponentOptions = {
    isVisible: true,
    isMy: false
  };

  startGame() {
    this.gameAction.startGame();
  };
}
