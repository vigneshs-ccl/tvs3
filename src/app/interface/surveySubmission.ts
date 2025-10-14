import { SurveyData } from '@app/interface/surveyData';

export interface SurveySubmission {
  id: string;
  date: string;
  surveys: SurveyData[];
  rating: number; //  per-modal rating
  feedback: string; //  per-modal feedback
}