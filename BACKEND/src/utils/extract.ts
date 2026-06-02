import  XLSX from 'xlsx';


export const extractSpreadsheetData = (filePath: string): any[] => {
 
  const workbook: XLSX.WorkBook = XLSX.readFile(filePath);


  const firstSheetName: string = workbook.SheetNames[0];
  const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];

  const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
    defval: false, 
    raw: false,   
  });

  return jsonData;
};

