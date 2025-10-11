import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SurveyService } from '@app/core/services/survey/survey.service';
import { SurveyData } from '@app/interface/surveyData';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./survey.scss'],
})
export class Survey {
  surveyForm!: FormGroup; // The main form
  isModalOpen = false;
  submittedSurveys: SurveyData[] = [];

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  constructor(
    private fb: FormBuilder,
    private surveyService: SurveyService,
  ) {
    this.initForm();
  }

  //  Step 1: Initialize the form
  private initForm(): void {
    const savedSurveys = this.surveyService.surveys(); // Get from service

    this.surveyForm = this.fb.group({
      surveys: this.fb.array(
        savedSurveys.length
          ? savedSurveys.map((survey) => this.buildSurveyForm(survey))
          : [this.buildSurveyForm()],
      ),
    });
  }

  //  Step 2: Shortcut to access 'surveys' array
  get surveysArray(): FormArray {
    return this.surveyForm.get('surveys')! as FormArray;
  }

  //  Step 3: Create one survey group
  private buildSurveyForm(data?: SurveyData): FormGroup {
    // today date will be used
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getFullYear()}`;
    return this.fb.group({
      surveyGiven: [data?.surveyGiven || '', Validators.required],
      frequency: [data?.frequency || '', Validators.required],
      remarks: [data?.remarks || '', Validators.required],
      date: [data?.date || formattedDate],
    });
  }

  //  Step 4: Add a new survey
  addSurvey(): void {
    this.surveysArray.push(this.buildSurveyForm());
  }

  //  Step 5: Remove a survey by index
  removeSurvey(index: number): void {
    this.surveysArray.removeAt(index);
    this.saveToService();
  }

  //  Step 6: Clear all surveys
  clearAll(): void {
    this.surveyForm = this.fb.group({
      surveys: this.fb.array([this.buildSurveyForm()]),
    });

    this.surveyForm.markAsPristine();
    this.surveyForm.markAsUntouched();
    this.surveyForm.updateValueAndValidity();

    this.saveToService();
    this.submittedSurveys = [];
    this.closeModal();
  }

  //  Step 7: Handle form submission
  onSubmit(): void {
    if (this.surveyForm.invalid) {
      this.surveyForm.markAllAsTouched();
      return;
    }

    this.saveToService();
    this.submittedSurveys = [...this.surveysArray.value];
    console.log('Saved Surveys:', this.surveysArray.value);
    console.log(' Submitted Surveys:', this.submittedSurveys);

    // Optional: Reset the form to a fresh single row
    this.surveyForm = this.fb.group({
      surveys: this.fb.array([this.buildSurveyForm()]),
    });
  }

  //  Step 8: Helper to save to service
  private saveToService(): void {
    this.surveyService.setSurveys(this.surveysArray.value);
  }
}
