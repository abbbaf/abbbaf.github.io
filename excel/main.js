const excelFileInput = document.getElementById("excel-file");
const outputDiv = document.getElementById("output");

excelFileInput.addEventListener("change", handleFile);



function parse(sheet) {
    //Use if else statement to create the right callback function and starting row and column
    let callback = null
    let [startRow, startCol] = [0,0]; // startRow is one less than the actual starting row
 
    if (callback == null)
        alert("Excel format not supported.");
 
    loopAndDownload(sheet,startRow,startCol,callback);
}


function handleFile(e) {
    const file = e.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[firstSheetName];
            parse(sheet);
        };

        reader.readAsArrayBuffer(file);
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

function loopAndDownload(sheet,startRow,startColumn,callback) {
    let data = "";
    let tempData = "";
    let row = startRow;
    do {
        row += 1
        tempData = callback(sheet,row,startColumn);
        data += tempData;
    } while (tempData)
    downloadData(data);
} 

function downloadData(data) {
    const blob = new Blob([data], { type: 'text/plain' });
    const blobUrl = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = 'טעינה לרווחית.txt'; 
    downloadLink.click();

}

/*

(simx)^2 + (sin2x)^2 = sin(3x)^2

sinx^2 + 4sinx^2cosx^2 = sin3x^2


*/
