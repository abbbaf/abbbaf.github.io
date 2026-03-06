let GenerateSalaryTable = (hours_table as table, shabat_and_holiday_table as table,month as number) =>

    let

        
        TimeDifference = (time1 as time, time2 as time) => 24*Number.Mod(Number.From(time1-time2),24),

        max_regular_hours = 8,

        add_break_column_if_needed = try Table.AddColumn(hours_table,"Break",each 0) otherwise hours_table,

        select_month = Table.SelectRows(add_break_column_if_needed,each Date.Month([Date]) = month),

        transform_types = Table.TransformColumnTypes(select_month,{
            {"Entry Time", type time },
            { "Exit Time", type time }
        }),

        add_total_hours = Table.AddColumn(transform_types,"Total Hours",each TimeDifference([Exit Time],[Entry Time]) - [Break]),
        check_negative_total_hours = if List.Min(add_total_hours[Total Hours]) < 0 then 
                                            error "Error: Some total hours are negative" else add_total_hours,
        add_night_hours = Table.AddColumn(check_negative_total_hours, "Night Hours", each 
                                if [Exit Time] > #time(22,0,0) or [Exit Time] < [Entry Time] 
                                    then TimeDifference([Exit Time],List.Max({#time(22,0,0),[Entry Time]}))
                                else if [Entry Time] < #time(6,0,0)
                                    then TimeDifference(List.Min({#time(6,0,0),[Exit Time]}),[Entry Time])
                                else 0),
                                
        add_shabat_table_column = Table.NestedJoin(add_night_hours,"Date",shabat_and_holiday_table,"Date","Shabat"),
        expand_shabat_column = Table.ExpandTableColumn(add_shabat_table_column,"Shabat",{"Shabat Entry Time", "Shabat Exit Time"}),

        add_shabat_hours = Table.AddColumn(expand_shabat_column,"Shabat Hours",each
            if [Shabat Entry Time] <> null then 
                if [Exit Time] > [Shabat Entry Time] or [Entry Time] > [Exit Time]
                    then TimeDifference([Exit Time],List.Max({[Entry Time],[Shabat Entry Time]}))
                else 0
            else if [Shabat Exit Time] <> null then
                if [Entry Time] < [Shabat Exit Time] then
                    if [Entry Time] > [Exit Time]
                        then TimeDifference(List.Min({[Exit Time],[Shabat Exit Time]}),[Entry Time])
                    else TimeDifference([Shabat Exit Time],[Entry Time])
                else 0
            else 0
        ),

        add_index = Table.AddIndexColumn(add_shabat_hours, "Index"),

        main_table = add_index,

        group_by_dates = Table.Group(main_table,{"Worker Name","Date"},{ 
            {"Total Hours", each List.Sum([Total Hours])},
            {"Index", each List.Max([Index])},
            {"Has Night Hours", each List.Sum([Night Hours]) >= 2},
            {"Is Friday Or Holiday Evening", each List.First([Shabat Entry Time]) <> null}
        }),

        add_week_of_month = Table.AddColumn(group_by_dates,"Week Of Month",each Date.WeekOfMonth([Date])),
        add_regular_hours = Table.AddColumn(add_week_of_month,"Regular Hours", each
            List.Min({
                if [Has Night Hours] or [Is Friday Or Holiday Evening] then 7 else max_regular_hours,
                [Total Hours]})
        ),

        group_by_weeks = Table.Group(add_regular_hours,{ "Week Of Month", "Worker Name" },{
            { "Regular Hours 42 Correction", each List.Min({42-List.Sum([Regular Hours]),0}) },
            { "Index", each List.Max([Index]) }
        }),

        join_weeks_and_dates = Table.NestedJoin(add_regular_hours,"Index",group_by_weeks,"Index", "Extra"),
        expand_dates_table = Table.ExpandTableColumn(join_weeks_and_dates,"Extra",{"Regular Hours 42 Correction"}),
        replace_nulls = Table.ReplaceValue(expand_dates_table, null, 0, Replacer.ReplaceValue, {"Regular Hours 42 Correction"}),
        add_final_regular_hours = Table.AddColumn(replace_nulls,"Final Regular Hours",
                                                    each [Regular Hours] + [Regular Hours 42 Correction]),
        add_150_extra_hours = Table.AddColumn(add_final_regular_hours,"Extra Hours 150",
                                                each List.Max({[Total Hours]-[Final Regular Hours]-2,0})),
        add_125_extra_hours = Table.AddColumn(add_150_extra_hours,"Extra Hours 125",each [Total Hours]-[Final Regular Hours]-[Extra Hours 150]),

        join_tables =  Table.NestedJoin(main_table,"Index",add_125_extra_hours,"Index","Extra"),
        expand_final_table = Table.ExpandTableColumn(join_tables,"Extra",{ "Final Regular Hours", "Extra Hours 125", "Extra Hours 150"}),
        columns_list = {"Worker Name","Date", "Entry Time","Exit Time","Total Hours",
                            "Final Regular Hours","Extra Hours 125", "Extra Hours 150","Shabat Hours"},
        select_columns = Table.SelectColumns(expand_final_table,columns_list),
        rename_table_columns = Table.RenameColumns(select_columns,{
            {"Worker Name", "שם העובד"},
            {"Date", "תאריך"},
            {"Entry Time","שעת כניסה"},
            {"Exit Time","שעת יציאה"},
            {"Total Hours","סה""כ שעות"},
            {"Final Regular Hours", "שעות רגילות"},
            {"Extra Hours 125", "שעות נוספות 125%"},
            {"Extra Hours 150","שעות נוספות 150%"},
            {"Shabat Hours","שעות שבת וחג"}
        })
    in 
        rename_table_columns
in GenerateSalaryTable
    
    
