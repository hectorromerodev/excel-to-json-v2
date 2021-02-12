import { Clipboard } from '@angular/cdk/clipboard';
import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ExcelService } from 'src/app/services/excel.service';
import { ConvertExcel } from '../../interfaces/convert-excel';

@Component({
  selector: 'app-browse-file-button',
  templateUrl: './browse-file-button.component.html',
  styleUrls: ['./browse-file-button.component.scss']
})
export class BrowseFileButtonComponent implements OnInit {
  constructor(
    private excelServ: ExcelService,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
  ) { }
  @ViewChild('uploadFileInput') uploadFileInput!: ElementRef;
  myFileName = 'Select a File';
  jsonData: any;
  showOptions: boolean = false;
  ngOnInit(): void { }

  import(fileInput: any) {
    const target: DataTransfer = <DataTransfer>(fileInput.target);
    // Validate just one file at time
    if (target.files.length === 1) {
      const file: File = target.files[0];
      const reader: FileReader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (evt: any) => {
        this.myFileName = file.name.split('.')[0];
        this.jsonData = this.excelServ.convertExcelToJson(evt.target.result);
        this.showOptions = true;
      };
    } else {
      this.myFileName = 'Select File';
      this.showOptions = false;
      throw new Error('You can only import one file at time');
    }
    this.uploadFileInput.nativeElement.value = '';
  }

  download() {
    this.excelServ.downloadJson(this.jsonData, this.myFileName);
  }

  copyJson() {
    const pending = this.clipboard.beginCopy(JSON.stringify(this.jsonData));
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        // Destroy the
        pending.destroy();
      }
    };
    attempt();
    this.openSnackBar('JSON Copied to your clipboard!!!');
  }

  openFile() {
    let myWindow = window.open('', '', 'width=200,height=100');
    myWindow?.document.write(JSON.stringify(this.jsonData));
    myWindow?.stop();
  }

  openSnackBar(message: string, action = 'OK', duration = 3000) {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  transformEmployees() {
    const employee: Employee[] = [];
    this.jsonData.forEach((e: any) => {
      employee.push({
        id: e.id,
        name: e.name?.toUpperCase(),
        paternal_surname: e.surname.split(' ')[0]?.toUpperCase(),
        maternal_surname: e.surname.split(' ')[1]?.toUpperCase()
      })
    });
    this.jsonData = employee;
  }
}

interface Employee {
  id: number | string;
  name: string;
  paternal_surname: string;
  maternal_surname: string;
}
