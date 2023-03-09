import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { OrderModule } from 'ngx-order-pipe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { HandComponent } from './components/hand/hand.component';
import { DeckComponent } from './components/deck/deck.component';
import { BattleComponent } from './components/battle/battle.component';
import { MyTurnPipe } from './pipes/my-turn.pipe';
import { BattleListPipe } from './pipes/battle-list.pipe';
import { BatCardPipe } from './pipes/bat-card.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    HandComponent,
    DeckComponent,
    BattleComponent,
    MyTurnPipe,
    BattleListPipe,
    BatCardPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OrderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
