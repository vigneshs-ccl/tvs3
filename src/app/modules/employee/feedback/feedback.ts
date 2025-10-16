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
  followStatusErrors: { [key: string]: boolean } = {};
  submitted = false; // track if user clicked submit

  openModal(submission: SurveySubmission) {
    // Track the index
    const allSubmissions = this.submissions();
    this.selectedSubmissionIndex = allSubmissions.findIndex((s) => s.id === submission.id);

    // Deep copy to avoid changing original before save
    this.selectedSubmission = JSON.parse(JSON.stringify(submission));

    if (this.selectedSubmission?.surveys?.length) {
      this.selectedSubmission.surveys = this.selectedSubmission.surveys.map((s: SurveyData) => ({
        ...s,
        followStatus: s.followStatus ?? '',
        compliance: s.compliance ?? 0,
      }));
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedSubmission = null;
    this.followStatusErrors = {};
    this.submitted = false;
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

  onFollowStatusChange(survey: SurveyData, status: 'following' | 'not-following' | '') {
    survey.followStatus = status;
    // Recalculate compliance dynamically in the modal
    if (status === 'following') {
      survey.compliance = 100;
    } else if (status === 'not-following') {
      survey.compliance = 0;
    } else {
      survey.compliance = 0;
    }

    // Clear error immediately after user selects a valid option
    if (status === 'following' || status === 'not-following') {
      this.followStatusErrors[survey.adviceGiven] = false;
    }
  }

  validateBeforeSubmit(): boolean {
    if (!this.selectedSubmission) return false;
    this.submitted = true;
    let valid = true;
    this.selectedSubmission.surveys.forEach((s) => {
      // Only mark error if empty
      this.followStatusErrors[s.adviceGiven] = !s.followStatus;
      if (!s.followStatus) valid = false;
    });

    return valid;
  }

  //  Dynamic compliance calculation for display only
  getCompliance(): number {
    if (!this.selectedSubmission) return 0;

    // if (!this.validateBeforeSubmit()) {
    //   return 0; // stop submission if validation fails
    // }

    const total = this.selectedSubmission.surveys.length;
    if (!total) return 0;

    const sum = this.selectedSubmission.surveys.reduce((acc, s) => acc + (s.compliance ?? 0), 0);

    return Math.round(sum / total);
  }

  // compliance calculation
  // getCompliance(): number {
  //   if (!this.selectedSubmission) return 0;
  //   return this.surveyService.getCompliance(this.selectedSubmission);
  // }

  onSubmit() {
    if (!this.validateBeforeSubmit()) return;

    if (!this.selectedSubmission) return;

    this.selectedSubmission.surveys = this.selectedSubmission.surveys.map((s) => ({
      ...s,
      followStatus: s.followStatus || '',
      compliance: s.followStatus === 'following' ? 100 : 0,
    }));

    console.log('Submitted Data:', this.selectedSubmission);

    // Save changes to service (and localStorage)
    this.surveyService.updateSubmission(this.selectedSubmission);

    this.closeModal();
  }
}
