import { Component, OnInit } from "@angular/core";
import fetchFromSpotify, { request } from "../../services/api";
import { ActivatedRoute, Router } from "@angular/router";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.selectedTheme = params["theme"] || "Dark";
      this.selectedMode = params["mode"] || "Classic";
    });
  }

  genres: String[] = ["House", "Alternative", "J-Rock", "R&B"];
  themes: String[] = ["Dark", "Light"];
  modes: String[] = ["Classic", "Hardcore"];
  selectedGenre: string = "";
  selectedTheme: string = "Dark";
  selectedMode: string = "Classic";
  soundEffectsEnabled: boolean = true;
  authLoading: boolean = false;
  configLoading: boolean = false;
  token: String = "";

  ngOnInit(): void {
    this.authLoading = true;
    localStorage.clear();
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        this.authLoading = false;
        this.token = storedToken.value;
        this.loadGenres(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      this.authLoading = false;
      this.token = newToken.value;
      this.loadGenres(newToken.value);
    });
  }

  loadGenres = async (t: any) => {
    this.configLoading = true;

    // #################################################################################
    // DEPRECATED!!! Use only for example purposes
    // DO NOT USE the recommendations endpoint in your application
    // Has been known to cause 429 errors
    // const response = await fetchFromSpotify({
    //   token: t,
    //   endpoint: "recommendations/available-genre-seeds",
    // });
    // console.log(response);
    // #################################################################################

    this.genres = [
      "rock",
      "rap",
      "pop",
      "country",
      "hip-hop",
      "jazz",
      "alternative",
      "j-pop",
      "k-pop",
      "emo",
    ];
    this.configLoading = false;
  };

  setGenre(selectedGenre: any) {
    this.selectedGenre = selectedGenre;
    localStorage.setItem("selectedGenre", JSON.stringify(selectedGenre));
    console.log(this.selectedGenre);
    console.log(TOKEN_KEY);
  }

  setTheme(theme: string) {
    this.selectedTheme = theme;
  }

  loadThemes = async (t: any) => {
    this.themes = ["Dark", "Light"];
    this.configLoading = true;
  };

  playSoundEffect() {
    if (this.soundEffectsEnabled) {
      const audioElement = document.getElementById(
        "popSound"
      ) as HTMLAudioElement;
      audioElement.play();
    }
  }

  setMode(mode: string) {
    this.selectedMode = mode;
  }

  loadModes = async (t: any) => {
    this.modes = ["Classic", "Hardcore"];
    this.configLoading = true;
  };

  revertSettings() {
    this.selectedGenre = "";
    this.selectedTheme = "Dark";
    this.soundEffectsEnabled = true;
    this.selectedMode = "Classic";
  }

  navigateToLeaderboard(selectedTheme: string, selectedMode: string): void {
    this.router.navigate(["/leaderboard"], {
      queryParams: { theme: selectedTheme, mode: selectedMode },
    });
  }

  playButtonClicked(selectedTheme: string, selectedMode: string) {
    this.router.navigate(["/game"], {
      queryParams: { theme: selectedTheme, mode: selectedMode },
    });
  }

  showOptions: boolean = false;

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }
}
