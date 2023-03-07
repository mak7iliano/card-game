import {Component, Input, OnInit} from '@angular/core';
import {GameActionsService} from "../../services/game-actions.service";
import {GameStorageService} from "../../services/game-storage.service";
import {ICard} from "../../models/card";
import {IHandOptions} from "../../models/hand-options";

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss']
})

export class HandComponent implements OnInit {
  constructor(private gameActions: GameActionsService, public gameStorage: GameStorageService) {}

  allowAction?: boolean
  isVisible?: boolean
  isMy = false
  myTurn: boolean

  @Input() set: any
  @Input() public set options(o: IHandOptions) {
    this.allowAction = o.allowAction;
    this.isVisible = o.isVisible;
    this.isMy = o.isMy;
  }

  ngOnInit(): void {
    this.gameStorage.myTurn.subscribe(val => this.myTurn = val === this.isMy)
  }

  myAttack(card: ICard):void {
    if (this.myTurn && this.allowAction) {
      this.gameActions.myAttack(card);
    }
  }
}
