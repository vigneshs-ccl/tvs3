import { Injectable, signal, type WritableSignal, computed } from '@angular/core';
import { SurveyData } from '@app/interface/surveyData';

type SessionMeta = {
  rating: number;
  feedback: string;
  date: string;
};

@Injectable({ providedIn: 'root' })
export class SurveyService {
  // surveys list (advice rows)
  private _surveys: WritableSignal<SurveyData[]> = signal<SurveyData[]>(
    this.loadSurveysFromLocalStorage(),
  );
  surveys = this._surveys.asReadonly();

  // session meta (employee feedback)
  private _rating = signal<number>(this.loadSessionFromLocalStorage().rating);
  rating = this._rating.asReadonly();

  private _feedback = signal<string>(this.loadSessionFromLocalStorage().feedback);
  feedback = this._feedback.asReadonly();

  // computed compliance based on following/not_following
  compliance = computed<number>(() => {
    const list = this._surveys();
    if (!list || list.length === 0) return 0;
    const following = list.filter((s) => s.status === 'following').length;
    return Math.round((following / list.length) * 100);
  });

  constructor() {}

  // --- Surveys CRUD ---
  addSurvey(survey: SurveyData): void {
    const updated = [...this._surveys(), survey];
    this._surveys.set(updated);
    this.saveSurveysToLocalStorage(updated);
  }

  removeSurvey(index: number): void {
    const updated = this._surveys().filter((_, i) => i !== index);
    this._surveys.set(updated);
    this.saveSurveysToLocalStorage(updated);
  }

  setSurveys(surveys: SurveyData[]): void {
    this._surveys.set(surveys);
    this.saveSurveysToLocalStorage(surveys);
  }

  updateStatus(index: number, status: 'following' | 'not_following'): void {
    const list = [...this._surveys()];
    if (!list[index]) return;
    list[index] = { ...list[index], status };
    this._surveys.set(list);
    this.saveSurveysToLocalStorage(list);
    this.saveSessionToLocalStorage(); // keep session "date" fresh
  }

  // --- Session meta (employee feedback) ---
  setRating(value: number): void {
    this._rating.set(value);
    this.saveSessionToLocalStorage();
  }

  setFeedback(text: string): void {
    this._feedback.set(text);
    this.saveSessionToLocalStorage();
  }

  clearSession(): void {
    this._rating.set(0);
    this._feedback.set('');
    this.saveSessionToLocalStorage();
  }

  // --- Persistence ---
  private saveSurveysToLocalStorage(surveys: SurveyData[]): void {
    localStorage.setItem('surveyData', JSON.stringify(surveys));
  }

  private loadSurveysFromLocalStorage(): SurveyData[] {
    const data = localStorage.getItem('surveyData');
    try {
      return data ? (JSON.parse(data) as SurveyData[]) : [];
    } catch {
      return [];
    }
  }

  private saveSessionToLocalStorage(): void {
    const payload: SessionMeta = {
      rating: this._rating(),
      feedback: this._feedback(),
      date: new Date().toISOString(),
    };
    localStorage.setItem('surveySession', JSON.stringify(payload));
  }

  private loadSessionFromLocalStorage(): SessionMeta {
    const raw = localStorage.getItem('surveySession');
    if (!raw) return { rating: 0, feedback: '', date: '' };
    try {
      const parsed = JSON.parse(raw) as SessionMeta;
      return {
        rating: parsed?.rating ?? 0,
        feedback: parsed?.feedback ?? '',
        date: parsed?.date ?? '',
      };
    } catch {
      return { rating: 0, feedback: '', date: '' };
    }
  }
}

export default SurveyService;
