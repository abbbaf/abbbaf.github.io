let 
    GetDataFromHebcal = (path) => Json.Document(Web.Contents("https://www.hebcal.com/" & path)),

    safe_environment = Record.SelectFields(#shared, List.Select(Record.FieldNames(#shared), each
        Text.StartsWith(_,"Table.") or
        Text.StartsWith(_,"Date.") or
        Text.StartsWith(_,"Time.") or
        Text.StartsWith(_,"DateTime.") or
        Text.StartsWith(_,"Duration.") or
        Text.StartsWith(_,"Error.") or
        Text.StartsWith(_,"List.") or
        Text.StartsWith(_,"Number.") or
        Text.StartsWith(_,"#date") or
        Text.StartsWith(_,"#time") or
        Text.StartsWith(_,"#duration") or
        Text.StartsWith(_,"Replacer.") or
        Text.StartsWith(_,"Text.") or
        Text.StartsWith(_,"Record.") 
    )) & [GetDataFromHebcal=GetDataFromHebcal],
    

    GetFunction = (url, optional allow_function_loading) =>
        let
            function_loading = if allow_function_loading = true then [GetFunction=GetFunction] else [],
            expression = Text.FromBinary(Web.Contents(url)),   
            result = Expression.Evaluate(expression,safe_environment & function_loading)
        in
            result,

    GetFunctions = GetFunction("https://abbbaf.github.io/functions.m",true)

in
    GetFunctions


// Put this code in the workbook
/*
let
    hours = Functions[GenerateSalaryTable](hours_table, shabat_and_holiday_table, month),
    result = Functions[WorkerDataSummary](hours, worker_number_data, extra_data)
in
    result