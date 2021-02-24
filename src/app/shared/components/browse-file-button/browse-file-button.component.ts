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
        entry_date: new Date(e?.entry_date),
        curp: e?.curp?.toUpperCase(),
        rfc: e?.rfc?.split('-').join('') || null,
        nss: parseInt(e?.nss?.split('-').join('')) || '',
        birthdate: e.birthdate ? new Date(e.birthdate) : null,
        lic_num: e?.lic_num,
        lic_validity: e.lic_validity !== null ? e.lic_validity === 'PERMANENTE' ? new Date('1/1/2100') : new Date(e?.lic_validity) : '',
        lic_type: e?.lic_type?.toUpperCase(),
        position: e?.position?.toUpperCase(),
        department: e?.department?.toUpperCase(),
        phone: parseInt(e?.phone?.split('-').join('')),
        email: e?.email?.toUpperCase(),
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
  birthdate: any;

  // Personal info
  curp: string;
  rfc: string;
  nss: number | string;
  nid?: string;
  lic_num: string;
  lic_type: string;
  lic_validity: Date | string;

  // Contact info
  email: string;
  phone: number;
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
  entry_date: Date | string;
  comments?: string;
  enabled: number | string;
}
