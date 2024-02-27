import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HardcoreLeaderboardService } from "src/app/hardcore-leaderboard.service";
import { LeaderboardService } from "src/app/leaderboard.service";

interface Player {
  name: string;
  score: number;
  time: string;
}

@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.css"],
})
export class LeaderboardComponent implements OnInit {
  classicPlayers: Player[] = [];
  hardcorePlayers: Player[] = [];
  selectedTheme: string = "";
  selectedMode: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private leaderboardService: LeaderboardService,
    private hardcoreLeaderboardService: HardcoreLeaderboardService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedTheme = params["theme"] || "Light";
      this.selectedMode = params["mode"] || "Hardcore";
      this.updateLeaderboard();
    });
  }

  updateLeaderboard(): void {
    if (this.selectedMode === "Classic") {
      this.classicPlayers = this.leaderboardService.getSortedLeaderboard();
      this.hardcorePlayers = [];
    } else if (this.selectedMode === "Hardcore") {
      this.hardcorePlayers =
        this.hardcoreLeaderboardService.getSortedLeaderboard();
      this.classicPlayers = [];
    }
  }

  goHome(selectedTheme: string, selectedMode: string): void {
    this.router.navigate(["/"], {
      queryParams: { theme: selectedTheme, mode: selectedMode },
    });
  }
}
