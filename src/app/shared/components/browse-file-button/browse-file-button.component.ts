import { Clipboard } from '@angular/cdk/clipboard';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-browse-file-button',
  templateUrl: './browse-file-button.component.html',
  styleUrls: ['./browse-file-button.component.scss']
})
export class BrowseFileButtonComponent implements OnInit {
  constructor(
    private excelServ: ExcelService,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
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

  downloadCSV() {
    this.excelServ.downloadCSV(this.jsonData, this.myFileName);
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
    this.openSnackBar('JSON Copied to your clipboard!', 10000);
  }

  openFile() {
    let myWindow = window.open('', '', 'width=200,height=100');
    myWindow?.document.write(JSON.stringify(this.jsonData));
    myWindow?.stop();
  }

  openSnackBar(message: string, duration = 3000, action = 'OK',) {
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
        id: parseInt(e.id) || null,
        name: e.name?.toUpperCase(),
        paternal_surname: e.surname.split(' ')[0]?.toUpperCase(),
        maternal_surname: e.surname.split(' ')[1]?.toUpperCase(),

        entry_date: e.entry_date ? this.datePipe.transform(e.entry_date, 'YYYY-MM-dd') : '1000-01-01',
        curp: e?.curp?.toUpperCase(),
        rfc: e?.rfc?.split('-').join('') || null,
        nss: parseInt(e?.nss?.split('-').join('')) || '',

        birthdate: e.birthdate ? this.datePipe.transform(e.birthdate, 'YYYY-MM-dd') : '1000-01-01',
        lic_num: e?.lic_num,

        lic_validity: e.lic_validity ? e.lic_validity === 'PERMANENTE' ? this.datePipe.transform('9999-12-31', 'YYYY-MM-dd') : this.datePipe.transform(e.lic_validity, 'YYYY-MM-dd') : '1000-01-01',
        lic_type: e?.lic_type?.toUpperCase(),
        position: e?.position?.toUpperCase(),
        department: e?.department?.toUpperCase(),
        phone: e.phone ? parseInt(e.phone?.split('-').join('')) : null,
        email: e?.email?.toUpperCase(),
        branch_office: e?.branch_office,
        enabled: 1
      })
    });
    console.log(employee);
    this.jsonData = employee;
  }
}


export interface PersonI {
  id: any;
  name: string;
  paternal_surname: string;
  maternal_surname?: string;
}

export interface Employee extends PersonI {
  // Employee info
  photo?: string;
  birthdate: Date | string | null;

  // Personal info
  curp: string;
  rfc: string;
  nss: number | string;
  nid?: string;
  lic_num: string;
  lic_type: string;
  lic_validity: Date | string | null;

  // Contact info
  email: string;
  phone: number | null;
  addr_street?: string;
  addr_no?: string;
  addr_neighborhood?: string;
  addr_postcode?: string;
  addr_town?: string;
  addr_state?: string;

  // Working info
  position: string;
  department: string;
  branch_office?: string;
  entry_date: Date | string | null;
  comments?: string;
  enabled: number | string;
}
