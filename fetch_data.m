let 
    sha256 = "671705c51b2e42b1badfd3ca44d699f1364b2ba61fd500f16f45de8357ddc0f5",
    url = "http://abbbaf.github.io/functions.m",
    expression = Text.FromBinary(Web.Contents(url)),   
    sha256_url = "https://api.hashify.net/hash/sha256/hex?value=" &  Uri.EscapeDataString(expression),
    response = Web.Contents(sha256_url),
    response_sha256 = Json.Document(response)[Digest],
    GetFunctions = if response_sha256 = sha256 then Expression.Evaluate(expression,#shared) else null,
    functions = GetFunctions("https://abbbaf.github.io",#shared)
in
    functions


// Put this code in the workbook
/*
let
    hours = Functions[GenerateSalaryTable](hours_table, shabat_and_holiday_table, month),
    result = Functions[WorkerDataSummary](hours, worker_number_data, extra_data)
in
    result
