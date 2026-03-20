let GetWorkDates = (shabat_and_holiday_table as table, wordays_per_week ) =>
    let
        date_value = shabat_and_holiday_table{0}[Date],
        year = Date.Year(date_value),
        month = Date.Month(date_value),
        start_of_month = #date(year,month,1),
        number_of_days_in_month = Date.Day(Date.EndOfMonth(start_of_month)),
        generate_whole_month = List.Dates(start_of_month,number_of_days_in_month,#duration(1,0,0,0)),
        shabat_and_holidays = Table.SelectRows(shabat_and_holiday_table,each [Shabat Exit Time] <> null)[Date],
        remove_shabat_and_holidays = List.RemoveItems(generate_whole_month,shabat_and_holidays),
        final_dates = 
            if wordays_per_week = 6 then remove_shabat_and_holidays
            else List.Select(remove_shabat_and_holidays,each Date.DayOfWeek(_) <> Day.Friday)
    in
        final_dates
in 
    GetWorkDates