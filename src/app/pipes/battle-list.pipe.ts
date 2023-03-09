import { Pipe, PipeTransform } from '@angular/core';
import {ICard} from "../models/card";
import * as _ from 'lodash';

@Pipe({
  name: 'battleList'
})
export class BattleListPipe implements PipeTransform {

  transform(list: ICard[]): ICard[] | undefined {
    const modified: ICard[] | undefined = [];
    list.forEach(i => {
      if(!i.parentId) {
        modified.push(i);
      }
    })
    return modified;
  }
}
