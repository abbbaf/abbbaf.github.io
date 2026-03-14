let GetFunctions = () => [
        GenerateSalaryTable = GetFunction("https://abbbaf.github.io/hours.m"),
        WorkerDataSummary = GetFunction("https://abbbaf.github.io/data_summary.m"),
        GetShabatAndHolidayTable = GetFunction("https://abbbaf.github.io/shanat_hours.m")
    ]
in
    GetFunctions