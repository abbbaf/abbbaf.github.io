let GetShabatAndHolidayTable = (year as number, month as number, optional geonameid_param as number) =>
    let
        geonameid = geonameid_param ?? 295277,
        start_date = Date.ToText(#date(year, month, 1), "yyyy-MM-dd"),
        end_date = Date.ToText(Date.EndOfMonth(#date(year, month, 1)), "yyyy-MM-dd"),
        path = "hebcal?v=1&cfg=json&start=" & start_date
            & "&end=" & end_date
            & "&geo=geoname&geonameid=" & Number.ToText(geonameid)
            & "&c=on&M=on&i=on&maj=on",
        raw = GetDataFromHebcal(path),
        items = Table.FromList(raw[items], Splitter.SplitByNothing()),
        expand = Table.ExpandRecordColumn(items, "Column1", {"category", "date", "title"}),

        // --- Shabbat ---
        candles = Table.SelectRows(expand, each [category] = "candles"),
        havdalah = Table.SelectRows(expand, each [category] = "havdalah"),
        candles_with_date = Table.AddColumn(candles, "Date", each Date.From(DateTime.FromText([date]))),
        candles_with_time = Table.AddColumn(candles_with_date, "Shabat Entry Time", each Time.From(DateTime.FromText([date]))),
        havdalah_with_date = Table.AddColumn(havdalah, "Date", each Date.From(DateTime.FromText([date]))),
        havdalah_with_time = Table.AddColumn(havdalah_with_date, "Shabat Exit Time", each Time.From(DateTime.FromText([date]))),
        select_candles = Table.SelectColumns(candles_with_time, {"Date", "Shabat Entry Time"}),
        select_havdalah = Table.SelectColumns(havdalah_with_time, {"Date", "Shabat Exit Time"}),
        shabbat_table = select_candles & select_havdalah, 

        // --- Yom Haatzmaut ---
        // Fetch from Hebcal using holiday endpoint to get accurate date
        // Get raw ה' אייר date
        path2 = "converter?cfg=json&h2g=1&hd=5&hm=Iyar&hy=" & Number.ToText(year + 3760),
        converter_raw = GetDataFromHebcal(path2),
        raw_date = #date(converter_raw[gy], converter_raw[gm], converter_raw[gd]),

        // Apply law shifts
        day_of_week = Date.DayOfWeek(raw_date),
        yom_haatzmaut_date = if day_of_week = 6 then Date.AddDays(raw_date, -2)  // Saturday → Thursday
                            else if day_of_week = 5 then Date.AddDays(raw_date, -1) // Friday → Thursday  
                            else if day_of_week = 1 then Date.AddDays(raw_date, 1)  // Monday → Tuesday
                            else raw_date,
        yom_haatzmaut_table = #table(
            {"Date", "Shabat Entry Time", "Shabat Exit Time"},
            {
                {yom_haatzmaut_date, null , #time(20,0,0)},
                {Date.AddDays(yom_haatzmaut_date,-1), #time(20,0,0), null }
            
            }
        ),
        combined = if converter_raw[gm] = month then shabbat_table & yom_haatzmaut_table else shabbat_table
    in
        combined
in GetShabatAndHolidayTable
