let GetFunctions = (base_url,environment) => 
    let
        GetDataFromHebcal = (path) => Json.Document(Web.Contents("https://www.hebcal.com/" & path)),
        allowedPrefixes = {
            "Table.","Date.","Time.","DateTime.","Duration.","Error.",
            "List.","Number.","#date","#time","#duration",
            "Replacer.","Text.","Record."
        },
        safe_environment = Record.SelectFields(environment, List.Select(Record.FieldNames(environment), (name) =>
            List.AnyTrue(List.Transform(allowedPrefixes,(prefix) => Text.StartsWith(name,prefix) ))
        )) & [GetDataFromHebcal=GetDataFromHebcal],

        GetFunction = (url) => Expression.Evaluate(Text.FromBinary(Web.Contents(base_url & url)),safe_environment),

        functions = [
            GenerateSalaryTable = GetFunction("/hours.m"),
            WorkerDataSummary = GetFunction("/data_summary.m"),
            GetShabatAndHolidayTable = GetFunction("/shabat_hours.m"),
            GetSalaryLoadingFile = GetFunction("/generate_loading_file.m"),
            GetWorkDates = GetFunction("/workdates.m"),
            GetDaysOff = GetFunction("/daysoff.m")
        ]
    in
        functions
in
    GetFunctions