let GenerateSalaryLoadyFile = (month as number, workers_summary_data as table, salary_codes as table) =>
    let
        unpivot_summary_data = Table.UnpivotOtherColumns(workers_summary_data,{ "מספר עובד", "שם העובד"} , "רכיב שכר", "סכום" ),
        remove_nulls = Table.SelectRows(unpivot_summary_data,each [סכום] <> null),
        join_salary_codes = Table.NestedJoin(remove_nulls,"רכיב שכר",salary_codes,"רכיב שכר","SalaryCodeTable"),
        expand_salay_codes_table = Table.ExpandTableColumn(join_salary_codes,"SalaryCodeTable",{"קוד רשומה", "קוד שכר", "תעריף אוטומטי"}),
        missing_salary_codes = Table.SelectRows(expand_salay_codes_table, each [קוד שכר] = null)[רכיב שכר],
        check_missing = if List.Count(missing_salary_codes) > 0 then error "Missing salary codes: " & Text.Combine(missing_salary_codes,", ")
                         else expand_salay_codes_table,
        add_value_column = Table.AddColumn(check_missing,"תעריף",each if [תעריף אוטומטי] = "כן" then null else [סכום]),
        add_amount_column = Table.AddColumn(add_value_column,"כמות",each if [תעריף אוטומטי] = "כן" then [סכום] else 1),
        add_month_column = Table.AddColumn(add_amount_column,"חודש",each month),
        select_columns = Table.SelectColumns(add_month_column,{ "חודש", "מספר עובד", "קוד רשומה", "קוד שכר", "תעריף", "כמות"}),
        remove_headers = Table.PromoteHeaders(select_columns),
        remove_kod_reshuma_zero = Table.SelectRows(remove_headers,each [קוד רשומה] <> 0) 
    in 
        remove_kod_reshuma_zero
in 
    GenerateSalaryLoadyFile
