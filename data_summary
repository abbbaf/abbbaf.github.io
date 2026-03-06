let WorkerDataSummary = (calculate_hours_data as table, worker_number_data as table, extra_data as table) =>
    let
        summary_table = Table.Group(calculate_hours_data,"שם העובד",{
           { "ימי עבודה", each List.Count(List.Select([שעות רגילות],each _ <> null)) },
           { "סה""כ שעות", each List.Sum([סה""כ שעות]) },
           { "שעות רגילות", each List.Sum([שעות רגילות]) },
           { "שעות נוספות 125%", each List.Sum([שעות נוספות 125%])},
           { "שעות נוספות 150%", each List.Sum([שעות נוספות 150%])},
           { "שעות שבת וחג", each List.Sum([שעות שבת וחג])}
        }),
        add_worker_number_column = Table.NestedJoin(summary_table,"שם העובד",worker_number_data,"שם העובד","Worker Number Data"),
        expand_worker_number_data = Table.ExpandTableColumn(add_worker_number_column,"Worker Number Data",{"מספר עובד"}),
        reorder_columns = Table.ReorderColumns(expand_worker_number_data,{"מספר עובד"} & Table.ColumnNames(summary_table)),
        add_extra_table = Table.NestedJoin(reorder_columns,"מספר עובד",extra_data,"מספר עובד","Extra Data"),
        new_column_names = List.Difference(Table.ColumnNames(extra_data),Table.ColumnNames(add_extra_table)),
        expand_extra_data = Table.ExpandTableColumn(add_extra_table,"Extra Data",new_column_names)
    in
        expand_extra_data
in 
    WorkerDataSummary
