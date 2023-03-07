import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myTurn'
})
export class MyTurnPipe implements PipeTransform {

  transform(turn: boolean, isMy: boolean): unknown {
    return turn === isMy;
  }

}
