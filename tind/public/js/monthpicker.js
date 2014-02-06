function monthpicker_init(){
    
    time_window_start = last_date().moveToLastDayOfMonth().addDays(1).addMonths(-12).toString("yyyy-MM-dd");
    time_window_end   = last_date().moveToLastDayOfMonth().toString("yyyy-MM-dd");
    
    time_window_start_minus_year = Date.parse(time_window_start).addMonths(-12).toString("yyyy-MM-dd");
    time_window_end_minus_year   = Date.parse(time_window_end).addMonths(-12).toString("yyyy-MM-dd");

    //months_diff = monthDiff(Date.parse(time_window_start), Date.parse(time_window_end));
        
    $(".monthpicker .start").each(function(){
        $( this ).data("kendoDatePicker").value(Date.parse(time_window_start))
    })
    $(".monthpicker .end").each(function(){
        $( this ).data("kendoDatePicker").value(Date.parse(time_window_end))
    })

}

function set_time_window(num){
    time_window_start = Date.parse($("#datepicker-" + num + "-start").val()).moveToFirstDayOfMonth().toString("yyyy-MM-dd");
    time_window_end   = Date.parse($("#datepicker-" + num + "-end").val()).moveToLastDayOfMonth().toString("yyyy-MM-dd");
                
    time_window_start_minus_year = Date.parse(time_window_start).addMonths(-12).toString("yyyy-MM-dd");
    time_window_end_minus_year   = Date.parse(time_window_end).addMonths(-12).toString("yyyy-MM-dd");
    
    //months_diff = monthDiff(Date.parse(time_window_start), Date.parse(time_window_end));
    
    $("#datepicker-" + num + "-start").data("kendoDatePicker").value(Date.parse(time_window_start))
    $("#datepicker-" + num + "-end").data("kendoDatePicker").value(Date.parse(time_window_end))
    redraw(num);
}

function set_months(m, num){
    time_window_start = last_date().moveToLastDayOfMonth().addDays(1).addMonths(-m).toString("yyyy-MM-dd");
    time_window_end   = last_date().moveToLastDayOfMonth().toString("yyyy-MM-dd");
    
    $("#datepicker-" + num + "-start").data("kendoDatePicker").value(Date.parse(time_window_start))
    $("#datepicker-" + num + "-end").data("kendoDatePicker").value(Date.parse(time_window_end))    
    
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

if( !window.isLoaded )
	window.addEventListener("load", function(){ onreadyMonthPicker(); }, false);
else
	onreadyMonthPicker();

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
            max: (lastdate)  ? lastdate  : last_date().moveToLastDayOfMonth(),
            min: (firstdate) ? firstdate : first_date().moveToFirstDayOfMonth(),
    });
    monthpicker_init();
});
function onreadyMonthPicker(){
    monthpicker_init();
}