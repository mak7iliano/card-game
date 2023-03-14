import {Component, Input} from '@angular/core';
import {ICard} from "../../models/card";

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss']
})

export class BattleComponent {
  @Input() set: ICard[];
}
