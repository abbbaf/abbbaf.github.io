const excelFileInput = document.getElementById("excel-file");
const outputDiv = document.getElementById("output");


excelFileInput.addEventListener("change", handleFiles);

function inbar(workbook) {
    const payment_types = {
        "אשראי" : [10,11,66],
        "המחאה" : [12,7,66],
        "העברה בנקאית" : [13,14,66],
        "מזומן" : [11,8,66]
    }
    let row = 1;
    const sheet = getSheetByIndex(workbook,0);
    let wait_for_receipt = false;
    return () => {
        let type = read_cell_value(sheet,row,0);
        let sum = read_cell_value(sheet,row,6);;
        while (!sum || !type || (!type.includes("חשבונית") && !type.includes("קבלה"))) {
            row += 1
            type = read_cell_value(sheet,row,0);
            sum = read_cell_value(sheet,row,6);
            if (type.includes("דרישה לתשלום")) {
                return null;
            }
        }
        const result = parseRow(sheet,row,[1],[''],6,9,4,5,1,1,2);
        let invoice = null;
        let receipt = null;
        if (type.includes("חשבונית")) 
            invoice = [150,66,6,...result]         
        if (type.includes("קבלה")) {
            receipt =
            wait_for_receipt = false;
            payment_type =  read_cell_value(sheet,row,10);
            result[2] = Math.abs(result[2]);
            result[3] = Math.abs(result[3]);
            if (type.includes("החזזר")) {
                result[2] *= -1
                result[3] *= -1
            }
            receipt = [...payment_types[payment_type],...result];
        }
        row += 1;
        return { data: [invoice, receipt], length: 2}
    }

}



function callbackExample(workbook) {
    //Initialize here
    return () => {
        /*
            Returns one of the following:
                1. an array
                2. Empty array for skipping
                3. null for end of sheet parsing
        */
    }
}

function parseRow(sheet,row,...columns) {
    let result = [];
    for (let column of columns) {
        if (Array.isArray(column))
            result.push(column[0]);
        else {
            const data = read_cell_value(sheet,row,column);
            result.push(data);
        }   
    }
    return result;
}

function getSheetByIndex(workbook,index) {
    const sheetName = workbook.SheetNames[index];
    return workbook.Sheets[sheetName];
}


function getCallback(filename,workbook) {
    const sheet = getSheetByIndex(workbook,0);
    if (read_cell_value(sheet,0,10) == "אמצעי תשלום") 
        return inbar(workbook);
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
    let filesProccessed = 0;
    const totalFiles = e.target.files.length;
    for (const file of e.target.files) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileData = new Uint8Array(e.target.result);
            const workbook = XLSX.read(fileData, { type: "array" });
            const filename = file.name;
            data += parse(filename,workbook) + "\n"; 
            if (++filesProccessed === totalFiles && data) {
                data = data.slice(0,-1);
                downloadData(data);
            }
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

function loopWorkbook(callback) {
    let data = "";
    let tempData = true;
    do {
        tempData = callback();
        if (tempData) {
            for (let dataIndex = 0; dataIndex < tempData.length; dataIndex++) {
                const resultRow = tempData.data[dataIndex];                
                if (resultRow == null) continue;
                data += resultRow.join('\t') + '\n';
            }
        }
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
