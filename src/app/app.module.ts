import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LeaderboardComponent } from "./home/leaderboard/leaderboard.component";
import { GameComponent } from "./game/game.component";
import { FinalScoreComponent } from "./game/final-score/final-score.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "leaderboard", component: LeaderboardComponent },
  { path: "game", component: GameComponent },
  { path: "final-score", component: FinalScoreComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    LeaderboardComponent,
    FinalScoreComponent,
  ],

  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
