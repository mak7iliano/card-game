import { Pipe, PipeTransform } from '@angular/core';
import {ICard} from "../models/card";
import * as _ from 'lodash';

@Pipe({
  name: 'battleList'
})
export class BattleListPipe implements PipeTransform {
  transform(list: ICard[]): ICard[] | undefined {
    return _.filter(list, it => !it.parentId);
  }
}
