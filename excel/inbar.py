import openpyxl
import xlwt
from sys import argv


base_folder = "C:\\Shared Folder\\לקוחות\כהן ענבר אמר בעמ- סטודיו למחול"

if len(argv) < 3:
	raise SystemExit("Missing month and\or year")

year = argv[1]
month = argv[2]

filename = f'{base_folder}\\{year}\\הכנסות {month}.{year}\\{month}.{year}.xlsx'


in_workbook = openpyxl.load_workbook(filename)
in_sheet = in_workbook.active

output_file = open('טעינה לרווחית.txt','w')
for row in in_sheet.iter_rows(values_only=True):
	type = row[0]
	if type is None or type == "סוג מסמך":
		continue
	sum_before_vat = row[6]
	if sum_before_vat == 0:
		continue
	sum_after_vat = row[9]
	value_date = row[4]
	document_date = row[5]
	document_number = row[1]
	details = row[2]
	coin_type = 1
	sorting_code = 0
	account1 = 0
	account2 = 0
	row_values = [coin_type,'',sum_before_vat,sum_after_vat,value_date,document_date,document_number,document_number,details]
	invoice_row = [150,66,6]+row_values
	row_values[2] *= -1
	row_values[3] *= -1
	row_values = {
		"אשראי" : [10,11,66]+row_values,
		"המחאה" : [12,7,66]+row_values,
		"העברה בנקאית" : [13,14,66]+row_values,
		"מזומן" : [11,8,66]+row_values,
	}

	if "חשבונית" in type:
		temp_row = '\t'.join([*map(str,invoice_row)])
		output_file.write(temp_row + '\n')
	
	if "קבלה" in type:
		payment_type = row[10]
		temp_row = row_values[payment_type]
		temp_row[5] = abs(temp_row[5])
		temp_row[6] = abs(temp_row[6])
		if "החזר" in type:
			temp_row[5] *= -1
			temp_row[6] *= -1
		row = '\t'.join([*map(str,temp_row)])
		output_file.write(row + '\n')

output_file.close()
	




