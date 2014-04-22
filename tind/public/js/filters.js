function reset_filter(elem, num){
    reset_dropdown(num, filter_default_labels);
    filter_query[filter_keys[num]] = "ALL";
    query_string = query();
    monthpicker_init();
    redraw();
    
/*
    console.log(filter_query)
    console.log(query_string)
*/
}
function filter(elem, num){
    dropdown(elem, num);
    filter_query[filter_keys[num]] = $(elem).text();
    query_string = query();
    monthpicker_init();
    redraw();
}

function query(){ 
    return $.param(filter_query);
}

/*
function update(){
    for(n in $("#filter-controls .dropdown-menu li a")){
        console.log($("#filter-controls .dropdown-menu")[n]);
    }
}
*/
