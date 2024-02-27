import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import fetchFromSpotify from "../../services/api";

const TOKEN_KEY = "whos-who-access-token";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}
  songUrl: string | null = null;
  errorMessage: string | null = null;
  correctChoice: { name: string; url: string } = { name: "", url: "" };
  selectedChoice: string | null = null;
  choices: { name: string; url: string }[] = [];
  answered: boolean = false;
  questionCounter: number = 1;
  selectedTheme: string = "";
  selectedMode: string = "";
  timer: number = 0;
  timerInterval: any;
  isPlaying: boolean = false;
  audioElement: HTMLAudioElement | null = null;
  counter: number = 0;
  formattedTimer: string = "";

  ngOnInit(): void {
    const storedGenreString = localStorage.getItem("selectedGenre");
    const selectedGenre = storedGenreString
      ? JSON.parse(storedGenreString)
      : "emo";
    const spotifyAuthToken = "";
    this.fetchChoices(selectedGenre, spotifyAuthToken);
    this.route.queryParams.subscribe((params) => {
      this.selectedTheme = params["theme"] || "Light";
      console.log(this.selectedTheme);
      this.selectedMode = params["mode"] || "Hardcore";
      console.log(this.selectedMode);
    });
    this.startTimer();
    this.audioElement = new Audio();
  }

  searchTracks(genre: string, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const endpoint = "search";
      const params = {
        q: `genre:"${genre}"`,
        type: "track",
        limit: 50,
      };

      fetchFromSpotify({ token, endpoint, params }).then((response) => {
        console.log("Spotify API Response:", response);
        const allTracks = response.tracks.items;
        const shuffledTracks = this.shuffleArray(allTracks);
        const selectedTracks = shuffledTracks.slice(0, 4);
        for (const track of shuffledTracks) {
          const { name, preview_url } = track;
          if (name && preview_url) {
            const song = { name, url: preview_url };
            this.choices.push(song);
            if (this.choices.length === 4) {
              break;
            }
          }
        }
        resolve();
      });
    });
  }

  fetchChoices(genre: string, token: string): void {
    this.searchTracks(genre, token)
      .then(() => {
        this.choices = this.shuffleArray(this.choices);
        const correctIndex = Math.floor(Math.random() * this.choices.length);
        this.correctChoice = this.choices[correctIndex];
      })
      .catch((error) => {
        console.error("Error fetching tracks:", error);
      });
  }

  selectChoice(choice: { name: string; url: string }): void {
    if (this.answered) {
      return;
    }
    this.selectedChoice = choice.name;
    const isCorrect = choice.name === this.correctChoice.name;
    if (isCorrect) {
      console.log("Correct choice!");
      this.counter++;
      console.log(this.counter);
    } else {
      console.log("Wrong choice!");
    }
    this.answered = true;
  }

  togglePlayPause(): void {
    if (!this.audioElement) {
      console.error("Audio element is not initialized.");
      return;
    }

    if (this.isPlaying) {
      this.audioElement.pause();
    } else {
      if (this.correctChoice) {
        this.audioElement.src = this.correctChoice.url;
        this.audioElement.play();
      }
    }

    this.isPlaying = !this.isPlaying;
  }

  shuffleArray(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }

  nextQuestion(): void {
    console.log(this.selectedMode);
    console.log(this.selectedTheme);
    if (this.selectedChoice) {
      const isCorrect = this.selectedChoice === this.correctChoice.name;
      this.answered = false;
      this.selectedChoice = null;
      this.choices = [];
      if (this.audioElement && !this.audioElement.paused) {
        this.audioElement.pause();
        this.isPlaying = false;
      }

      if (isCorrect || this.selectedMode === "Classic") {
        if (this.questionCounter < 11) {
          this.questionCounter++;
        }
        if (this.questionCounter === 11) {
          const formattedTimer = this.formatTimer(this.timer);
          console.log(formattedTimer);
          console.log(this.counter);
          this.router.navigate(["/final-score"], {
            queryParams: {
              formattedTimer: formattedTimer,
              counter: this.counter,
              theme: this.selectedTheme,
              mode: this.selectedMode,
            },
          });
        } else {
          const storedGenreString = localStorage.getItem("selectedGenre");
          const selectedGenre = storedGenreString
            ? JSON.parse(storedGenreString)
            : "emo";
          const spotifyAuthToken = "";
          this.fetchChoices(selectedGenre, spotifyAuthToken);
        }
      } else {
        const formattedTimer = this.formatTimer(this.timer);
        console.log(formattedTimer);
        console.log(this.counter);
        this.router.navigate(["/final-score"], {
          queryParams: {
            formattedTimer: formattedTimer,
            counter: this.counter,
            theme: this.selectedTheme,
            mode: this.selectedMode,
          },
        });
      }
    }
  }

  goHome(selectedTheme: string): void {
    this.router.navigate(["/"], {
      queryParams: { theme: selectedTheme },
    });
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer += 10;
    }, 10);
  }

  formatTimer(milliseconds: number): string {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const millis = Math.floor(milliseconds % 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}:${
      millis < 10 ? "00" : millis < 100 ? "0" : ""
    }${millis}`;
  }
}
