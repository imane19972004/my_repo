import {Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { UserHistory } from '../../../models/user-history.model';
import { User } from '../../../models/user.model';
import { Chart, registerables } from 'chart.js';
import {ExerciceService} from "../../../services/exercice.service"; // Pour les graphiques

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss']
})
export class UserHistoryComponent implements OnInit {

  userHistory: UserHistory[] = [];
  userId: string | null = null;
  loading: boolean = true;
  user: User | null = null;
  @ViewChildren('exerciseCanvas') canvasRefs!: QueryList<ElementRef<HTMLCanvasElement>>;
  chart: Chart | null = null;
  aggregatedItemFailures: { [itemName: string]: number } = {};
  exerciseHistories: { [exerciseId: string]: UserHistory[] } = {};
  objectKeys = Object.keys;

  constructor(private userService: UserService, private route: ActivatedRoute, private exerciceService: ExerciceService) {
    // Enregistrement des éléments nécessaires de Chart.js
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      // Récupérer l'utilisateur
      this.userService.getUserById(this.userId).subscribe((user) => {
        this.user = user ?? null;
      });

      // Récupérer son historique
      this.userService.getUserHistoryById(this.userId).subscribe(history => {
        this.userHistory = history;
        this.aggregatedItemFailures = {};

        history.forEach(h => {
          if (h.itemFailures) {
            Object.entries(h.itemFailures).forEach(([itemName, count]) => {
              this.aggregatedItemFailures[itemName] =
                (this.aggregatedItemFailures[itemName] || 0) + count;
            });
          }
        });
        console.log(this.aggregatedItemFailures);
        this.exerciseHistories = {};
        this.userHistory.forEach(history => {
          if (!this.exerciseHistories[history.exerciceId]) {
            this.exerciseHistories[history.exerciceId] = [];
          }
          this.exerciseHistories[history.exerciceId].push(history);
        });

        this.loading = false;
        setTimeout(() => this.renderChart(history), 0);
      });
    }


  }

  renderChart(histories: UserHistory[]) {
    if (!this.canvasRefs || this.canvasRefs.length === 0) return;

    const exerciseIds = Object.keys(this.exerciseHistories);

    this.canvasRefs.forEach((canvasRef, index) => {
      const exerciseId = exerciseIds[index];
      const histories = this.exerciseHistories[exerciseId];

      // Tri chronologique
      histories.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const labels = histories.map(h => new Date(h.date).toLocaleString());
      const successData = histories.map(h => h.success);
      const failureData = histories.map(h => h.failure);

      const ctx = canvasRef.nativeElement.getContext('2d');
      if (!ctx) return;
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            { label: 'Objets bien placés', data: successData, borderColor: 'blue', backgroundColor: 'blue', fill: false, tension: 0.3},
            { label: 'Objets mal placés', data: failureData, borderColor: 'red', backgroundColor: 'red', fill: false, tension: 0.3}
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              labels: {
                font: {size: 14, weight: "bold", family: 'Poppins'},
                color: "#6a0dad",
                boxHeight: 10,
                boxWidth: 10,
                useBorderRadius: true,
                borderRadius: 5,
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date de la partie',
                font: {size: 16, weight: "bold", family: 'Poppins'},
                color: "#6a0dad"
              },
              type: 'category',
              ticks: {font: {size: 12, weight: "bold", family: 'Poppins', style: "italic"}, color: "#ffc200"}
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Nombre d’objets placés',
                font: {size: 16, weight: "bold", family: 'Poppins'},
                color: "#ffc306"
              },
              ticks: {stepSize: 1, font: {size: 16, weight: "bold", family: 'Poppins'}, color: "#6a0dad"}
            }
          }
        }
      });
    });
  }

  protected readonly Object = Object;
}
