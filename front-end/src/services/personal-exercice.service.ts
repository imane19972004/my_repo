// front-end/src/services/personal-exercice.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { PersonalExercice } from '../models/personal-exercice.model';
import { ExerciceAssignment } from '../models/exercice-assignment.model';
import { Exercice } from '../models/exercice.model';
import { serverUrl, httpOptionsBase } from '../configs/server.config';

@Injectable({
  providedIn: 'root'
})
export class PersonalExerciceService {
  private serverUrlLoc = serverUrl;
  private personalExercicesUrl = `${this.serverUrlLoc}/personal-exercices`;
  private assignmentsUrl = `${this.serverUrlLoc}/exercice-assignments`;

  // BehaviorSubjects pour les données réactives
  public personalExercices$ = new BehaviorSubject<PersonalExercice[]>([]);
  public assignments$ = new BehaviorSubject<ExerciceAssignment[]>([]);
  public selectedPersonalExercice$ = new BehaviorSubject<PersonalExercice | null>(null);

  // Clés pour le stockage local (en cas de fallback)
  private readonly PERSONAL_STORAGE_KEY = 'memolink_personal_exercices';
  private readonly ASSIGNMENTS_STORAGE_KEY = 'memolink_assignments';
  private USE_LOCAL_STORAGE = false;

  constructor(private http: HttpClient) {
    this.loadPersonalExercices();
    this.loadAssignments();
  }

  // === GESTION DES EXERCICES PERSONNALISÉS ===

  /**
   * Charge tous les exercices personnalisés
   */
  private loadPersonalExercices(): void {
    if (this.USE_LOCAL_STORAGE) {
      const stored = localStorage.getItem(this.PERSONAL_STORAGE_KEY);
      if (stored) {
        try {
          const exercices = JSON.parse(stored);
          this.personalExercices$.next(exercices);
        } catch (error) {
          console.error('Erreur lors du chargement des exercices personnalisés:', error);
          this.personalExercices$.next([]);
        }
      }
    } else {
      this.http.get<PersonalExercice[]>(this.personalExercicesUrl, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of([]); }))
        .subscribe(exercices => {
          this.personalExercices$.next(exercices);
        });
    }
  }

  /**
   * Récupère les exercices personnalisés d'un utilisateur spécifique
   */
  getPersonalExercicesByUserId(userId: string): Observable<PersonalExercice[]> {
    if (this.USE_LOCAL_STORAGE) {
      const allExercices = this.personalExercices$.value;
      const userExercices = allExercices.filter(ex => ex.userId === userId);
      return of(userExercices);
    } else {
      return this.http.get<PersonalExercice[]>(`${this.personalExercicesUrl}/user/${userId}`, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of([]); }));
    }
  }

  /**
   * Récupère un exercice personnalisé par son ID
   */
  getPersonalExerciceById(id: string): Observable<PersonalExercice | undefined> {
    if (this.USE_LOCAL_STORAGE) {
      const exercices = this.personalExercices$.value;
      const exercice = exercices.find(ex => ex.id === id);
      return of(exercice);
    } else {
      return this.http.get<PersonalExercice>(`${this.personalExercicesUrl}/${id}`, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(undefined); }));
    }
  }

  /**
   * Crée un nouvel exercice personnalisé
   */
  createPersonalExercice(exercice: Omit<PersonalExercice, 'id' | 'createdAt' | 'modifiedAt'>): void {
    const newExercice: PersonalExercice = {
      ...exercice,
      id: this.generateId(),
      createdAt: new Date(),
      modifiedAt: new Date()
    };

    if (this.USE_LOCAL_STORAGE) {
      const current = this.personalExercices$.value;
      const updated = [...current, newExercice];
      this.personalExercices$.next(updated);
      this.savePersonalExercices(updated);
    } else {
      this.http.post<PersonalExercice>(this.personalExercicesUrl, newExercice, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(); }))
        .subscribe(() => this.loadPersonalExercices());
    }
  }

  /**
   * Met à jour un exercice personnalisé
   */
  updatePersonalExercice(exercice: PersonalExercice): void {
    exercice.modifiedAt = new Date();

    if (this.USE_LOCAL_STORAGE) {
      const current = this.personalExercices$.value;
      const index = current.findIndex(ex => ex.id === exercice.id);
      if (index !== -1) {
        const updated = [...current];
        updated[index] = exercice;
        this.personalExercices$.next(updated);
        this.savePersonalExercices(updated);
      }
    } else {
      this.http.put<PersonalExercice>(`${this.personalExercicesUrl}/${exercice.id}`, exercice, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(); }))
        .subscribe(() => this.loadPersonalExercices());
    }
  }

  /**
   * Supprime un exercice personnalisé
   */
  deletePersonalExercice(exerciceId: string): void {
    if (this.USE_LOCAL_STORAGE) {
      const current = this.personalExercices$.value;
      const updated = current.filter(ex => ex.id !== exerciceId);
      this.personalExercices$.next(updated);
      this.savePersonalExercices(updated);
    } else {
      this.http.delete(`${this.personalExercicesUrl}/${exerciceId}`, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(); }))
        .subscribe(() => this.loadPersonalExercices());
    }
  }

  // === GESTION DES ASSIGNATIONS ===

  /**
   * Charge toutes les assignations
   */
  private loadAssignments(): void {
    if (this.USE_LOCAL_STORAGE) {
      const stored = localStorage.getItem(this.ASSIGNMENTS_STORAGE_KEY);
      if (stored) {
        try {
          const assignments = JSON.parse(stored);
          this.assignments$.next(assignments);
        } catch (error) {
          console.error('Erreur lors du chargement des assignations:', error);
          this.assignments$.next([]);
        }
      }
    } else {
      this.http.get<ExerciceAssignment[]>(this.assignmentsUrl, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of([]); }))
        .subscribe(assignments => {
          this.assignments$.next(assignments);
        });
    }
  }

  /**
   * Assigne un exercice général à un utilisateur
   */
  assignExerciceToUser(userId: string, exercice: Exercice): void {
    // Créer l'assignation
    const assignment: ExerciceAssignment = {
      id: this.generateId(),
      userId: userId,
      exerciceId: exercice.id,
      assignedAt: new Date()
    };

    // Créer l'exercice personnalisé basé sur l'exercice général
    const personalExercice: Omit<PersonalExercice, 'id' | 'createdAt' | 'modifiedAt'> = {
      userId: userId,
      name: exercice.name,
      theme: exercice.theme,
      description: exercice.description,
      categories: [...exercice.categories],
      items: [...exercice.items],
      isFromGeneral: true,
      originalExerciceId: exercice.id
    };

    // Sauvegarder l'assignation
    if (this.USE_LOCAL_STORAGE) {
      const currentAssignments = this.assignments$.value;
      const updatedAssignments = [...currentAssignments, assignment];
      this.assignments$.next(updatedAssignments);
      this.saveAssignments(updatedAssignments);
    } else {
      this.http.post<ExerciceAssignment>(this.assignmentsUrl, assignment, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(); }))
        .subscribe(() => this.loadAssignments());
    }

    // Créer l'exercice personnalisé
    this.createPersonalExercice(personalExercice);
  }

  /**
   * Récupère les assignations d'un utilisateur
   */
  getAssignmentsByUserId(userId: string): Observable<ExerciceAssignment[]> {
    if (this.USE_LOCAL_STORAGE) {
      const allAssignments = this.assignments$.value;
      const userAssignments = allAssignments.filter(a => a.userId === userId);
      return of(userAssignments);
    } else {
      return this.http.get<ExerciceAssignment[]>(`${this.assignmentsUrl}/user/${userId}`, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of([]); }));
    }
  }

  /**
   * Supprime une assignation
   */
  deleteAssignment(assignmentId: string): void {
    if (this.USE_LOCAL_STORAGE) {
      const current = this.assignments$.value;
      const updated = current.filter(a => a.id !== assignmentId);
      this.assignments$.next(updated);
      this.saveAssignments(updated);
    } else {
      this.http.delete(`${this.assignmentsUrl}/${assignmentId}`, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(); }))
        .subscribe(() => this.loadAssignments());
    }
  }

  // === GESTION DES IMAGES ===

  /**
   * Upload d'une image personnalisée
   */
  uploadPersonalImage(formData: FormData): Observable<string> {
    return this.http.post<{ imagePath: string }>(
      `${this.personalExercicesUrl}/uploads`,
      formData
    ).pipe(
      catchError(err => {
        console.error('Erreur d\'upload:', err);
        return of({ imagePath: '' });
      }),
      map(res => res.imagePath)
    );
  }

  // === MÉTHODES UTILITAIRES ===

  /**
   * Sélectionne un exercice personnalisé
   */
  setSelectedPersonalExercice(exerciceId: string): void {
    this.getPersonalExerciceById(exerciceId).subscribe(exercice => {
      this.selectedPersonalExercice$.next(exercice || null);
    });
  }

  /**
   * Génère un ID unique
   */
  private generateId(): string {
    return `personal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sauvegarde les exercices personnalisés dans le localStorage
   */
  private savePersonalExercices(exercices: PersonalExercice[]): void {
    if (this.USE_LOCAL_STORAGE) {
      localStorage.setItem(this.PERSONAL_STORAGE_KEY, JSON.stringify(exercices));
    }
  }

  /**
   * Sauvegarde les assignations dans le localStorage
   */
  private saveAssignments(assignments: ExerciceAssignment[]): void {
    if (this.USE_LOCAL_STORAGE) {
      localStorage.setItem(this.ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments));
    }
  }

  /**
   * Vérifie si un exercice est déjà assigné à un utilisateur
   */
  isExerciceAssignedToUser(userId: string, exerciceId: string): Observable<boolean> {
    return this.getAssignmentsByUserId(userId).pipe(
      map(assignments => assignments.some(a => a.exerciceId === exerciceId))
    );
  }
}