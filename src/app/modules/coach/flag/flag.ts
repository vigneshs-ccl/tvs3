import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomModal } from '@app/components/custom-modal/custom-modal';
import { Card } from '@app/interface/flag-card';
import { FlagService } from '@app/core/services/flag/flag.service';
interface Option {
  id: number;
  name: string;
  selected: boolean;
}
@Component({
  selector: 'app-flag',
  imports: [CommonModule, CustomModal, FormsModule],
  templateUrl: './flag.html',
  styleUrl: './flag.scss',
})
export class Flag {
  showModal = false;
  today: string = '';
  description: string = '';
  selectedDate: string = '';
  submitAttempted = false;
  private flagService = inject(FlagService);

  @ViewChild('dateInput1', { static: true }) dateInput!: ElementRef;
  @ViewChild('dropdownBtn', { static: true }) dropdownBtn!: ElementRef;
  @ViewChild('flagContainer', { static: false }) flagContainer!: ElementRef;
  selectedCard: Card | null = null;
  dropdownOpen = false;
  dropdownTop = 0;
  dropdownLeft = 0;
  dropdownWidth = 0;
  searchTerm = '';

  ngOnInit() {
    const now = new Date();
    this.today = now.toISOString().split('T')[0]; // format: yyyy-mm-dd
  }

  options: Option[] = [
    { id: 1, name: 'Employee name', selected: false },
    { id: 2, name: 'Coach 1', selected: false },
    { id: 3, name: 'Coach 2', selected: false },
    { id: 4, name: 'Coach 3', selected: false },
  ];

  cardData = [
    {
      id: 1,
      title: 'D3',
      unit: '(ng/mL)',
      value: 130,
    },
    {
      id: 2,
      title: 'B12',
      unit: '(pg/mL)',
      value: 220,
    },
    {
      id: 3,
      title: 'LDL',
      unit: '(mg/dL)',
      value: 18.5,
    },
    {
      id: 4,
      title: 'BP',
      unit: '(mm/Hg)',
      value: 125,
    },
    {
      id: 5,
      title: 'Hs CRP',
      unit: '(mg/L)',
      value: 255,
    },
    {
      id: 6,
      title: 'HBA1C',
      unit: '(%)',
      value: 7.5,
    },
  ];

  openModal(card: Card) {
    this.selectedCard = card;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedCard = null;
  }

  // dropdown toggle button
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Computed property for "Send mail to" validation
  get isSendMailSelected(): boolean {
    return this.options.some((o) => o.selected);
  }

  filteredOptions() {
    return this.options.filter((o) => o.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  getSelectedText() {
    const selected = this.options.filter((o) => o.selected).map((o) => o.name);
    return selected.length ? selected.join(', ') : 'Select options';
  }

  openNativeDatePicker() {
    this.dateInput.nativeElement.showPicker?.(); // modern browsers
  }

  // Listen for clicks anywhere in the document
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    // <-- Make sure this is MouseEvent
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.dropdownOpen = false;
    }
  }

  // flag
  hasFlag(cardId: number): boolean {
    const flags = this.flagService.flags();
    return flags.some((f) => f.cardId === cardId);
  }

  removeFlag(card: Card) {
    const flag = this.flagService.flags().find((f) => f.cardId === card.id);
    if (!flag) return;

    this.flagService.removeFlag(flag.id);
  }

  getFlagData(cardId: number) {
    const flags = this.flagService.flags();
    return flags.find((f) => f.cardId === cardId);
  }

  adjustTooltipPosition(event: MouseEvent, cardId: number) {
    const container = (event.currentTarget as HTMLElement).closest('.flag-tooltip-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const screenWidth = globalThis.innerWidth;

    // Reset classes first
    container.classList.remove('align-left', 'align-right');

    // If near left edge
    if (rect.left < 150) {
      container.classList.add('align-left');
    }
    // If near right edge
    else if (screenWidth - rect.right < 150) {
      container.classList.add('align-right');
    }
    // Otherwise keep centered (default)
  }

  //  MAIN SUBMIT FUNCTION
  onSubmit() {
    this.submitAttempted = true;
    if (!this.selectedCard) return;

    // Stop submission if any field is invalid
    if (!this.description.trim() || !this.selectedDate || !this.isSendMailSelected) {
      return;
    }

    const selectedSendTo = this.options.filter((o) => o.selected).map((o) => o.name);

    // Prepare flag data (omit id, service will create it)
    const newFlag = {
      cardId: this.selectedCard.id,
      title: this.selectedCard.title,
      unit: this.selectedCard.unit,
      value: this.selectedCard.value,
      description: this.description,
      date: this.selectedDate,
      sendTo: selectedSendTo,
    };

    this.flagService.addFlag(newFlag);
    // console.log('Flag added:', newFlag);
    this.closeModal();
    this.description = '';
    this.selectedDate = '';
    this.options.forEach((o) => (o.selected = false));
    this.submitAttempted = false;
  }
}
