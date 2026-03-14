let GenerateSalaryTable = (hours_table as table, shabat_and_holiday_table as table,worker_settings as table, month as number) =>

    let

        JoinTables = (table1 as table, key1 as text, table2 as table, key2 as text, columnNames as list) =>
                        let
                            nested_join = Table.NestedJoin(table1,key1,table2,key2,"Extra"),
                            expand_column = Table.ExpandTableColumn(nested_join,"Extra",columnNames)
                        in
                            expand_column,

        
        TimeDifference = (time1 as time, time2 as time) => 24*Number.Mod(Number.From(time1-time2),24),

        max_regular_hours = 8,
 
        select_month = Table.SelectRows(hours_table,each Date.Month([Date]) = month),

        transform_types = Table.TransformColumnTypes(select_month,{
            {"Entry Time", type time },
            { "Exit Time", type time },
            { "Date", type date } 
        }),

        add_worker_settings = Table.NestedJoin(transform_types,"Worker Name",worker_settings,"שם העובד","Worker Settings"),
        worker_settings_to_record = Table.TransformColumns(add_worker_settings,{{"Worker Settings", each _{0}}}),
        add_break_column = Table.AddColumn(worker_settings_to_record,"Break",each [Worker Settings][הפסקה] ?? 0),
        add_total_hours = Table.AddColumn(add_break_column,"Total Hours", each 
                                                                let
                                                                    total_hours = TimeDifference([Exit Time],[Entry Time]),
                                                                    total_hours_after_break = total_hours-
                                                                        ((if total_hours >= 6 then [Break] else 0))
                                                                in
                                                                    total_hours_after_break
                                                        ),
                                       

        add_night_hours = Table.AddColumn(add_total_hours, "Night Hours", each 
                                if [Exit Time] > #time(22,0,0) or [Exit Time] < [Entry Time] 
                                    then TimeDifference([Exit Time],List.Max({#time(22,0,0),[Entry Time]}))
                                else if [Entry Time] < #time(6,0,0)
                                    then TimeDifference(List.Min({#time(6,0,0),[Exit Time]}),[Entry Time])
                                else 0),
                                
        join_with_shabat_table = JoinTables(add_night_hours,"Date",shabat_and_holiday_table,"Date",{"Shabat Entry Time", "Shabat Exit Time"}),
        add_shabat_hours = Table.AddColumn(join_with_shabat_table,"Shabat Hours",each
            if [Worker Settings][שעות שבת וחג] = "לא" then null 
            else
                if [Shabat Entry Time] <> null then 
                    if [Exit Time] > [Shabat Entry Time] or [Entry Time] > [Exit Time]
                        then TimeDifference([Exit Time],List.Max({[Entry Time],[Shabat Entry Time]}))
                    else 0
                else if [Shabat Exit Time] <> null then
                    if [Entry Time] < [Shabat Exit Time] then
                        if [Entry Time] > [Exit Time]
                            then TimeDifference(List.Min({[Exit Time],[Shabat Exit Time]}),[Entry Time])
                        else TimeDifference([Shabat Exit Time],[Entry Time])
                    else if [Shabat Exit Time] = 0 // כלומר יציאת החג ביום למחרת
                        then TimeDifference([Exit Time], [Shabat Entry Time])
                    else 0 
                else 0
        ),

        add_index = Table.AddIndexColumn(add_shabat_hours, "Index"),

        main_table = add_index,

        group_by_dates = Table.Group(main_table,{"Worker Name","Date"},{ 
            {"Worker Settings", each List.First([Worker Settings])},
            {"Total Hours", each List.Sum([Total Hours])},
            {"Index", each List.Max([Index])},
            {"Has Night Hours", each List.Sum([Night Hours]) >= 2},
            {"Is Friday Or Holiday Evening", each List.First([Shabat Entry Time]) <> null}
        }),

        add_week_of_month = Table.AddColumn(group_by_dates,"Week Of Month",each Date.WeekOfMonth([Date])),
        add_regular_hours = Table.AddColumn(add_week_of_month,"Regular Hours", each
            if [Worker Settings][שעות רגילות] = "לא" then 1
            else if [Worker Settings][שעות נוספות 125%] = "לא" then [Total Hours]
            else
                List.Min({
                    if [Has Night Hours] or [Is Friday Or Holiday Evening] then 7 else max_regular_hours,
                    [Total Hours]})
        ),

   
        group_by_weeks = Table.Group(add_regular_hours,{ "Week Of Month", "Worker Name" },{
                                            { "Regular Hours 42 Correction", each List.Min({42-List.Sum([Regular Hours]),0}) },
                                            { "Index", each List.Max([Index]) }
                                        }),
        join_weeks_and_dates = JoinTables(add_regular_hours,"Index",group_by_weeks,"Index", 
                                                                                {"Regular Hours 42 Correction"}),

                      

        add_final_regular_hours = Table.AddColumn(join_weeks_and_dates,"Final Regular Hours", 
                    each
                        if [Worker Settings][שעות רגילות] = "לא" or [Worker Settings][שעות נוספות 125%] = "לא" then 
                            [Regular Hours]
                        else
                            [Regular Hours] + ([Regular Hours 42 Correction] ?? 0)),


        add_150_extra_hours = Table.AddColumn(add_final_regular_hours,"Extra Hours 150",
                                                each
                                                    if [Worker Settings][שעות נוספות 150%]  = "לא" then 0
                                                    else List.Max({[Total Hours]-[Final Regular Hours]-2,0})
                                                ),
        add_125_extra_hours = Table.AddColumn(add_150_extra_hours,"Extra Hours 125",
                                                each 
                                                    if [Worker Settings][שעות נוספות 125%]  = "לא" then 0
                                                    else [Total Hours]-[Final Regular Hours]-[Extra Hours 150]
                                                ),
        add_meals = Table.AddColumn(add_125_extra_hours,"meals",each if ([Worker Settings][שווי ארוחות] ) = "כן" then 1 else 0),

        add_commuting_allowance_column = Table.AddColumn(add_meals,"commuting allowance",each [Worker Settings][נסיעות יומי]),

        join_tables =  JoinTables(main_table,"Index",add_commuting_allowance_column,"Index",
                                                        { "Break", "Final Regular Hours", "Extra Hours 125", "Extra Hours 150",
                                                            "Shabat Hours", "commuting allowance", "meals"                                                                    
                                                                    }),
        add_worker_number = Table.AddColumn(join_tables,"Worker Number",each [Worker Settings][מספר עובד]),
        select_columns = Table.ReorderColumns(add_worker_number, 
                                                {"Worker Number", "Worker Name","Date", "Entry Time","Exit Time","Break",
                                                    "Total Hours", "Final Regular Hours","Extra Hours 125", "Extra Hours 150","Shabat Hours",
                                                    "commuting allowance", "meals"
                                                }),
        rename_table_columns = Table.RenameColumns(select_columns,{
            {"Worker Number", "מספר עובד"},
            {"Worker Name", "שם העובד"},
            {"Date", "תאריך"},
            {"Entry Time","שעת כניסה"},
            {"Exit Time","שעת יציאה"},
            { "Break", "הפסקה" },
            {"Total Hours","סה""כ שעות"},
            {"Final Regular Hours", "שעות רגילות"},
            {"Extra Hours 125", "שעות נוספות 125%"},
            {"Extra Hours 150","שעות נוספות 150%"},
            {"Shabat Hours","שעות שבת וחג"},
            { "commuting allowance", "נסיעות יומי" },
            { "meals", "שווי ארוחות" }
        })
        
    in 
        rename_table_columns
in GenerateSalaryTable
    
