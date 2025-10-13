import { SurveyData } from '@app/interface/surveyData';

export interface SurveySubmission {
  id: string;
  date: string;
  surveys: SurveyData[];
}
