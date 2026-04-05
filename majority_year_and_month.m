let GetMajorityYearAndMonth = (data as table) =>
    let
        start_of_months_list = List.Transform(data[Date],Date.StartOfMonth),
        most_frequent_item = List.Mode(start_of_months_list)
    in 
        [Year = Date.Year(most_frequent_item), Month = Date.Month(most_frequent_item)]
in 
    GetMajorityYearAndMonth