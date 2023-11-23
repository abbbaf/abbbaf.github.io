const excelFileInput = document.getElementById("excel-file");
const outputDiv = document.getElementById("output");
const END_OF_PARSING = 2;
const ERROR = 3;

const HebreCharacters = 'אבגדהוזחטיךכלםמןנסעףפץצקרשת';
const Windows1255 = [224,225,226,227,228,229,230,231,232,233,234,235,236,237,238
                    ,239,240,241,242,243,244,245,246,247,248,249,250]
                    .map(code => String.fromCharCode(code))

excelFileInput.addEventListener("change", handleFiles);

class InvalidFormatException extends Error {
    constructor() {
        super();
    }
}

const generators = [

    /*
    function* generatorExample(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        let row = 1 
        const columnsOrder = []; 
        const firstValue = parseRow(sheet,1,...columnsOrder);
        if (firstValue) yield true;
        else return false;
        while (true) { 
            if (endOfParsing) return END_OF_PARSING;
            const result = parseRow(sheet,row++,[1],[''],...columnsOrder);
            if (result == null) throw new InvalidFormatException(); 
            yield [...result]
        }
    },
    */

    function* inbar(workbook) {
        const sheet = getSheetByIndex(workbook,0);
        let row = 1;
        const columnsOrder = [6,9,4,5,1,1,2];
        const firstValues = parseRow(sheet,row,...columnsOrder);
        if (firstValues) yield true;
        else return false;
        const paymentTypes = {
            "אשראי" : [10,11,66],
            "המחאה" : [12,7,66],
            "העברה בנקאית" : [13,14,66],
            "מזומן" : [11,8,66]
        }
        while (true) {
            let type = readCellValue(sheet,row,0);
            if (!type) {
                if (!readCellValue(sheet,row+1,0)) break;
                row++;
                continue;
            }
            const result = parseRow(sheet,row,[1],[''],...columnsOrder);
            if (result[4] == 0) continue;
            if (type.includes("חשבונית")) 
                yield [150,66,6,...result];
            if (type.includes("קבלה")) {
                const paymentType =  readCellValue(sheet,row,10);
                result[2] = Math.abs(result[2]);
                result[3] = Math.abs(result[3]);
                if (type.includes("החזזר")) {
                    result[2] *= -1
                    result[3] *= -1
                }
                yield [...paymentTypes[paymentType],...result];
            }
        }
    },



    function* agmInvoiceVilla(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        let row = 1 
        const columnsOrder = [8,8,0,0,6,6,4]; 
        const firstValue = parseRow(sheet,1,...columnsOrder);
        if (firstValue && /^3|(85)/.test(firstValue[4]))  yield true;
        else return false;
        while (readCellValue(sheet,row,0)) 
            yield [160,66,5,...parseRow(sheet,row++,[1],[''],...columnsOrder)];
    },


    function* agmInvoiceRoyal(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        let row = 1 
        const columnsOrder = [8,8,0,0,6,6,4]; 
        const firstValue = parseRow(sheet,1,...columnsOrder);
        if (firstValue && /^4|(86)/.test(firstValue[4]))  yield true;
        else return false;
        while (readCellValue(sheet,row,0)) 
            yield [150,66,6,...parseRow(sheet,row++,[1],[''],...columnsOrder)];
    },

    function* agmReceipts(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        let row = 1 
        const columnsOrder = [8,8,0,0,3,4,5]; 
        const firstValue = parseRow(sheet,1,...columnsOrder);
        if (firstValue)  yield true;
        else return false;
        const paymentTypes = {
            "BIT" : [10,9,66],
            "CASH" : [12,8,66],
            "CC" : [14,11,66],
            "NOCC" : [14,11,66],
            "TR" : [10,9,66],
            "CH" : [9,7,66], 
        }
        while (readCellValue(sheet,row,0) !== "סוג") {
            if (!readCellValue(sheet,row,0)) {
                row++;
                continue;
            }
            const result = parseRow(sheet,row,[1],[''],...columnsOrder);
            result[4] = result[4].split(' ')[0];
            result[5] = result[6].split(' ')[0];
            const paymentTypeArray = paymentTypes[readCellValue(sheet,row++,6)];
            yield [...paymentTypeArray,...result]
        }
    },

    function* leumi(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,0,0);
        let row, creditcard;
        if (firstCell && firstCell.includes("בנק לאומי")
            && (row = findRow(sheet,"תאריך העסקה")) !== null
            && (creditcard = getCreditCard(sheet,4,0))) yield true;
        else return false;
        row++;
        const date = window.prompt("Enter date (dd/mm/yyyy)");
        while (readCellValue(sheet,row,0)) { 
            let result = parseRow(sheet,row++,[0],[date],5,[''],[creditcard],1);
            if (result[2] < 0) {
                result[3] = result[2];
                result[2] = '';
            }
            yield result
        }
        return [0,date,'',readCellValue(sheet,row,5),creditcard,"חיוב בבנק"];
    },

    function* mizrahi(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,0,0);
        let row, creditcard;
        if (firstCell && firstCell.includes("myCcList")
            && (row = findRow(sheet,"בית העסק")) !== null
            && (creditcard = getCreditCard(sheet,++row,0)) !== null)  yield true;
        else return false
        let totals = {};
        while (readCellValue(sheet,row,0)) {
            let result = parseRow(sheet,row++,[0],0,4,[''],[creditcard],2);
            if (result[2] < 0) {
                result[3] = result[2];
                result[2] = '';
            }
            const date = result[1];
            if (!(date in totals))
                totals[date] = 0;
            totals[date] += result[2];
            yield result
        }
        for (let [date,total] of Object.entries(totals))
            yield [0,date,'',parseFloat(total).toFixed(2),creditcard,"חיוב בבנק"];
    },

    function* discount(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,0,0);
        let row, creditcard, date;
        if (firstCell && firstCell.includes("פירוט עסקאות בכרטיסים")
            && (row = findRow(sheet,"בית עסק")) !== null
            && (creditcard = getCreditCard(sheet,++row,0) !== null)  
            && (date = readCellValue(sheet,row,7)) !== null) yield true;
        else return false
        let total = 0;
        while (readCellValue(sheet,row,1)) {
            let result = parseRow(sheet,row++,[0],[date],8,[''],[creditcard],1);
            total += result[2]
            if (result[2] < 0) {
                result[3] = result[2];
                result[2] = '';
            }
            yield result
        }
        yield [0,date,'',total,creditcard,"חיוב בבנק"];
    },

    function* hahayal(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,4,1);
        let row = 6
        let creditcard;
        if (firstCell && firstCell.includes("עסקאות בשקלים חיוב בתאריך") 
            && (creditcard = getCreditCard(sheet,3,1) !== null))  yield true;
        else return false;
        const date = firstCell.split(' ')[4];
        while (readCellValue(sheet,row,1)) {
            let result = parseRow(sheet,row++,[0],[date],4,[''],[creditcard],2);
            if (result[2] < 0) {
                result[3] = result[2];
                result[2] = '';
            }
            yield result
        }
        const total = readCellValue(sheet,row+1,4);
        yield [0,date,'',total,creditcard,"חיוב בבנק"];
    },
    
    function* poalim(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,2,0);
        let row, creditcard
        if (firstCell && firstCell.includes("חיובים קודמים")
            && (row = findRow("שם בית עסק")) !== null
            && (creditcard = getCreditCard(sheet,++row,0) !== null))  yield true;
        else return false
        let totals = {};
        let isAbroad = false;
        let date = null;
        for (let sumColumn = 5; sumColumn >= 4; sumColumn--) {
            while (readCellValue(sheet,row,0)) {
                date = excelSerialNumberToDate(readCellValue(sheet,row,1));
                let result = parseRow(sheet,row++,[0],[date],sumColumn,[''],[creditcard],3);
                if (result[2] < 0) {
                    result[3] = result[2];
                    result[2] = '';
                }
                yield result
                if (!(date in total)) totals[date] = 0;
                totals[date] += result[2];
            }
            row += 5;
        }
        for (let [date,total] in Object.entries(totals)) 
            yield [0,date,'',total.toFixed(2),creditcard,"חיוב בבנק"];

    },


    function* cal(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,0,0);
        let row, creditcard;
        if (firstCell && firstCell.includes("עסקאות לחשבון לאומי לישראל")
            && (row = findRow("שם בית עסק")) !== null
            && (creditcard = getCreditCard(sheet,0,0)) !== null) yield true;
        else return false;
        const date = readCellValue(sheet,findRow(sheet,"לחיוב"),0).match(/\d+\/\d+\/\d+/)[0];
        let total = 0;
        row++;
        while (true) {
            if (!readCellValue(sheet,row,1)) {
                if (readCellValue(sheet,row+1,1)) {
                    row++;
                    continue;
                }
                break;
            }
            let result = parseRow(sheet,row++,[0],[date],3,[''],[creditcard],1);
            total += parseFloat(result[2]);
            if (result[2] < 0) {
                result[3] = result[2];
                result[2] = '';
            }
            yield result
        }
        yield [0,date,'',total.toFixed(2),creditcard,"חיוב בבנק"];
    },

    
    function* yahav(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,0,0);
        let row, creditcard;
        if (firstCell && firstCell.includes("בנק יהב")
            && (row = findRow("תיאור פעולה")) !== null
            && (creditcard = getCreditCard(sheet,4,1)) !== null) yield true;
        else return false;
        row++;
        let date = excelSerialNumberToDate(readCellValue(sheet,4,3));
        while (readCellValue(sheet,row,1)) {
            let result = parseRow(sheet,row++,[0],[date],4,[''],[creditcard],1);
            if (result[2] < 0) {
                result[3] = result[2];
                result[2] = '';
            }
            yield result
        }
        const total = readCellValue(sheet,row,4).toFixed(2);
        yield [0,date,'',total,creditcard,"חיוב בבנק"];
    },

]

function getCreditCard(sheet,row,column) {
    const cellValue = readCellValue(sheet,row,column);
    const matched = cellValue && cellValue.match(/(?<!\d)\d{4}(?!\d)/) 
    if (!matched) return null;
    return matched[0]
}

function excelSerialNumberToDate(serialNumber) {
    if (typeof serialNumber !== 'number') return serialNumber;
    const excelBaseDate = new Date('1899-12-30'); // Excel's base date
    const millisecondsSinceBaseDate = serialNumber * 24 * 60 * 60 * 1000;
    const resultDate = new Date(excelBaseDate.getTime() + millisecondsSinceBaseDate);
    const day = resultDate.getDate().toString().padStart(2, '0');
    const month = (resultDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = resultDate.getFullYear();

    return `${day}/${month}/${year}`;
}







function parseRow(sheet,row,...columns) {
    let result = [];
    for (let column of columns) {
        if (Array.isArray(column))
            result.push(column[0]);
        else 
            result.push(readCellValue(sheet,row,column) || '');
    }
    return result;
}

function getSheetByIndex(workbook,index) {
    const sheetName = workbook.SheetNames[index];
    return workbook.Sheets[sheetName];
}


function parse(workbook) {
    for (let generatorFunc of generators) { 
        const generator = generatorFunc(workbook);
        if (generator.next().value) return loopWorkbook(generator);
    }
    throw new InvalidFormatException();
}


function handleFiles(e) {
    let data = "";
    let filesProccessed = 0;
    const totalFiles = e.target.files.length;
    for (const file of e.target.files) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const fileData = new Uint8Array(e.target.result);
                const workbook = XLSX.read(fileData, { type: "array" });
                data += parse(workbook);
                if (++filesProccessed === totalFiles) {
                    downloadData(data);
                }
            } 
            catch (error) {
                if (error instanceof InvalidFormatException) 
                    return alert("Invalid format in " + file.name);
                else alert(error);
            }
        }
        reader.readAsArrayBuffer(file);
    }
}


function readCellValue(sheet,row,column) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: column });
    return sheet[cellAddress] && sheet[cellAddress].v;
}


function findRow(sheet,searchValue) {
    for (let rowNum = 0; rowNum <= XLSX.utils.decode_range(sheet['!ref']).e.r; rowNum++) {
        for (let colNum = 0; colNum <= XLSX.utils.decode_range(sheet['!ref']).e.c; colNum++) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
            const cellValueObject = sheet[cellAddress];
            if (!cellValueObject) continue;
            const value = cellValueObject.v;
            if (typeof value == 'string' && value.includes(searchValue) || value === searchValue)
                return rowNum
        }
    }
    return null;
}

function loopWorkbook(generator) {
    let data = "";
    for (const arrayRow of generator)
        data += arrayRow.join('\t') + '\n'; 
    return data
} 

function downloadData(data) {
    HebreCharacters.fromCharCode(
        (letter,index) => data = data.replace(letter,Windows1255[index]));
    const blob = new Blob([data], { type: 'text/plain;charset=windows-1255' });
    const blobUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = 'טעינה לרווחית.txt'; 
    downloadLink.click();

}
