import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HardcoreLeaderboardService } from "src/app/hardcore-leaderboard.service";
import { LeaderboardService } from "src/app/leaderboard.service";

@Component({
  selector: "app-final-score",
  templateUrl: "./final-score.component.html",
  styleUrls: ["./final-score.component.css"],
})
export class FinalScoreComponent implements OnInit {
  @Input() formattedTimer: string = "";
  @Input() counter: number = 0;
  playerName: string = "";
  selectedTheme: string = "";
  selectedMode: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private leaderboardService: LeaderboardService,
    private hardcoreLeaderboardService: HardcoreLeaderboardService
  ) {}

  submitScore(selectedTheme: string, selectedMode: string): void {
    const playerData = {
      name: this.playerName,
      time: this.formattedTimer,
      score: this.counter,
    };

    const service =
      selectedMode === "Hardcore"
        ? this.hardcoreLeaderboardService
        : this.leaderboardService;

    service.addPlayerToLeaderboard(
      this.playerName,
      this.counter,
      this.formattedTimer
    );
    this.router.navigate(["/leaderboard"], {
      queryParams: { theme: selectedTheme, mode: selectedMode },
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedTheme = params["theme"] || "Light";
      this.selectedMode = params["mode"] || "Hardcore";
      this.formattedTimer = params["formattedTimer"];
      this.counter = params["counter"];
    });
  }
}
