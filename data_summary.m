let WorkerDataSummary = (calculate_hours_data as table, worker_settings as table, total_workdays as number) =>
    /*
        calculate_hours_data -> a table created by hours.m
    */

    let
        summary_table = Table.Group(calculate_hours_data,"שם העובד",{
           { "ימי עבודה", each List.Count(List.Select([שעות רגילות],each _ <> null)) },
           { "סה""כ שעות", each List.Sum([סה""כ שעות]) },
           { "שעות רגילות", each List.Sum([שעות רגילות]) },
           { "שעות נוספות 125%", each List.Sum([שעות נוספות 125%])},
           { "שעות נוספות 150%", each List.Sum([שעות נוספות 150%])},
           { "שעות שבת וחג", each List.Sum([שעות שבת וחג])}
        }),
        worker_settings_columns = List.RemoveItems(Table.ColumnNames(worker_settings),{"שם העובד"}),
        join_worker_settings = Table.NestedJoin(summary_table,"שם העובד",worker_settings,"שם העובד","Settings"),
        expand_worker_settings = Table.ExpandTableColumn(join_worker_settings,"Settings",worker_settings_columns),
        count_new_workers = if List.AnyTrue(List.Transform(expand_worker_settings[מספר עובד], each _ = null)) 
                                    then error "Add the new workers to the table" else expand_worker_settings,
        filter_columns = Table.FromRecords(
                                Table.TransformRows(count_new_workers, (r) =>
                                    Record.TransformFields(r,{
                                            { "שעות רגילות", each if r[שעות רגילות?] = "לא" then null else _ },
                                            { "שעות נוספות 125%", each if r[שעות נוספות?] = "לא" then null else _ },
                                            { "שעות נוספות 150%", each if r[שעות נוספות?] = "לא" then null else _ },
                                            { "שעות שבת וחג", each if r[שעות שבת וחג?] = "לא" then null else _ }
                                        }   
                                    )
                                )
                            ),
        add_commuting_allowance = Table.AddColumn(filter_columns,"נסיעות"
                                                    ,each if [נסיעות חודשי] = null then null else List.Min({[נסיעות חודשי],
                                                                [ימי עבודה]*([נסיעות יומי] ?? [נסיעות חודשי]/[ימי עבודה])})),
        add_commuting_allowance_rate = Table.AddColumn(add_commuting_allowance,"נסיעות-תעריף",
                                                            each if [נסיעות] = null then null
                                                                else if [נסיעות] >= [נסיעות חודשי] then [נסיעות חודשי] else [נסיעות יומי]),
        add_commuting_allowance_quantity = Table.AddColumn(add_commuting_allowance_rate,"נסיעות-כמות",
                                                            each if [נסיעות] = null then null 
                                                                else if [נסיעות] >= [נסיעות חודשי] then 1 else [ימי עבודה]),
        add_unpaid_daysoff = Table.AddColumn(add_commuting_allowance_quantity,"ימי היעדרות",each 
                                                                                if [שעות רגילות?] = "לא" then total_workdays - [ימי עבודה]
                                                                                else null),
        column_names = {"מספר עובד"} & List.RemoveItems(Table.ColumnNames(add_unpaid_daysoff),worker_settings_columns & {"נסיעות","מספר עובד"}),
        select_columns = Table.SelectColumns(add_unpaid_daysoff,column_names)
    in
        select_columns
in 
    WorkerDataSummary

