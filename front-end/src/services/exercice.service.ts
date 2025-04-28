// src/services/exercice.service.ts - Mise à jour
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Exercice } from '../models/exercice.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ExerciceService {
  private exercices: Exercice[] = [];
  private exercicesSubject = new BehaviorSubject<Exercice[]>([]);
  private selectedExerciceId: string | null = null;
  
  // LocalStorage keys
  private readonly STORAGE_KEY = 'memolink_exercices';
  
  constructor() {
    this.loadFromLocalStorage();
  }
  
  private loadFromLocalStorage(): void {
    const storedExercices = localStorage.getItem(this.STORAGE_KEY);
    if (storedExercices) {
      this.exercices = JSON.parse(storedExercices);
      this.exercicesSubject.next([...this.exercices]);
    }
  }
  
  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.exercices));
  }
  
  getExercices(): Observable<Exercice[]> {
    return this.exercicesSubject.asObservable();
  }
  
  getExerciceById(id: string): Exercice | undefined {
    return this.exercices.find(ex => ex.id === id);
  }
  
  // Nouvelle méthode pour obtenir les exercices d'un patient spécifique
  getPatientExercices(patientId: string): Observable<Exercice[]> {
    const patientExercices = this.exercices.filter(ex => 
      ex.assignedPatients && ex.assignedPatients.includes(patientId)
    );
    return new BehaviorSubject<Exercice[]>(patientExercices).asObservable();
  }
  
  // Méthode pour assigner un exercice à un patient
  assignExerciceToPatient(exerciceId: string, patientId: string): void {
    const exercice = this.exercices.find(ex => ex.id === exerciceId);
    if (exercice) {
      if (!exercice.assignedPatients) {
        exercice.assignedPatients = [];
      }
      if (!exercice.assignedPatients.includes(patientId)) {
        exercice.assignedPatients.push(patientId);
        this.saveToLocalStorage();
        this.exercicesSubject.next([...this.exercices]);
      }
    }
  }
  
  // Méthode pour dissocier un exercice d'un patient
  removeExerciceFromPatient(exerciceId: string, patientId: string): void {
    const exercice = this.exercices.find(ex => ex.id === exerciceId);
    if (exercice && exercice.assignedPatients) {
      exercice.assignedPatients = exercice.assignedPatients.filter(id => id !== patientId);
      this.saveToLocalStorage();
      this.exercicesSubject.next([...this.exercices]);
    }
  }
  
  addExercice(exercice: Exercice): void {
    // Générer un ID unique si non fourni
    if (!exercice.id) {
      exercice.id = uuidv4();
    }
    this.exercices.push({...exercice});
    this.saveToLocalStorage();
    this.exercicesSubject.next([...this.exercices]);
  }
  
  deleteExercice(id: string): void {
    this.exercices = this.exercices.filter(ex => ex.id !== id);
    this.saveToLocalStorage();
    this.exercicesSubject.next([...this.exercices]);
  }
  
  setSelectedExercice(id: string): void {
    this.selectedExerciceId = id;
  }
  
  getSelectedExerciceId(): string | null {
    return this.selectedExerciceId;
  }
}