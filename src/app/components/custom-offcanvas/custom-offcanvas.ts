import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { Offcanvas } from 'bootstrap';

@Component({
  selector: 'app-custom-offcanvas',
  imports: [],
  templateUrl: './custom-offcanvas.html',
  styleUrl: './custom-offcanvas.scss',
})
export class CustomOffcanvas implements AfterViewInit, OnDestroy {
  @Input() id = 'customOffcanvas';
  @Input() width = '473px';
  @Input() topOffset = '48px';
  @Input() padding = '16px';

  @ViewChild('offcanvasRef') offcanvasRef!: ElementRef<HTMLDivElement>;
  private offcanvasInstance!: Offcanvas;
  private clickListener!: () => void;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    if (this.offcanvasRef?.nativeElement) {
      this.offcanvasRef.nativeElement.style.top = this.topOffset;

      // ✅ Create an Offcanvas instance safely
      this.offcanvasInstance = new Offcanvas(this.offcanvasRef.nativeElement, {
        scroll: true,
        backdrop: false,
        keyboard: true,
      });

      // ✅ Click outside listener
      this.clickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
        if (
          this.offcanvasRef &&
          !this.offcanvasRef.nativeElement.contains(event.target as Node) &&
          this.offcanvasRef.nativeElement.classList.contains('show')
        ) {
          this.offcanvasInstance.hide();
        }
      });
    }
  }

  open(): void {
    this.offcanvasInstance?.show();
  }

  close(): void {
    this.offcanvasInstance?.hide();
  }

  ngOnDestroy(): void {
    if (this.clickListener) this.clickListener(); // remove listener
  }
}


