import { CommonModule, NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StarRating } from '@app/components/star-rating/star-rating';
import { SurveyService } from '@app/core/services/survey/survey.service';
import { SurveyData } from '@app/interface/surveyData';
import { SurveySubmission } from '@app/interface/surveySubmission';
@Component({
  selector: 'app-feedback',
  imports: [NgClass, FormsModule, CommonModule, StarRating],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss',
})
export class Feedback {
  surveyService = inject(SurveyService);
  isModalOpen = false;
  submissions = computed(() => this.surveyService.submissions());
  selectedSubmission: SurveySubmission | null = null;
  selectedSubmissionIndex: number = 0;
  submissionRating: number = 0;


  openModal(submission: SurveySubmission) {
    // Track the index
    const allSubmissions = this.submissions();
    this.selectedSubmissionIndex = allSubmissions.findIndex((s) => s.id === submission.id);

    // Deep copy to avoid changing original before save
    this.selectedSubmission = JSON.parse(JSON.stringify(submission));
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedSubmission = null;
  }

  get surveys(): SurveySubmission[] {
    return this.surveyService.submissions();
  }

  trackBySubmission(index: number, item: SurveySubmission) {
    return item.id;
  }

  trackBySurvey(index: number, item: SurveyData) {
    return item.adviceGiven + index;
  }

  // rating update
  onRatingChange(rating: number) {
    if (this.selectedSubmission) {
      this.selectedSubmission.rating = rating;
    }
  }

  onFollowStatusChange(survey: SurveyData, status: 'following' | 'not-following') {
    if (this.selectedSubmission) {
      survey.followStatus = status;
    }
  }

  onSubmit() {
    if (!this.selectedSubmission) return;

    this.selectedSubmission.surveys = this.selectedSubmission.surveys.map((s) => ({
      ...s,
      followStatus: s.followStatus || 'following',
    }));

    console.log('Submitted Data:', this.selectedSubmission);

    // Save changes to service (and localStorage)
    this.surveyService.updateSubmission(this.selectedSubmission);

    this.closeModal();
  }
}
