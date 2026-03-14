let WorkerDataSummary = (calculate_hours_data as table, worker_settings as table, extra_data as table) =>
    let

        summary_table = Table.Group(calculate_hours_data,"מספר עובד",{
           { "שם עובד", each List.First([שם העובד]) },
           { "ימי עבודה", each List.Count(List.Select([שעות רגילות],each _ <> null)) },
           { "סה""כ שעות", each List.Sum([סה""כ שעות]) },
           { "שעות רגילות", each List.Sum([שעות רגילות]) },
           { "שעות נוספות 125%", each List.Sum([שעות נוספות 125%])},
           { "שעות נוספות 150%", each List.Sum([שעות נוספות 150%])},
           { "שעות שבת וחג", each List.Sum([שעות שבת וחג])},
           { "שווי ארוחות - ימים", each List.Sum([שווי ארוחות])},
           { "נסיעות", each List.Sum([נסיעות יומי]) }
        }),
        add_worker_setting_table_column = Table.NestedJoin(summary_table,"מספר עובד",worker_settings,"מספר עובד","Worker Settings"),
        tranform_setting_to_record = Table.TransformColumns(add_worker_setting_table_column,{{ "Worker Settings", each _{0}} }),
        add_commuting_allowance_fee = Table.AddColumn(tranform_setting_to_record,"נסיעות-תעריף",each
                                                                        List.Min({[נסיעות],[Worker Settings][נסיעות חודשי]})
                                                                 ),
        add_commuting_allowance_quantity = Table.AddColumn(add_commuting_allowance_fee,"נסיעות-ימים",each
                                                                        if [נסיעות-תעריף] = [Worker Settings][נסיעות חודשי] then 1 
                                                                        else [ימי עבודה]
                                                                 ),
        add_extra_table = Table.NestedJoin(add_commuting_allowance_quantity,"מספר עובד",extra_data,"מספר עובד","Extra Data"),
        new_column_names = List.Remove(Table.ColumnNames(extra_data),{"מספר עובד"} ),
        expand_extra_data = Table.ExpandTableColumn(add_extra_table,"Extra Data",new_column_names),
        remove_settings_column = Table.RemoveColumns(expand_extra_data,{ "Worker Settings", "נסיעות" })
    in
        remove_settings_column
in 
    WorkerDataSummary