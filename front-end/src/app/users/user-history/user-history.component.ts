import { Component, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { UserHistory } from '../../../models/user-history.model';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss']
})
export class UserHistoryComponent implements OnInit {
  user: User | null = null;
  userId: string | null = null;
  userHistory: UserHistory[] = [];
  groupedHistory: { [exerciceId: string]: UserHistory[] } = {};
  loading: boolean = true;

  @ViewChildren('exerciseCanvas') exerciseCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;
  @ViewChildren('itemCanvas') itemCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;

  selectedItem: string | null = null;
  selectedExerciseId: string | null = null;

  constructor(private route: ActivatedRoute, private userService: UserService) {
    Chart.register(...registerables);
  }

  objectKeys = Object.keys;
  itemChart: Chart | null = null;

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (!this.userId) return;

    this.userService.getUserById(this.userId).subscribe(user => this.user = user ?? null);

    this.userService.getUserHistoryById(this.userId).subscribe(history => {
      this.userHistory = history;

      // Group by exercise
      this.groupedHistory = {};
      for (let entry of history) {
        if (!this.groupedHistory[entry.exerciceId]) {
          this.groupedHistory[entry.exerciceId] = [];
        }
        this.groupedHistory[entry.exerciceId].push(entry);
      }

      this.loading = false;

      setTimeout(() => this.renderExerciseCharts(), 0);
    });
  }

  get filteredExerciseHistories(): UserHistory[] {
    return this.userHistory.filter(h => h.exerciceId && h.exerciceName);
  }

  getLatestAttempt(exerciceId: string): UserHistory {
    return [...this.groupedHistory[exerciceId]].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }

  getAllItemNames(exerciceId: string): string[] {
    const allItems = new Set<string>();

    for (const entry of this.groupedHistory[exerciceId]) {
      if (entry.itemFailures) {
        Object.keys(entry.itemFailures).forEach(item => allItems.add(item));
      }
    }

    return Array.from(allItems);
  }

  getLatestItemFailureCount(exerciceId: string, itemName: string): number {
    const latest = this.getLatestAttempt(exerciceId);
    return latest.itemFailures?.[itemName] ?? 0;
  }

  renderExerciseCharts() {
    if (!this.exerciseCanvases) return;

    this.exerciseCanvases.forEach((canvasRef, index) => {
      const exerciceId = this.objectKeys(this.groupedHistory)[index];
      const history = this.groupedHistory[exerciceId].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const ctx = canvasRef.nativeElement.getContext('2d');
      if (!ctx) return;

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: history.map(h => new Date(h.date).toLocaleDateString()),
          datasets: [
            {
              label: 'Objets bien placés',
              data: history.map(h => h.success),
              borderColor: 'green',
              fill: false,
              backgroundColor: 'green',
              tension: 0.3
            },
            {
              label: 'Nombre de mauvais placements',
              data: history.map(h => h.failure),
              borderColor: 'red',
              fill: false,
              backgroundColor: 'red',
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {legend: { display: true, labels: {boxWidth: 16, boxHeight: 16, useBorderRadius: true, borderRadius: 8}}},
          scales: {
            x: { title: { display: true, text: 'Date de la partie' }},
            y: { title: { display: true, text: 'Nombre d’objets placés' }, beginAtZero: true }
          }
        }
      });
    });
  }

  showItemGraph(exerciceId: string, itemName: string, event: Event) {
    event.preventDefault();
    this.selectedItem = itemName;
    this.selectedExerciseId = exerciceId;

    setTimeout(() => this.renderItemChart(), 0);
  }

  renderItemChart() {
    if (this.itemChart) {
      this.itemChart.destroy();
      this.itemChart = null;
    }

    const canvas = this.itemCanvases.find((_, i) => this.objectKeys(this.groupedHistory)[i] === this.selectedExerciseId)?.nativeElement;
    if (!canvas || !this.selectedExerciseId || !this.selectedItem) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const history = this.groupedHistory[this.selectedExerciseId]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const labels = history.map(h => new Date(h.date).toLocaleDateString());
    const errorData = history.map(h => h.itemFailures?.[this.selectedItem!] ?? 0);

    this.itemChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{ label: `Évolution des erreurs pour ${this.selectedItem}`, data: errorData,
          borderColor: 'orange', fill: false, backgroundColor: 'orange', tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {boxWidth: 20, boxHeight: 20, useBorderRadius: true, borderRadius: 10}
          }
        },
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Nombre d’erreurs' }, beginAtZero: true }
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.itemChart) {
      this.itemChart.destroy();
      this.itemChart = null;
    }
  }
}
