import {Component, Input} from '@angular/core';
import {ICard} from "../../models/card";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() card: ICard;
  @Input() allowAction?: boolean;
  @Input() isVisible?: boolean;

  //TODO: rework to pipe
  suitSign = (value: string) => {
    switch (value) {
      case 'diamonds':
        return '♦';
      case 'hearts':
        return '♥';
      case 'clubs':
        return '♣';
      case 'spades':
        return '♠';
    }
    return value;
  };

  isRed = (value: string) => {
    return value === 'diamonds' || value === 'hearts';
  };
}
