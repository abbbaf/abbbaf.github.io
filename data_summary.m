let WorkerDataSummary = (calculate_hours_data as table, worker_settings as table, extra_data as table) =>
    let
        GetCommutingAllowance = (worker_record) =>
            let
                daily_allowance = worker_record[Worker Settings][נסיעות יומי],
                monthly_allowance = worker_record[Worker Settings][נסיעות חודשי],
                days_limit = try Number.RoundUp(monthly_allowance/daily_allowance) otherwise null,
                result = if days_limit <> null then 
                            if days_limit >= worker_record[ימי עבודה] then {monthly_allowance,1}
                            else {daily_allowance,worker_record[ימי עבודה]}
                         else { null, null }
            in
                result,


        summary_table = Table.Group(calculate_hours_data,"שם העובד",{
           { "ימי עבודה", each List.Count(List.Select([שעות רגילות],each _ <> null)) },
           { "סה""כ שעות", each List.Sum([סה""כ שעות]) },
           { "שעות רגילות", each List.Sum([שעות רגילות]) },
           { "שעות נוספות 125%", each List.Sum([שעות נוספות 125%])},
           { "שעות נוספות 150%", each List.Sum([שעות נוספות 150%])},
           { "שעות שבת וחג", each List.Sum([שעות שבת וחג])}
        }),
        add_worker_setting_table_column = Table.NestedJoin(summary_table,"שם העובד",worker_settings,"שם העובד","Worker Settings"),
        tranform_setting_to_record = Table.TransformColumns(add_worker_setting_table_column,{{ "Worker Settings", each _{0}} }),
        add_worker_number_column = Table.AddColumn(tranform_setting_to_record,"מספר עובד",each [Worker Settings][מספר עובד]),
        reorder_columns = Table.ReorderColumns(add_worker_number_column,{"מספר עובד"} & Table.ColumnNames(summary_table)),
        add_extra_table = Table.NestedJoin(reorder_columns,"מספר עובד",extra_data,"מספר עובד","Extra Data"),
        new_column_names = List.Difference(Table.ColumnNames(extra_data),Table.ColumnNames(add_extra_table)),
        expand_extra_data = Table.ExpandTableColumn(add_extra_table,"Extra Data",new_column_names),
        add_commuting_allowance_column = Table.AddColumn(expand_extra_data,"נסיעות",each GetCommutingAllowance(_)),
        add_commuting_allowance_fee = Table.AddColumn(add_commuting_allowance_column,"נסיעות-תעריף",each [נסיעות]{0}),
        add_commuting_allowance_days = Table.AddColumn(add_commuting_allowance_fee,"נסיעות-ימים",each [נסיעות]{1}),
        add_meals = Table.AddColumn(add_commuting_allowance_days,"שווי ארוחות-ימים",each 
                                                if [Worker Settings][שווי ארוחות] = "כן" then [ימי עבודה] else null),
    in
        add_meals
in 
    WorkerDataSummary
