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

        GetFunction = (url) => Expression.Evaluate(Text.FromBinary(Web.Contents(base_url & url,[IsRetry=true])),safe_environment),

        functions_path_record =  Expression.Evaluate(Text.FromBinary(Web.Contents(base_url & "/functions_path.m",[IsRetry=true]))),

        functions = Record.TransformFields(functions_path_record,List.Zip({
                                                    Record.FieldNames(functions_path_record),
                                                    List.Transform(Record.FieldValues(functions_path_record),(url) => () => GetFunction(url))
                                            }))

    in
         functions
in
    GetFunctions