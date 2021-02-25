import { Injectable } from '@angular/core';
import { read, utils, WorkBook, WorkSheet } from 'xlsx';
import { saveAs } from 'file-saver';

const EXCEL_EXTENSION = '.xlsx';
const JSON_EXTENSION = '.json'
const CSV_EXTENSION = '.csv'
@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor() { }
  fileName: string = 'Excel to Json';

  generateExcel() {

  }

  convertExcelToJson(file: ArrayBuffer): Object {
    const workbook: WorkBook = read(file, { type: 'buffer' });
    const worksheetName: string = workbook.SheetNames[0];
    const worksheet: WorkSheet = workbook.Sheets[worksheetName];
    const json: Object = utils.sheet_to_json(worksheet);
    return json;
  }

  downloadJson(json: Object, fileName: string) {
    const theJson = JSON.stringify(json);
    const blobFile: Blob = new Blob([theJson], { type: 'text/json;charset=UTF-8' });
    saveAs(blobFile, `${fileName ? fileName : 'A Json'} - ${new Date().toLocaleDateString()}${JSON_EXTENSION}`);
  }

  downloadCSV(json: any, fileName: string) {
    const items = json;
    const replacer = (key: string, value: any) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(items[0])
    const csv = [
      header.join(','), // header row first
      ...items.map((row: any) => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n')
    const blobFile: Blob = new Blob([csv], { type: 'text/csv;charset=UTF-8' });
    saveAs(blobFile, `${fileName ? fileName : 'A csv'} - ${new Date().toLocaleDateString()}${CSV_EXTENSION}`);
  }
}
