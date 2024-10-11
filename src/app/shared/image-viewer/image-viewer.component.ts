import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent implements OnInit {

  @Input() images!: { url: string; descripcion: string }[];
  currentIndex = 0;
  isVisible = false;

  constructor() { }

  ngOnInit(): void {
  }

  openViewer(index: number) {
    this.currentIndex = index;
    this.isVisible = true;
  }

  closeViewer() {
    this.isVisible = false;
  }

  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Volver al inicio si está en la última imagen
    }
  }

  previousImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1; // Volver a la última imagen si está en la primera
    }
  }

}
