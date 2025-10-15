import { Component } from '@angular/core';
import { CustomModal } from '@app/components/custom-modal/custom-modal';

@Component({
  selector: 'app-example',
  imports: [CustomModal],
  templateUrl: './example.html',
  styleUrl: './example.scss',
})
export class Example {
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
