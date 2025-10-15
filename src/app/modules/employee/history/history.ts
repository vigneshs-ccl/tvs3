import { CommonModule, NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SurveyService } from '@app/core/services/survey/survey.service';
import { SurveyData } from '@app/interface/surveyData';
import { SurveySubmission } from '@app/interface/surveySubmission';

@Component({
  selector: 'app-history',
  imports: [NgClass, CommonModule, FormsModule],
  templateUrl: './history.html',
  styleUrls: ['./history.scss'],
})
export class History {
  surveyService = inject(SurveyService);

  // Modal state
  isModalOpen = false;

  // Readonly submissions signal
  submissions = computed(() => this.surveyService.submissions());

  ngOnInit() {
    // Ensure all followStatus fields are initialized
    const allSubmissions = this.submissions();
    allSubmissions.forEach((submission) => {
      submission.surveys.forEach((survey) => {
        if (survey.followStatus === undefined || survey.followStatus === null) {
          survey.followStatus = ''; // ensures placeholder shows
        }
      });
    });
  }

  // Open modal
  openModal() {
    this.isModalOpen = true;
  }

  // Close modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Track by for submissions
  trackBySubmission(index: number, item: SurveySubmission) {
    return item.id;
  }

  // Track by for surveys
  trackBySurvey(index: number, item: SurveyData) {
    return item.adviceGiven + index;
  }


  // overall compliance calculation
  getOverallCompliance(): number {
    return this.surveyService.getOverallCompliance();
  }

  // Save the latest submission (only editable surveys)
  saveLatestSubmission() {
    const submissionsList = this.submissions();
    if (!submissionsList.length) return;

    // latest submission is last in original array
    const latestSubmission = submissionsList[submissionsList.length - 1];

    // Update the submission in the service
    this.surveyService.updateSubmission(latestSubmission);
    this.closeModal();
    // alert('Latest submission updated successfully!');
  }

  onFollowStatusChange(submission: SurveySubmission) {
    // Update immediately in SurveyService
    this.surveyService.updateSubmission(submission);
  }
}
