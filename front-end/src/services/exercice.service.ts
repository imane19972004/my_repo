import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Exercice} from '../models/exercice.model';
import {DEFAULT_EXERCISE_DATA} from "../mocks/exercices-data";
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user.model";
import {httpOptionsBase, serverUrl} from "../configs/server.config";
import {catchError} from "rxjs/operators";
import { map } from 'rxjs/operators'; // Add this at the top of the filecl

@Injectable({
  providedIn: 'root'
})
export class ExerciceService {
  private serverUrlLoc = serverUrl;
  private exercicesUrl = `${this.serverUrlLoc}/exercices`;

  public selectedExerciceSubject$ = new BehaviorSubject<Exercice | null>(null);
  public exercices$ = new BehaviorSubject<Exercice[]>([]);

  // Clé pour le stockage local
  private readonly STORAGE_KEY = 'memolink_exercices';
  private USE_LOCAL_STORAGE = false;

  constructor(private  http: HttpClient) {
    // Chargement initial des exercices
    this.loadExercices();
  }

  /**
   * Charge les exercices depuis le localStorage.
   * Si absent ou invalide, initialise avec les exercices par défaut.
   */
  private loadExercices(): void {
    if (this.USE_LOCAL_STORAGE) {
      const storedExercices = localStorage.getItem(this.STORAGE_KEY);
      if (storedExercices) {
        try {
          const exercices = JSON.parse(storedExercices);
          this.exercices$.next(exercices);
        } catch (error) {
          console.error('Erreur lors du chargement des exercices:', error);
          this.exercices$.next([]);
        }
      } else {
        this.initDefaultExercices();
      }
    } else {
      this.http.get<Exercice[]>(this.exercicesUrl, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(DEFAULT_EXERCISE_DATA);}))
        .subscribe(exercices => {
          const mergedExercices = exercices && exercices.length > 0 ? exercices : DEFAULT_EXERCISE_DATA;
          this.exercices$.next(mergedExercices);
          console.log(mergedExercices);
        });
    }
  }


  /**
   * Initialise avec les exercices par défaut.
   */
  initDefaultExercices(): void {
    this.exercices$.next(DEFAULT_EXERCISE_DATA);
  }

  /**
   * Sauvegarde la liste des exercices dans le localStorage.
   */
  private saveExercices(exercices: Exercice[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(exercices));
  }

  /**
   * Retourne un observable d'un exercice selon son ID.
   */
  getExerciceById(id: string): Observable<Exercice | undefined> {
    if (this.USE_LOCAL_STORAGE) {
      return new Observable(observer => {
        const exercices = this.exercices$.value;
        const exercice = exercices.find(e => e.id === id);
        observer.next(exercice);
        observer.complete();
      });
    } else {
      return this.http.get<Exercice>(`${this.exercicesUrl}/${id}`, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(undefined); }));
    }
  }

  /**
   * Ajoute un nouvel exercice en générant automatiquement son ID.
   */
  addExercice(exercice: Exercice): void {
    const currentExercices = this.exercices$.value;
    // Assigner un ID unique exo-{n}
    exercice.id = `exo-${currentExercices.length + 1}`;
    if (this.USE_LOCAL_STORAGE) {
      const updatedExercices = [...currentExercices, exercice];
      this.exercices$.next(updatedExercices);
      this.saveExercices(updatedExercices);
    } else {
      this.http.post<Exercice>(this.exercicesUrl, exercice, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(); }))
        .subscribe(() => this.loadExercices());
    }
  }

  /**
   * Met à jour un exercice existant.
   */
  updateExercice(updatedExercice: Exercice): void {
    const currentExercices = this.exercices$.value;
    const index = currentExercices.findIndex(e => e.id === updatedExercice.id);

    if (index !== -1) {
      const updatedExercices = [...currentExercices];
      updatedExercices[index] = updatedExercice;

      this.exercices$.next(updatedExercices);
      this.saveExercices(updatedExercices);
    }
  }

  /**
   * Supprime un exercice par son ID et réattribue tous les IDs.
   */
  deleteExercice(exercice: Exercice): void {
    if (this.USE_LOCAL_STORAGE) {
      const currentExercices = this.exercices$.value;

      // Filtrer l'exercice à supprimer
      let updatedExercices = currentExercices.filter(exo => exo.id !== exercice.id);

      // Réassigner les IDs proprement
      updatedExercices = updatedExercices.map((exercice, index) => ({
        ...exercice,
        id: `exo-${index + 1}`
      }));

      this.exercices$.next(updatedExercices);
      this.saveExercices(updatedExercices);
    } else {
      this.http.delete(`${this.exercicesUrl}/${exercice.id}`, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(); }))
        .subscribe(() => this.loadExercices());
    }
  }

  // Sélectionner un exercice
  setSelectedExercice(id: string): void {
    if (this.USE_LOCAL_STORAGE) {
      const exercices = this.exercices$.value;
      const selectedExercice = exercices.find(ex => ex.id === id);
      this.selectedExerciceSubject$.next(selectedExercice || null);
    } else {
      this.http.get<Exercice>(`${this.exercicesUrl}/${id}`, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(); }))
        .subscribe(exercice => this.selectedExerciceSubject$.next(exercice));
    }
  }

  uploadImage(formData: FormData): Observable<string> {
    return this.http.post<{ imagePath: string }>(
      `${this.exercicesUrl}/uploads`,
      formData
    ).pipe(
      catchError(err => {
        console.error('Erreur d\'upload:', err);
        return of({ imagePath: '' });
      }),
      // Extraire juste le chemin de retour
      map(res => res.imagePath)
    );
  }

}
