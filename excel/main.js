const excelFileInput = document.getElementById("excel-file");
const outputDiv = document.getElementById("output");

excelFileInput.addEventListener("change", handleFiles);

function inbar(sheet,start_row) {
    const payment_types = {
        "אשראי" : [10,11,66],
        "המחאה" : [12,7,66],
        "העברה בנקאית" : [13,14,66],
        "מזומן" : [11,8,66]
    }
    let row = start_row;
    let wait_for_receipt = false;
    return () => {
        let sum = read_cell_value(sheet,row,6);
        while (!sum) {
            row += 1
            sum = read_cell_value(sheet,row,6);
        }
        const sum_with_vat = read_cell_value(sheet,row,9);
        const type = read_cell_value(sheet,row,0);
        const date = read_cell_value(sheet,row,4);
        const details = read_cell_value(sheet,row,2);
        const document_number = read_cell_value(sheet,row,1);
        const result = [1,'',sum,sum_with_vat,date,date,document_number,document_number,details];
        if (type.includes("חשבונית")) {
            if (!wait_for_receipt) {
                if (type.includes("קבלה"))
                    wait_for_receipt = true;
                else
                    row += 1;
                return [150,66,6,...result]
            }           
        }
        if (type.includes("קבלה")) {
            wait_for_receipt = false;
            payment_type =  read_cell_value(sheet,row,10);
            result[2] = Math.abs(result[2]);
            result[3] = Math.abs(result[3]);
            if ("החזר" in type) {
                result[2] *= -1
                result[3] *= -1
            }
            row += 1
            return [...payment_types[payment_type],...result];
        }
        if ("דרישה לתשלום" in type) 
            return null;
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


function getCallback(filename,workbook) {
    const sheet = getSheetByIndex(workbook,0);
    if (read_cell_value(sheet,0,10) == "אמצעי תשלום") 
        return inbar(sheet,1);
    return null
}


function parse(filename,workbook) {
    //Use if else statement to create the right callback function and starting row and column
    const callback = getCallback(filename,workbook);
    if (callback == null)
        alert("Excel format not supported. " + filename);
    else
        return loopWorkbook(callback);
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

function loopWorkbook(callback) {
    let data = "";
    let tempData = true;
    do {
        tempData = callback();
        if (tempData)
            data += tempData.join('\t') + "\n";
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
