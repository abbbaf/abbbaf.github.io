let GetDaysOff = (dates as any, workdates as list) =>
    let
        dates_as_list = if dates is text then Text.Split(Text.Remove(dates," "),",") else { Text.From(dates) },
        generate_dates = List.Transform(dates_as_list,each 
                                    if not Text.Contains(_,"-") then 
                                        List.Intersect({workdates, { try Date.From(_) otherwise Number.From(_) }})
                                    else 
                                        let
                                            date_range = Text.Split(_,"-"),
                                            date_start = Date.From(date_range{0}),
                                            date_end = Date.From(date_range{1}),
                                            number_of_days = Duration.Days(date_end - date_start)+1,
                                            generate_dates = List.Dates(date_start,number_of_days,#duration(1,0,0,0)),
                                            get_work_dates = List.Intersect({workdates,generate_dates})
                                        in
                                            get_work_dates                                  
                                ),
        get_number_of_days = List.Transform(generate_dates, each 
                                                if _ is number then _
                                                else List.Count(_)
                                            ),
        total_days = List.Sum(get_number_of_days),
        first_day = List.Count(List.Select(get_number_of_days,each _ > 0)),
        second_day = List.Count(List.Select(get_number_of_days,each _ > 1)),
        third_day = List.Count(List.Select(get_number_of_days,each _ > 2)),
        days = { total_days, first_day, second_day+third_day }
    in 
        days
in 
    GetDaysOff