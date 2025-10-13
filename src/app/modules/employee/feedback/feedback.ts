import { CommonModule, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { StarRating } from '@app/components/star-rating/star-rating';
import { SurveyService } from '@app/core/services/survey/survey.service';
import { SurveyData } from '@app/interface/surveyData';
import { SurveySubmission } from '@app/interface/surveySubmission';
@Component({
  selector: 'app-feedback',
  imports: [NgClass, CommonModule, StarRating],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss',
})
export class Feedback {
  surveyService = inject(SurveyService);
  isModalOpen = false;
  selectedSubmission: SurveySubmission | null = null;
  selectedSubmissionIndex: number = 0;
  submissionRating: number = 0;

  submissions: SurveySubmission[] = [];
  constructor() {
    this.loadSubmissions();
  }

  openModal(submission: SurveySubmission) {
    this.selectedSubmission = submission;
    this.selectedSubmissionIndex = this.submissions.findIndex((s) => s.id === submission.id);
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedSubmission = null;
  }

  get surveys(): SurveySubmission[] {
    return this.surveyService.submissions();
  }

  trackBySubmission(index: number, item: SurveySubmission): string {
    return item.id;
  }

  trackBySurvey(index: number, item: SurveyData): string {
    return item.date + index; // ensures uniqueness
  }

  loadSubmissions() {
    this.submissions = this.surveyService.submissions(); // get all submissions
  }

  // ratings
  // inside Feedback component
  onRatingChange(rating: number) {
    this.submissionRating = rating;
  if (this.selectedSubmission) {
    console.log(`Submission ID: ${this.selectedSubmission.id}, New Rating: ${rating}`);
  }
}
}