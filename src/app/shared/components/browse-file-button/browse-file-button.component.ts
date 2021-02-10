import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-browse-file-button',
  templateUrl: './browse-file-button.component.html',
  styleUrls: ['./browse-file-button.component.scss']
})
export class BrowseFileButtonComponent implements OnInit {
  constructor() { }
  @ViewChild('uploadFileInput') uploadFileInput!: ElementRef;
  myFileName = 'Select a File';

  ngOnInit(): void {
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.myFileName = '';
      Array.from(fileInput.target.files).forEach((file: any) => {
        console.log(file); // <-- Debugging propose
        this.myFileName += file.name + ',';
      });

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          // Return Base64 Data URL
          const imgBase64Path = e.target.result;
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
      // Reset File Input to select same file again
      this.uploadFileInput.nativeElement.value = "";
    } else {
      this.myFileName = 'Select File';
    }
  }

}
