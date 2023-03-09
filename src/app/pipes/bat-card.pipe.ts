import { Pipe, PipeTransform } from '@angular/core';
import {ICard} from "../models/card";
import * as _ from 'lodash';

@Pipe({
  name: 'batCard'
})
export class BatCardPipe implements PipeTransform {
  transform(list: ICard[], parentId: number): ICard | undefined {
    return _.find(list, { parentId });
  }
}
