function reset_filter(elem, num){
    reset_dropdown(num, filter_default_labels);
    /* update(0); */
    filter_query[filter_keys[num]] = "ALL";
    query_string = query();
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
    redraw();
    
/*
    console.log(filter_query)
    console.log(query_string)
*/
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
