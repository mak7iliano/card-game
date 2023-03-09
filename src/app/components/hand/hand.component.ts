import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {GameActionsService} from "../../services/game-actions.service";
import {GameStorageService} from "../../services/game-storage.service";
import {ICard} from "../../models/card";
import {IHandOptions} from "../../models/hand-options";
import {tap} from "rxjs";

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss'],
})

export class HandComponent implements OnInit, OnDestroy {
  constructor(private gameActions: GameActionsService, public gameStorage: GameStorageService) {}

  allowAction?: boolean
  isVisible?: boolean
  isMy = false
  myTurn: boolean
  myAttackTurn: boolean

  @Input() set: any
  @Input() public set options(o: IHandOptions) {
    this.allowAction = o.allowAction;
    this.isVisible = o.isVisible;
    this.isMy = o.isMy;
  }

  public ngOnDestroy(): void {
    this.gameStorage.myTurn.unsubscribe();
  }

  ngOnInit(): void {
    this.gameStorage.myTurn.pipe(
      tap((v) => {
        // console.warn(v);
      })
    ).subscribe(val => this.myTurn = val === this.isMy)

    this.gameStorage.myAttackTurn.subscribe(val => this.myAttackTurn = val)
  }

  myMove(card: ICard):void {
    if (this.myTurn && this.allowAction) {
      if (this.myAttackTurn) {
        this.gameActions.myAttack(card);
      } else {
        this.gameActions.myStruggle(card);
      }
    }
  }

  myMoveComplete():void {
    this.gameActions.myAttackComplete();
  }
  pickUp():void {
    this.gameActions.myPickUp();
  }
}
