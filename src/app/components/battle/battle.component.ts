import {Component, Input} from '@angular/core';
import {ICard} from "../../models/card";
import {GameStorageService} from "../../services/game-storage.service";
import * as _ from 'lodash';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss']
})
export class BattleComponent {
  @Input() set: any

  constructor(private gameStorage: GameStorageService) {}

  getBatCard = (card: ICard) => {
    return _.find(this.gameStorage.battleSet, { parentId: card.id });
  }
}
