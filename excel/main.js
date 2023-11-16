const excelFileInput = document.getElementById("excel-file");
const outputDiv = document.getElementById("output");
const SKIP = 1;
const END_OF_PARSING = 2;
const ERROR = 3;

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
            if (shouldSkip) yield SKIP;
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
            let nextType = readCellValue(sheet,row+1,0);
            if (!type) {
                if (!nextType) return END_OF_PARSING;
                yield SKIP;
                row++;
                continue;
            }
            const result = parseRow(sheet,row,[1],[''],...columnsOrder);
            if (result == null) throw new InvalidFormatException();
            if (result[4] == 0) { 
                yield SKIP;
                continue;
            }
            if (type.includes("חשבונית")) 
                yield [150,66,6,...result];
            if (type.includes("קבלה")) {
                paymentType =  readCellValue(sheet,row,10);
                result[2] = Math.abs(result[2]);
                result[3] = Math.abs(result[3]);
                if (type.includes("החזזר")) {
                    result[2] *= -1
                    result[3] *= -1
                }
                yield [...paymentTypes[paymentType],...result];
            }
            row++;
        }
    },



    function* agmInvoiceVilla(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        let row = 1 
        const columnsOrder = [8,8,0,0,6,6,4]; 
        const firstValue = parseRow(sheet,1,...columnsOrder);
        if (firstValue && /^3|(85)/.test(firstValue[4]))  yield true;
        else return false;
        while (true) {
            if (!readCellValue(sheet,row,0)) return END_OF_PARSING;
            const result = parseRow(sheet,row++,[1],[''],...columnsOrder);
            if (result == null) throw new InvalidFormatException(); 
            yield [160,66,5,...result]
        }
    },


    function* agmInvoiceRoyal(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        let row = 1 
        const columnsOrder = [8,8,0,0,6,6,4]; 
        const firstValue = parseRow(sheet,1,...columnsOrder);
        if (firstValue && /^4|(86)/.test(firstValue[4]))  yield true;
        else return false;
        while (true) {
            if (!readCellValue(sheet,row,0)) return END_OF_PARSING;
            const result = parseRow(sheet,row++,[1],[''],...columnsOrder);
            if (result == null) throw new InvalidFormatException(); 
            yield [150,66,6,...result]
        }
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
        while (true) {
            if (!readCellValue(sheet,row,0)) {
                row++;
                yield SKIP;
                continue;
            }
            if (readCellValue(sheet,row,0) == "סוג") return END_OF_PARSING;
            const result = parseRow(sheet,row,[1],[''],...columnsOrder);
            result[4] = result[4].split(' ')[0];
            result[5] = result[6].split(' ')[0];
            if (result == null) throw new InvalidFormatException(); 
            const paymentTypeArray = paymentTypes[readCellValue(sheet,row,6)];
            row++;
            yield [...paymentTypeArray,...result]
        }
    },

    function* leumi(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,0,0);
        if (firstCell && firstCell.includes("בנק לאומי")) yield true;
        else return false
        let row = findRow(sheet,"תאריך העסקה")
        if (row != null) yield true;
        else return false;
        row++;
        const creditcard = readCellValue(sheet,4,0).split(' ')[5];
        const date = window.prompt("Enter date (dd/mm/yyyy)");
        while (true) { 
            if (!readCellValue(sheet,row,0)) {
                yield [0,date,'',readCellValue(sheet,row,5),creditcard,"חיוב בבנק"];
                return END_OF_PARSING;
            }
            const result = parseRow(sheet,row++,[0],[date],5,[''],[creditcard],1);
            if (result === null) throw new InvalidFormatException(); 
            yield result
        }
    },

    function* mizrahi(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,0,0);
        if (firstCell && firstCell.includes("myCcList")) yield true;
        else return false
        let row = findRow(sheet,"בית העסק");
        if (row != null) yield true;
        else return false;
        row++;
        const creditcard = readCellValue(sheet,row,0).split(' ')[13];
        let totals = {};
        while (true) {
            if (!readCellValue(sheet,row,0)) {
                for (let [date,total] of Object.entries(totals))
                    yield [0,date,'',parseFloat(total).toFixed(2),creditcard,"חיוב בבנק"];
                return END_OF_PARSING;
            }
            const date = readCellValue(sheet,row,0);
            const result = parseRow(sheet,row++,[0],[date],4,[''],[creditcard],2);
            if (result === null) throw new InvalidFormatException(); 
            if (!(date in totals))
                totals[date] = 0;
            totals[date] += result[2];
            yield result
        }
    },

    function* discount(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,0,0);
        if (firstCell && firstCell.includes("פירוט עסקאות בכרטיסים")) yield true;
        else return false
        let row = findRow(sheet,"בית עסק");
        if (row != null) yield true;
        else return false;
        row++;
        const creditcard = readCellValue(sheet,row,0).split(' ')[1];
        const date = readCellValue(sheet,row,7);
        let total = 0;
        while (true) {
            if (!readCellValue(sheet,row,1)) {
                yield [0,date,'',total,creditcard,"חיוב בבנק"];
                return END_OF_PARSING;
            }
            const result = parseRow(sheet,row++,[0],[date],8,[''],[creditcard],1);
            if (result === null) throw new InvalidFormatException(); 
            total += result[2]
            yield result
        }
    },

    function* hahayal(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,4,1);
        if (firstCell && firstCell.includes("עסקאות בשקלים חיוב בתאריך")) yield true;
        else return false;
        let row = 6
        const creditcard = readCellValue(sheet,3,1).split(' ')[0].split(':')[1];
        const date = firstCell.split(' ')[4];
        let total = 0;
        while (true) {
            if (!readCellValue(sheet,row,1)) {
                const total = readCellValue(sheet,row+1,4);
                yield [0,date,'',total,creditcard,"חיוב בבנק"];
                return END_OF_PARSING;
            }
            const result = parseRow(sheet,row++,[0],[date],4,[''],[creditcard],2);
            if (result === null) throw new InvalidFormatException(); 
            yield result
        }
    },
    
    function* poalim(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,2,0);
        if (firstCell && firstCell.includes("חיובים קודמים")) yield true;
        else return false
        let row = findRow(sheet,"שם בית עסק");
        if (row != null) yield true;
        else return false;
        row++;
        const creditcard = readCellValue(sheet,row,0);
        let date = readCellValue(sheet,row,1);
        if (typeof date === 'number')
            date = excelSerialNumberToDate(date); 
        let total = 0;
        let isAbroad = false;
        while (true) {
            if (!readCellValue(sheet,row,0)) {
                if (isAbroad) return END_OF_PARSING;
                total = total.toFixed(2);
                yield [0,date,'',total,creditcard,"חיוב בבנק"];
                row = findRow(sheet,"מטבע מקורי")+1;
                isAbroad = true;
                continue
            }
            const sumColumn = isAbroad ? 4 : 5;
            const result = parseRow(sheet,row++,[0],[date],sumColumn,[''],[creditcard],3);
            if (result === null) throw new InvalidFormatException(); 
            yield result
            if (isAbroad)
                yield [0,date,'',result[2],creditcard,"חיוב בבנק"];
            else
                total += result[2];
        }
    },


    function* cal(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,0,0);
        if (firstCell && firstCell.includes("עסקאות לחשבון לאומי לישראל")) yield true;
        let row = findRow(sheet,"שם בית עסק");
        if (row != null) yield true;
        else return false;
        row++;
        const creditcard = readCellValue(sheet,0,0).split('-')[2];
        const metaData = readCellValue(sheet,findRow(sheet,"לחיוב"),0).split('-');
        const date = metaData[1].split(':')[0];
        let total = 0
        while (true) {
            if (!readCellValue(sheet,row,1)) {
                if (readCellValue(sheet,row+1,1)) {
                    yield SKIP;
                    row++;
                    continue;
                }
                total = total.toFixed(2);
                yield [0,date,'',total,creditcard,"חיוב בבנק"];
                return END_OF_PARSING;
            }
            const result = parseRow(sheet,row,[0],[date],3,[''],[creditcard],1);
            total += parseFloat(readCellValue(sheet,row,3));
            row++;
            if (result === null) throw new InvalidFormatException(); 
            yield result
        }
    },

    
    function* yahav(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,0,0);
        if (firstCell && firstCell.includes("בנק יהב")) yield true;
        let row = findRow(sheet,"תיאור פעולה");
        if (row != null) yield true;
        else return false;
        row++;
        const metadataRow = findRow(sheet,'כרטיס');
        const creditcard = readCellValue(sheet,metadataRow,1);
        let date = readCellValue(sheet,metadataRow,3);
        if (typeof date === 'number')
            date = excelSerialNumberToDate(date); 
        while (true) {
            if (!readCellValue(sheet,row,1)) {
                const total = readCellValue(sheet,row,4).toFixed(2);
                yield [0,date,'',total,creditcard,"חיוב בבנק"];
                return END_OF_PARSING;
            }
            const result = parseRow(sheet,row++,[0],[date],4,[''],[creditcard],1);
            if (result === null) throw new InvalidFormatException(); 
            yield result
        }
    },

    




]

function excelSerialNumberToDate(serialNumber) {
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
        else {
            const data = readCellValue(sheet,row,column);
            if (data === undefined || data === "") return null;
            result.push(data);
        }   
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
    for (const arrayRow of generator) {
        if (arrayRow == SKIP) continue;
        data += arrayRow.join('\t') + '\n'; 
    }
    return data
} 

function downloadData(data) {
    const blob = new Blob([data], { type: 'text/plain;charset=iso-8859-1' });
    const blobUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = 'טעינה לרווחית.txt'; 
    downloadLink.click();

}
