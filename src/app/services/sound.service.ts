import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  constructor() { }

  async deal() {
    const audio = new Audio('./assets/deal.mp3');
    await audio.play();
  }
  async action() {
    const audio = new Audio('./assets/action.mp3');
    await audio.play();
  }

  async result() {
    const audio = new Audio('./assets/result.mp3');
    await audio.play();
  }
}
