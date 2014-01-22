var time_window_start, time_window_end, time_window_start_minus_year, time_window_end_minus_year, months_diff;

function monthpicker_init(){
    /* var start_of_month = Date.today().clearTime().moveToFirstDayOfMonth(); */
    var end_of_last_month   = Date.today().clearTime().moveToFirstDayOfMonth().addDays(-1).toString("MMM yyyy");
    var this_month_year_ago = Date.today().clearTime().moveToFirstDayOfMonth().addMonths(-12).toString("MMM yyyy");
    
    time_window_start = Date.today().clearTime().moveToFirstDayOfMonth().addMonths(-12).toString("yyyy-MM-dd");
    time_window_end   = Date.today().clearTime().moveToFirstDayOfMonth().addDays(-1).toString("yyyy-MM-dd");
    
    time_window_start_minus_year = Date.parse(time_window_start).addMonths(-12).toString("yyyy-MM-dd");
    time_window_end_minus_year   = Date.parse(time_window_end).addMonths(-12).toString("yyyy-MM-dd");

    months_diff = monthDiff(Date.parse(time_window_start), Date.parse(time_window_end));
        
    $(".monthpicker .start").each(function(){
        $( this ).data("kendoDatePicker").value(Date.parse(time_window_start))
    })
    $(".monthpicker .end").each(function(){
        $( this ).data("kendoDatePicker").value(Date.parse(time_window_end))
    })
    //jQuery( "[name='start']" ).val(this_month_year_ago);
    //jQuery( "[name='end']" ).val(end_of_last_month);
}

function set_time_window(num){
    time_window_start = Date.parse($("#datepicker-" + num + "-start").val()).moveToFirstDayOfMonth().toString("yyyy-MM-dd");
    time_window_end   = Date.parse($("#datepicker-" + num + "-end").val()).moveToLastDayOfMonth().toString("yyyy-MM-dd");

    //time_window_start = $("#datepicker-" + num + "-start").data("kendoDatePicker").value().moveToFirstDayOfMonth().toString("yyyy-MM-dd");
    //time_window_end   = $("#datepicker-" + num + "-end").data("kendoDatePicker").value().moveToLastDayOfMonth().toString("yyyy-MM-dd");
                
    time_window_start_minus_year = Date.parse(time_window_start).addMonths(-12).toString("yyyy-MM-dd");
    time_window_end_minus_year   = Date.parse(time_window_end).addMonths(-12).toString("yyyy-MM-dd");
    
    months_diff = monthDiff(Date.parse(time_window_start), Date.parse(time_window_end));
    
    $("#datepicker-" + num + "-start").data("kendoDatePicker").value(Date.parse(time_window_start))
    $("#datepicker-" + num + "-end").data("kendoDatePicker").value(Date.parse(time_window_end))
    redraw(num);
}

function set_months(m, num){
    time_window_start = Date.today().clearTime().moveToFirstDayOfMonth().addMonths(-m).toString("yyyy-MM-dd");
    time_window_end   = Date.today().clearTime().moveToFirstDayOfMonth().addDays(-1).toString("yyyy-MM-dd");
    
    $("#datepicker-" + num + "-start").data("kendoDatePicker").value(Date.parse(time_window_start))
    $("#datepicker-" + num + "-end").data("kendoDatePicker").value(Date.parse(time_window_end))    
        
    //$("#" + num + "-start").val(Date.parse(time_window_start).toString("MMM yyyy"));
    //$("#" + num + "-end").val(Date.parse(time_window_end).toString("MMM yyyy"));
    
    set_time_window(num);
}

function set_year(y, num){
    set_months(y*12, num);
}

/*
function to_ymd(my){
    return Date.parse(my).toString("yyyy-MM-dd");
}
*/

function to_month_year(ymd){
    return Date.parse(ymd).toString("MMM yyyy");
}



/*---- HERE THERE BE EXECUTION ----*/
$(document).ready(function(){ 
    $(".datepicker").kendoDatePicker();
    $(".monthpicker").kendoDatePicker({
            // defines the start view
            start: "year",
            // defines when the calendar should return date
            depth: "year",
            // display month and year in the input
            format: "MMM yyyy",
            max: Date.today().clearTime().moveToFirstDayOfMonth().addDays(-1),
            min: new Date(2011, 0, 1)
    });
    monthpicker_init();
});
