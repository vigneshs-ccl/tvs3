// survey.model.ts
export interface SurveyData {
  surveyGiven: string;
  frequency: string;
  remarks: string;
  date: string;
  status?: 'following' | 'not_following'
}
