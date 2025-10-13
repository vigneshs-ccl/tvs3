import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  imports: [CommonModule],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.scss'
})
export class StarRating {
  @Input() rating = 0; // current rating
  @Input() max = 5; // max stars
  @Input() starSize:string = '24px'; // size of star
  @Input() starSrc:string = ''; // default star icon
  @Output() ratingChange = new EventEmitter<number>();

  hoverIndex = 0;

  setRating(index: number) {
    this.rating = index;
    this.ratingChange.emit(this.rating);
  }

  setHover(index: number) {
    this.hoverIndex = index;
  }

  clearHover() {
    this.hoverIndex = 0;
  }
}
