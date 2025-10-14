// survey.model.ts
export interface SurveyData {
  adviceGiven: string;
  frequency: string;
  remarks: string;
  date: string;
  followStatus?: 'following' | 'not-following' | 'pending';
}
