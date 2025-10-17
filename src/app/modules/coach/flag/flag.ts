import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomModal } from '@app/components/custom-modal/custom-modal';

interface Card {
  id: number;
  title: string;
  unit: string;
  value: number;
}

@Component({
  selector: 'app-flag',
  imports: [CommonModule, CustomModal],
  templateUrl: './flag.html',
  styleUrl: './flag.scss',
})
export class Flag {
  showModal = false;

  selectedCard: Card | null = null;

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
      title: 'Iron',
      unit: '(µg/dL)',
      value: 75,
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
}
