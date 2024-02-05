const excelFileInput = document.getElementById("excel-file");
const outputDiv = document.getElementById("output");

excelFileInput.addEventListener("change", handleFiles);

class InvalidFormatException extends Error {
    constructor() {
        super();
    }
}

const generators = [

  /*  function* inbar(workbook) {
        const sheet = getSheetByIndex(workbook,0);
        if (readCellValue(sheet,0,0) === "סוג מסמך") yield "ענבר";
        else return false;
        const paymentTypes = {
            "אשראי" : [10,11,66],
            "המחאה" : [12,7,66],
            "העברה בנקאית" : [13,14,66],
            "מזומן" : [11,8,66]
        }
        for (let row = 1; readCellValue(sheet,row,6); row++) {
            let type = readCellValue(sheet,row,0);
            if (!type) continue;
            const result = parseRow(sheet,row,[1],[''],6,9,4,5,1,1,2);
            if (result[4] == 0) continue;
            if (type.includes("חשבונית")) 
                yield [150,66,6,...result];
            if (type.includes("קבלה")) {
                const paymentType =  readCellValue(sheet,row,10);
                result[2] = Math.abs(result[2]);
                result[3] = Math.abs(result[3]);
                if (type.includes("החזר")) {
                    result[2] *= -1
                    result[3] *= -1
                }
                yield [...paymentTypes[paymentType],...result];
            }
        }
    },*/

        function* nehami(workbook) {
        const sheet = getSheetByIndex(workbook,0);
        if (readCellValue(sheet,0,0) === "סוג מסמך") yield "נחמי";
        else return false;
        const paymentTypes = {
            "אשראי" : [12,11,100],
            "המחאה" : [15,7,100],
            "העברה בנקאית" : [14,14,66],
            "מזומן" : [13,8,66]
        }
        for (let row = 1; readCellValue(sheet,row,6); row++) {
            let type = readCellValue(sheet,row,0);
            if (!type) continue;
            const result = parseRow(sheet,row,[1],[''],6,9,4,5,1,1,2);
            if (result[4] == 0) continue;
            if (type.includes("חשבונית")) 
                yield [150,100,6,...result];
            if (type.includes("קבלה")) {
                const paymentType =  readCellValue(sheet,row,10);
                result[2] = Math.abs(result[2]);
                result[3] = Math.abs(result[3]);
                if (type.includes("החזר")) {
                    result[2] *= -1
                    result[3] *= -1
                }
                yield [...paymentTypes[paymentType],...result];
            }
        }
    },



    function* agmInvoice(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        if (readCellValue(sheet,0,6) === "חשבונית") yield "א.ג.מ אילת";
        else return false;
        const [code1,code2] = /^3|(85)/.test(readCellValue(sheet,1,6)) ? [160,5] : [150,6];
        for (let row = 1; readCellValue(sheet,row,0); row++) 
            yield [code1,66,code2,...parseRow(sheet,row,[1],[''],8,8,0,0,6,6,4)];
    },


    function* agmReceipts(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        if (readCellValue(sheet,0,6) === "סוג תשלום") yield "א.ג.מ אילת";
        else return false;
        const paymentTypes = {
            "BIT" : [10,9,66],
            "CASH" : [12,8,66],
            "CC" : [14,11,66],
            "NOCC" : [14,11,66],
            "TR" : [10,9,66],
            "CH" : [9,7,66], 
        }
        for (let row = 1; readCellValue(sheet,row,0) !== "סוג"; row++) {
            if (!readCellValue(sheet,row,0)) continue;
            const result = parseRow(sheet,row,[1],[''],8,8,0,0,3,4,5);
            result[4] = result[4].split(' ')[0];
            result[5] = result[5].split(' ')[0];
            const paymentTypeArray = paymentTypes[readCellValue(sheet,row,6)];
            yield [...paymentTypeArray,...result]
        }
    },

    function* mizrahi(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,0,0);
        let row, creditcard;
        if (firstCell && firstCell.includes("myCcList")
            && (row = findRow(sheet,"בית העסק")) !== null
            && (creditcard = getCreditCard(sheet,++row,0)) !== null)  yield creditcard;
        else return false
        let totals = {};
        for (; readCellValue(sheet,row,0); row++) {
            let result = parseRow(sheet,row,[0],0,4,[''],[creditcard],2);
            const date = result[1];
            totals[date] = (totals[date] || 0) + result[2];
            if (result[2] < 0) [result[2],result[3]] = [result[3],-result[2]]
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
            && ((creditcard = getCreditCard(sheet,++row,0)) !== null)  
            && (date = readCellValue(sheet,row,7)) !== null) yield creditcard;
        else return false
        for (; readCellValue(sheet,row,1); row++) {
            let result = parseRow(sheet,row,[0],[date],8,[''],[creditcard],1);
            if (result[2] < 0) [result[2],result[3]] = [result[3],-result[2]]
            yield result
        }
        const total = readCellValue(sheet,8,0).match(/[0-9.]+/g)[0];
        yield [0,date,'',total,creditcard,"חיוב בבנק"];
    },

    function* hahayal(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,4,1);
        let creditcard;
        if (firstCell && firstCell.includes("עסקאות בשקלים חיוב בתאריך") 
            && ((creditcard = getCreditCard(sheet,3,1)) !== null))  yield creditcard;
        else return false;
        const date = firstCell.split(' ')[4];
        let row;
        for (row = 6; readCellValue(sheet,row,1); row++) {
            let result = parseRow(sheet,row,[0],[date],4,[''],[creditcard],2);
            if (result[2] < 0) [result[2],result[3]] = [result[3],-result[2]]
            yield result
        }
        const total = readCellValue(sheet,row+1,4);
        yield [0,date,'',total,creditcard,"חיוב בבנק"];
    },
    
    function* poalim(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        let row;
        if (readCellValue(sheet,2,0) == "חיובים קודמים"
            && (row = findRow(sheet,"שם בית עסק")) !== null) yield readCellValue(sheet,11,0);
        else return false
        row++;
        for (let sumColumn = 5; sumColumn >= 4; sumColumn--) {
            for (; readCellValue(sheet,row,0); row++) {
                let result = parseRow(sheet,row,[0],1,sumColumn,[''],0,3);
                result[1] = excelSerialNumberToDate(result[1]);
                if (result[2] < 0) [result[2],result[3]] = [result[3],-result[2]]
                yield result
            }
            row += 5;
        }
        for (row = 11; readCellValue(sheet,row,0); row++) {
            let result = parseRow(sheet,row,[0],2,[''],1,0,["חיוב בבנק"]);
            result[1] = excelSerialNumberToDate(result[1]);
            yield result;
        }

        for (row = findRow(sheet,"מטבע")+1; readCellValue(sheet,row,0); row++) {
            let result = parseRow(sheet,row,[0],2,[''],1,0,["חיוב בבנק"]);
            result[1] = excelSerialNumberToDate(result[1]);
            yield result;
        }
    },


    function* cal(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,0,0);
        let creditcard;
        if (firstCell && firstCell.includes("עסקאות לחשבון לאומי לישראל")
            && (creditcard = getCreditCard(sheet,0,0)) !== null) yield creditcard;
        else return false;
        const metaData = readCellValue(sheet,findRow(sheet,"עסקאות לחיוב"),0);
        const date = metaData.match(/\d+\/\d+\/\d+/)[0];
        const total = metaData.split(' ')[3].replace(',','');
        for (let row = 2; true; row++) {
            if (!readCellValue(sheet,row,1)) {
                if (readCellValue(sheet,row+1,1)) continue;
                break;
            }
            let result = parseRow(sheet,row,[0],[date],3,[''],[creditcard],1);
            if (result[2] < 0) [result[2],result[3]] = [result[3],-result[2]]
            yield result
        }
        yield [0,date,'',total,creditcard,"חיוב בבנק"];
    },

    
    function* yahav(workbook) {
        const sheet = getSheetByIndex(workbook,0); 
        const firstCell = readCellValue(sheet,0,5);
        let creditcard;
        if (firstCell && firstCell.includes("בנק יהב")
            && (creditcard = getCreditCard(sheet,4,1)) !== null) yield creditcard;
        else return false;
        let date = excelSerialNumberToDate(readCellValue(sheet,4,3));
        let row;
        for (row = 9; readCellValue(sheet,row,1); row++) {
            let result = parseRow(sheet,row,[0],[date],4,[''],[creditcard],1);
            if (result[2] < 0) [result[2],result[3]] = [result[3],-result[2]]
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
        const firstValue = generator.next().value;
        if (firstValue) {
            let data = "";
            for (const arrayRow of generator)
                data += arrayRow.join('\t') + '\n'; 
            return [firstValue,data];
        }
    }
    throw new InvalidFormatException();
}

function leumi(htmlContent) {
    const parser = new DOMParser();
    doc = parser.parseFromString(htmlContent,'text/html');
    const details = [...doc.querySelectorAll('.xlCell')].map(e => e.textContent.trim())
                    .filter(Boolean);
    const sums = [...doc.querySelectorAll('.xlformatNumber')].map(e => e.textContent.trim());
    const spans = doc.querySelectorAll('span');
    const creditcard = spans[2].textContent.trim();
    const [monthName, year] = spans[4].textContent.trim().split(' ');
    const month = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר'
                    ,'נובמבר','דצמבר'].indexOf(monthName)+1;
    let day = doc.querySelector('.xlFull-date').textContent.trim().split('/')[0];
    day = Number(day)+1;
    if (!window.confirm(`האם יום החיוב בחודש הוא ב-${day}?`))
        day = window.prompt('הכנס את יום החיוב בחודש');
    const date = `${day}/${month}/${year}`;
    let data = "";
    for (let index = 0; index < sums.length; index+=2) {
        const sum = parseFloat(sums[index+1].replace(/(,|\u200e)/g,'').replace());
        if (sum > 0)
            data += `0\t${date}\t${sum}\t\t${creditcard}\t${details[index]}\n`;
        if (sum < 0)
            data += `0\t${date}\t\t${-sum}\t${creditcard}\t${details[index]}\n`;
    }
    const total = doc.querySelector('.xlcurrencycode80').textContent.replace(',','');
    data += `0\t${date}\t\t${total}\t${creditcard}\tחיוב בבנק\n`;
    return [creditcard,data];
}


function handleFiles(e) {
    let data = "";
    let filesProccessed = 0;
    const totalFiles = e.target.files.length;
    let downloadFileSuffix = null;
    for (const file of e.target.files) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const fileData = new Uint8Array(e.target.result);
                if (fileData[3] === 60) {
                    const htmlContent = new TextDecoder('utf-8').decode(fileData);
                    const [creditcard, parsedData] = leumi(htmlContent);
                    data += parsedData;
                    downloadFileSuffix = creditcard;
                } 
                else {
                    const workbook = XLSX.read(fileData, { type: "array" });
                    const [creditcard, parsedData] = parse(workbook);
                    data += parsedData;
                    downloadFileSuffix = creditcard;
                }
                if (++filesProccessed === totalFiles) downloadData(downloadFileSuffix,data);
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


function downloadData(fileSuffix,data) {
    const bytesData = new Uint8Array(data.length);
    let charCode;
    let index = 0;
    for (let char of data) {
        charCode = char.charCodeAt(0);
        if (charCode <= 255) bytesData[index] = charCode;
        else if (charCode >= 1488 && charCode <= 1524 || charCode == 8236) bytesData[index] = charCode - 1264;
        else throw new Error("Unsupported character code: " + charCode);
        index++;
    }
    const blob = new Blob([bytesData], { type: 'application/octet-stream' });
    const blobUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = `טעינה לרווחית - ${fileSuffix}.txt`; 
    downloadLink.click();

}
