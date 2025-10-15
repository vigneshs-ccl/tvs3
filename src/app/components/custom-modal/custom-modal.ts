import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-custom-modal',
  imports: [NgClass,CommonModule],
  templateUrl: './custom-modal.html',
  styleUrl: './custom-modal.scss'
})
export class CustomModal {
   @Input() isOpen = false;
  @Input() title = '';
  @Input() compliance?: string; // optional, since some modals show "Compliance: 90%"
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'lg';
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  submitModal() {
    this.submit.emit();
  }
}
