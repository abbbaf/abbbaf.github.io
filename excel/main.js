const excelFileInput = document.getElementById("excel-file");
const outputDiv = document.getElementById("output");

excelFileInput.addEventListener("change", handleFiles);

function callbackExample() {
    //Initialize here
    return (sheet,startRow,startCol) => {
        /*
            Returns one of the following:
                1. Tab separated data
                2. Empty string for skipping
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
    const result = { startRow: 0, startCol: 0, sheet: firstSheet, callback: null};
    // Use if else statements to fill the result
    return result;
}


function parse(filename,workbook) {
    //Use if else statement to create the right callback function and starting row and column
    const metaData = getMetaData(filename,workbook);
    if (metaData == null)
        return alert("Excel format not supported.");
    const {startRow, startCol, sheet, callback} = metaData;
    if (callback == null)
        alert("Excel format not supported. " + filename);
    else
        return loopWorkbook(sheet,startRow,startCol,callback);
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
    if (data)
        downloadData(data);
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

function loopWorkbook(sheet,startRow,startColumn,callback) {
    let data = "";
    let tempData = "";
    let row = startRow;
    do {
        tempData = callback(sheet,row,startColumn);
        if (tempData)
            data += tempData + "\n";
        row += 1
    } while (tempData != null);
    return data.slice(0,-1)
} 

function downloadData(data) {
    const blob = new Blob([data], { type: 'text/plain' });
    const blobUrl = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = 'טעינה לרווחית.txt'; 
    downloadLink.click();

}
