// טבלת מיפוי - השלם לפי הצורך
// קןד רשומה, רכיב שכר, כמות, תעריף



const salaryComponentMap = {}


function loadAliasesFromStorage(map) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    const value = localStorage.getItem(key);
    map[key] = JSON.parse(value)
  }
}

function createNewRecord(colName) {
    const recordNum = parseInt(prompt(`
        "${colName}"

        מספר רשומה:
        1 - רכיבי שכר
        2 - הכנסות זקופות
        3 - ניכויים
        4 - סה"כ ימים/שעות עבודה 
        0 - לא רלוונטי
        `))
    if (![0,1,2,3,4].includes(recordNum)) return createNewRecord(colName)
    if (recordNum == 0) {
      localStorage.setItem(colName,"0")
      salaryComponentMap[colName] = 0
      return
    }
    const salaryCode = recordNum == 4 ?
        parseInt(prompt(`
        "${colName}"

        קוד רכיב:
        5 - שעות עבודה
        7 - ימי עבודה
        `)) :
        parseInt(prompt(`
        "${colName}"

        קוד רכיב:
        `)) 
    if (isNaN(salaryCode)) return createNewRecord(colName)
    componentMetaData = [recordNum,salaryCode,1]
    if (recordNum == 4 || colName.includes("שעות")) componentMetaData.pop()
    salaryComponentMap[colName] = componentMetaData
    localStorage.setItem(colName,JSON.stringify(componentMetaData))
}

loadAliasesFromStorage(salaryComponentMap)





  
  
  function processFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    if (!file) return alert("בחר קובץ.");
  
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
  
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      const outputRows = [];
  
      const month = parseInt(prompt("מספר חודש:"))
  
      let headerRowIndex = -1;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].includes("מספר עובד")) {
          headerRowIndex = i;
          break;
        }
      }
  
      if (headerRowIndex === -1) {
        alert("לא נמצאה עמודה עבור מספר עובד");
        return;
      }
  
      const headers = rows[headerRowIndex];
      const employeeIdIndex = headers.indexOf("מספר עובד");
  
      for (let i = headerRowIndex + 1; i < rows.length; i++) {
        const row = rows[i];
        const employeeId = row[employeeIdIndex];
        if (!employeeId) break;
  
        for (let j = 0; j < headers.length; j++) {
          const colName = headers[j];
          const data = row[j];
          if (j === employeeIdIndex || data == null || data === "" || isNaN(Number(data)) || data == 0) continue;
          if (!salaryComponentMap.hasOwnProperty(colName)) createNewRecord(colName)
          const componentMetaData = salaryComponentMap[colName.trim()];
          if (componentMetaData == 0) continue
          outputRows.push([month,employeeId,...componentMetaData,data])
        }
      }
  
      const csvContent = 
            ["חודש", "מספר עובד", "קוד רשומה", "קוד רכיב שכר", "כמות", "תעריף"].join(",") + "\n" +
            outputRows.map(e => e.join(",")).join("\n");
  
      downloadExcelFromCSV(csvContent)
    };
    reader.readAsArrayBuffer(file);
  }
 
  function downloadExcelFromCSV(csvContent) {
    const workbook = XLSX.read(csvContent, { type: "string" })
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
  
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
