const excelFileInput = document.getElementById("excel-file");
const outputDiv = document.getElementById("output");

excelFileInput.addEventListener("change", handleFile);

function handleFile(e) {
    const file = e.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];

            const firstSheet = workbook.Sheets[firstSheetName];
            const cellValue = read_cell_value(firstSheet,0,0);

            console.log(cellValue);
            console.log(find(firstSheet,"שישי"));
        };

        reader.readAsArrayBuffer(file);
    }
}

function read_cell_value(sheet,row,column) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: column });
    return sheet[cellAddress] || sheet[cellAddress].v;
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

/*

0,0 

*/