import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
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
  submittedSurveys = signal<SurveyData[]>([]);

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
    this.loadPreviousSubmissions();
  }

  // init form
  private initForm(): void {
    this.surveyForm = this.fb.group({
      surveys: this.fb.array([this.buildSurveyForm()]),
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
      adviceGiven: [data?.adviceGiven || '', Validators.required],
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
  }

  //  Step 6: Clear all surveys
  clearAll(): void {
    this.surveyForm = this.fb.group({
      surveys: this.fb.array([this.buildSurveyForm()]),
    });

    this.surveyForm.markAsPristine();
    this.surveyForm.markAsUntouched();
    this.surveyForm.updateValueAndValidity();
    this.clearAllData();
    this.closeModal();
  }

  clearAllData(): void {
    this.surveyService.clearAllSubmissions();
    this.submittedSurveys.set([]); // reset UI
    console.log('All survey data deleted');
  }

  private loadPreviousSubmissions(): void {
    const allSubmissions = this.surveyService.submissions();
    if (allSubmissions.length) {
      const lastSubmission = allSubmissions[allSubmissions.length - 1];
      this.submittedSurveys.set(lastSubmission.surveys.map((s, i) => ({ ...s, index: i })));
    }
  }

  //  Step 8: Helper to save to service
  private saveToService(): void {
    const current = this.surveysArray.value;
    this.surveyService.addSubmission(current);
    this.submittedSurveys.set(current.map((s: SurveyData, i: number) => ({ ...s, index: i })));
  }

  //  submit
  onSubmit(): void {
    if (this.surveyForm.invalid) {
      this.surveyForm.markAllAsTouched();
      return;
    }

    this.saveToService(); // sync service + signal
    console.log(this.submittedSurveys());
    
    // reset form
    this.surveyForm = this.fb.group({
      surveys: this.fb.array([this.buildSurveyForm()]),
    });
  }
}
