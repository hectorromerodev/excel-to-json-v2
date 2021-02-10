import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-browse-file-button',
  templateUrl: './browse-file-button.component.html',
  styleUrls: ['./browse-file-button.component.scss']
})
export class BrowseFileButtonComponent implements OnInit {
  constructor(
    private excelServ: ExcelService
  ) { }
  @ViewChild('uploadFileInput') uploadFileInput!: ElementRef;
  myFileName = 'Select a File';

  ngOnInit(): void {
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.myFileName = '';
      Array.from(fileInput.target.files).forEach((file: any) => {
        console.log(file); // <-- Debugging propose
        this.myFileName += file.name;
      });

      this.excelServ.convertExcelToJson(fileInput.target.files[0]);
      // Reset File Input to select same file again
      this.uploadFileInput.nativeElement.value = "";
    } else {
      this.myFileName = 'Select File';
    }
  }

  import(evt: any) {
    const target: DataTransfer = (evt.target) as DataTransfer;
    const file = target.files[0];
    const reader: FileReader = new FileReader();
    let importResult = [];

    if (target.files.length !== 1) {
      console.error('You can only import just one file at time');
    }

    reader.readAsArrayBuffer(file);
    reader.onload = (e: any) => {
      try {
        const bstring = e.target.result;
        this.excelServ.convertExcelToJson(bstring);
        // const wb: WorkBook = read(bstring, { type: 'binary' });
        // const wsname: string = wb.SheetNames[0];
        // const ws: WorkSheet = wb.Sheets[wsname];
        // importResult = utils.sheet_to_json(ws, { raw: false });
        // this.handleImport(importResult);
      } catch (e) {
        // Reset the import input
        console.error('File type not valid');
      }
    }
    this.uploadFileInput.nativeElement.value = '';
  }
}
