const excelFileInput = document.getElementById("excel-file");
const outputDiv = document.getElementById("output");

excelFileInput.addEventListener("change", handleFiles);

function inbar() {
    const payment_types = {
        "אשראי" : [10,11,66],
        "המחאה" : [12,7,66],
        "העברה בנקאית" : [13,14,66],
        "מזומן" : [11,8,66]
    }
    return (sheet,row,col) => {
        const sum = read_cell_value(sheet,row,6);
        if (!sum)
            return [];
        const sum_with_vat = read_cell_value(sheet,row,9);
        const type = read_cell_value(sheet,row,0);
        const date = read_cell_value(sheet,row,4);
        const details = read_cell_value(sheet,row,2);
        const document_number = read_cell_value(sheet,row,1);
        let result = [1,'',sum,sum_with_vat,date,date,document_number,document_number,details];
        if ("חשבונית" in type)
            return result
        if ("קבלה" in type) {
        }

        
        
        
}

function callbackExample() {
    //Initialize here
    return (sheet,row,col) => {
        /*
            Returns one of the following:
                1. an array
                2. Empty array for skipping
                3. null for end of sheet parsing
        */
    }
}

function getSheetByIndex(workbook,index) {
    const sheetName = workbook.SheetNames[index];
    return workbook.Sheets[sheetName];
}


function getMetaData(filename,workbook) {
    const firstSheet = getSheetByIndex(workbook,0);
    const result = { startRow: 0, sheet: firstSheet, callback: null};
    // Use if else statements to fill the result
    return result;
}


function parse(filename,workbook) {
    //Use if else statement to create the right callback function and starting row and column
    const metaData = getMetaData(filename,workbook);
    if (metaData == null)
        return alert("Excel format not supported.");
    const {startRow, sheet, callback} = metaData;
    if (callback == null)
        alert("Excel format not supported. " + filename);
    else
        return loopWorkbook(sheet,startRow,callback);
}


function handleFiles(e) {
    let data = "";
    for (const file of e.target.files) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileData = new Uint8Array(e.target.result);
            const workbook = XLSX.read(fileData, { type: "array" });
            const filename = file.name;
            data += parse(filename,workbook) + "\n"; 
        };
        reader.readAsArrayBuffer(file);
    }
    if (data) {
        data = data.slice(0,-1);
        downloadData(data);
    }
}

function read_cell_value(sheet,row,column) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: column });
    return sheet[cellAddress] && sheet[cellAddress].v;
}

function find(sheet,searchValue) {
    for (let rowNum = 0; rowNum <= XLSX.utils.decode_range(sheet['!ref']).e.r; rowNum++) {
        for (let colNum = 0; colNum <= XLSX.utils.decode_range(sheet['!ref']).e.c; colNum++) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
            const cellValueObject = sheet[cellAddress];
            if (cellValueObject && cellValueObject.v === searchValue) 
                return { row: rowNum, column: colNum };
        }
    }
    return null;
}

function loopWorkbook(sheet,startRow,callback) {
    let data = "";
    let row = startRow;
    do {
        const tempData = callback(sheet,row,startColumn);
        if (tempData && tempData.length)
            data += tempData.join('\t') + "\n";
        row += 1;
    } while (tempData != null);
    return data;
} 

function downloadData(data) {
    const blob = new Blob([data], { type: 'text/plain' });
    const blobUrl = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = 'טעינה לרווחית.txt'; 
    downloadLink.click();

}
