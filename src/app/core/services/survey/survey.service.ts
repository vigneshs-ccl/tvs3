import { Injectable, signal, type WritableSignal } from '@angular/core';
import { SurveyData } from '@app/interface/surveyData';
import { v4 as uuidv4 } from 'uuid';
import { SurveySubmission } from '@app/interface/surveySubmission';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  private _submissions: WritableSignal<SurveySubmission[]> = signal<SurveySubmission[]>(
    this.loadSubmissionsFromLocalStorage(),
  );
  submissions = this._submissions.asReadonly();

  constructor() {}

  addSubmission(surveys: SurveyData[]): void {
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getFullYear()}`;

    const newSubmission: SurveySubmission = {
      id: uuidv4(),
      date: formattedDate,
      surveys,
    };

    const updated = [...this._submissions(), newSubmission];
    this._submissions.set(updated);
    this.saveSubmissionsToLocalStorage(updated);
  }

  private saveSubmissionsToLocalStorage(submissions: SurveySubmission[]): void {
    localStorage.setItem('surveySubmissions', JSON.stringify(submissions));
  }

  clearAllSubmissions(): void {
    this._submissions.set([]); // clear the signal
    localStorage.removeItem('surveySubmissions'); // clear storage
  }

  private loadSubmissionsFromLocalStorage(): SurveySubmission[] {
    const data = localStorage.getItem('surveySubmissions');
    try {
      return data ? (JSON.parse(data) as SurveySubmission[]) : [];
    } catch {
      return [];
    }
  }
}
