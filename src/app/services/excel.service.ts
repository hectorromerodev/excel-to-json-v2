import { Injectable } from '@angular/core';
import { CellValue, Row, RowValues, Workbook, Worksheet } from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  generateExcel() {

  }

  async convertExcelToJson(data: Buffer) {
    // Read from a file
    const workbook = new Workbook();
    await workbook.xlsx.load(data)
      .then(() => {
        let worksheet = workbook.getWorksheet(1);
        let dataArray = this.changeRowsToDic(worksheet);
        console.log(dataArray);
      });
    // Use woorkbook


    // a.getWorksheet(1).eachRow((row, rowNumber) => {
    //   // console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
    //   row.eachCell((cell, colNumber) => {
    //     console.log('Cell ' + colNumber + ' = ' + JSON.stringify(cell.value));
    //     // console.log(cell);
    //   });
    // });
    // console.log(a.getWorksheet(1).getSheetValues()); // the json object
  }

  changeRowsToDic(worksheet: Worksheet) {
    let dataArray;
    let keys: CellValue[] | any;
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        keys = row.values;
      } else {
        let rowDic = this.cellValueToDic(keys, row);
        dataArray.push(rowDic);
      }
    });
    return dataArray;
  }
  cellValueToDic(keys: any, row: Row) {
    let data;
    row.eachCell((cell, colNumber) => {
      let value = cell.value;
      if (typeof value == "object") { value = value?.toString() };
      data[keys[colNumber]] = value;
    });
    return data;
  }
}
