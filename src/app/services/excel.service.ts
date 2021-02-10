import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  generateExcel() {

  }

  async convertExcelToJson(data: Buffer) {
    const workbook = new Workbook();
    await workbook.xlsx.load(data);
    const json = JSON.stringify(workbook.model);
    return json;
  }
}
