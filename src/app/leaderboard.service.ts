import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

interface Player {
  name: string;
  score: number;
  time: string;
}

@Injectable({
  providedIn: "root",
})
export class LeaderboardService {
  private players: { name: string; score: number; time: string }[] = [];
  private playersSubject: BehaviorSubject<Player[]> = new BehaviorSubject<
    Player[]
  >([]);

  public players$ = this.playersSubject.asObservable();

  constructor() {}

  getLeaderboard(): { name: string; score: number; time: string }[] {
    return this.players;
  }

  addPlayerToLeaderboard(name: string, score: number, time: string): void {
    const player: Player = { name, score, time };
    const players = this.playersSubject.value.concat(player);
    this.playersSubject.next(players);
  }

  getSortedLeaderboard(): Player[] {
    return this.playersSubject.value.slice().sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      return this.compareTimes(a.time, b.time);
    });
  }

  private compareTimes(timeA: string, timeB: string): number {
    const timeAComponents = timeA.split(":").map(Number);
    const timeBComponents = timeB.split(":").map(Number);
    for (let i = 0; i < timeAComponents.length; i++) {
      if (timeAComponents[i] !== timeBComponents[i]) {
        return timeAComponents[i] - timeBComponents[i];
      }
    }
    return 0;
  }
}
