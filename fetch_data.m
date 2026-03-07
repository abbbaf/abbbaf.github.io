let
    SalaryEnvironment = [
        Table.AddColumn = Table.AddColumn,
        Table.Group = Table.Group,
        Table.NestedJoin = Table.NestedJoin,
        Table.ExpandTableColumn = Table.ExpandTableColumn,
        Table.SelectColumns = Table.SelectColumns,
        Table.RenameColumns = Table.RenameColumns,
        Table.SelectRows = Table.SelectRows,
        Table.TransformColumnTypes = Table.TransformColumnTypes,
        Table.AddIndexColumn = Table.AddIndexColumn,
        Table.ReplaceValue = Table.ReplaceValue,
        Table.ReorderColumns = Table.ReorderColumns,
        Table.FirstN = Table.FirstN,
        Table.Skip = Table.Skip,
        Table.Combine = Table.Combine,
        Table.ReplaceRows = Table.ReplaceRows,
        List.Sum = List.Sum,
        List.Min = List.Min,
        List.Max = List.Max,
        List.Count = List.Count,
        List.Select = List.Select,
        List.First = List.First,
        List.AnyTrue = List.AnyTrue,
        List.Transform = List.Transform,
        Date.Month = Date.Month,
        Date.WeekOfMonth = Date.WeekOfMonth,
        Number.Mod = Number.Mod,
        Number.From = Number.From,
        Number.RoundUp = Number.RoundUp,
        List.Difference = List.Difference,
        Replacer.ReplaceValue = Replacer.ReplaceValue,
        #"#duration" = #duration,
        #"#time" = #time
    ],
    Functions = [
        GenerateSalaryTable = Expression.Evaluate(
            Text.FromBinary(Web.Contents("https://abbbaf.github.io/hours.m")),
            SalaryEnvironment
        ),
        WorkerDataSummary = Expression.Evaluate(
            Text.FromBinary(Web.Contents("https://abbbaf.github.io/data_summary.m")),
            SalaryEnvironment
        )
    ],
in
    Functions


// Put this code in the workbook
let
    hours = Functions[GenerateSalaryTable](hours_table, shabat_and_holiday_table, month),
    result = Functions[WorkerDataSummary](hours, worker_number_data, extra_data)
in
    result
