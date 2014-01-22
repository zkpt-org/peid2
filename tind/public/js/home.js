var visible  = [0, 1, 2, 3, 4, 5];
var _COLORS_ = ['#3ea4bf', '#a084bf', '#ff4566', '#F6BB33', '#FF6A13', '#49bf92'];
var colors   = ['#3ea4bf', '#a084bf', '#ff4566', '#F6BB33', '#FF6A13', '#49bf92'];

var margin = {top: 30, right: 20, bottom: 50, left: 50},
    width  = 760 - margin.left - margin.right,
    height = 400 - margin.top  - margin.bottom;

var offset = 0;

if( !window.isLoaded )
	window.addEventListener("load", function(){ onDocumentReady(); }, false);
else
	onDocumentReady();
	
function onDocumentReady(){
    redraw();
    
    /* If the first child in the alert box is a real alert, then display alert. */
    /*
    if($("#alerts-box").children().length > 0 && $("#alerts-box .alert").first().attr("id")!="no-alerts"){
        ToggleAlertsBox();
        $('#alerts-label').addClass("active-alerts");
    }
    */
    
    if(show_alerts){
        $("#alerts-box").css("display","block");
        $("#alerts-box").animate( {width:788, opacity:1}, 1000);
    }
    else{
        $("#alerts-box").css("display","none");
    }
    
    $(".box").click(
    function(){
        details($(this));
    });
}

function ToggleAlertsBox(){
    if($("#alerts-box").css("display") == "none"){
        $("#alerts-box").css("opacity","0.5");
        $("#alerts-box").css("width","0");
        $("#alerts-box").css("display","block");
        $("#alerts-box").animate( {width:788, opacity:1}, 1000);
        $.get('/home/show_alerts/');
    }
    else{
        $("#alerts-box").animate( {width:0, opacity:0.5}, 1000, 
            function(){
                $("#alerts-box").css("display","none");
                $.get('/home/hide_alerts/');
            }    
        );        
    }
}

function redraw(num){
    margin = {top: 30, right: 20, bottom: 50, left: 50},
    width  = 760 - margin.left - margin.right,
    height = 400 - margin.top  - margin.bottom;
    
    $(".tooltip-1").remove();
        
    if(num){
        $("#graph-"+num+" .box svg").remove()
        eval('graph'+num+'()')
    }
    else{
        $(".box svg").remove();
        graph1();
        graph2();
        graph4();
    }
}

function graph1(){
    var x = d3.scale.ordinal()
    .rangeRoundBands([0, width-40], .1);

    var y = d3.scale.linear()
        .rangeRound([height, 0]);
    
    var color = d3.scale.ordinal()
        /* .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]); */
        /* .range(['#3ea4bf','#F6BB33', '#49bf92', '#a084bf', '#FF6A13']) */
        .range(colors);
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));
    
    var svg = d3.select("#aggregate_costs").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    d3.json("/home/graph1/?months=" + months_diff  +
            "&reportingTo="    + time_window_end   +
            "&reportingFrom="  + time_window_start +
            "&comparisonFrom=" + time_window_start_minus_year +
            "&comparisonTo="   + time_window_end_minus_year, 
            function(error, data){
      
      check_session(data)
      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Period"; }));      
      
      data.forEach(function(d){
        var y0 = 0;
        d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
        d.total = d.ages[d.ages.length - 1].y1;
      });
    
      /* data.sort(function(a, b) { return b.total - a.total; }); */
    
      x.domain(data.map(function(d) { return d.Period; }));
      y.domain([0, d3.max(data, function(d) { return d.total; })*1.2]);
    
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
    
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("PMPM ($)");
    
      var state = svg.selectAll(".state")
        .data(data).enter().append("g")
          .attr("class", "g")
          .attr("transform", function(d) { return "translate(" + x(d.Period) + ",0)"; });

    
      state.selectAll("rect")
          .data(function(d) { return d.ages; })
        .enter().append("g").attr("class", "cost-bar")
          .append("rect")
          .attr("width", x.rangeBand()/2)
          .attr("x", x.rangeBand()/2/2)
          .attr("y", function(d) { return y(d.y1); })
          .attr("height", function(d) { return y(d.y0) - y(d.y1); })
          .style("fill", function(d) { return color(d.name); });
      
      state.selectAll(".cost-bar")    
          .append("text")
          .text(function(d) { 
            if (d.y1 - d.y0 > 10)
                return "$" + String(d.y1 - d.y0); })
          .attr("x", x.rangeBand()/4 + x.rangeBand()/4)
          .attr("y", function(d) { return y(d.y0) - ((y(d.y0)-y(d.y1))/2) + 5; })
          .attr("class", "segments");
      
      svg.selectAll(".g")
        .append("text")
          .text(function(d) {return "$" + String(d.total);})
          .attr("x", x.rangeBand()/4 + x.rangeBand()/4)
          .attr("y", function(d) { return y(d.total + 10); })
          .attr("class", "total");
      
      var legend = svg.selectAll(".legend")
          .data(color.domain().slice().reverse())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    
      legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);
    
      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });
          
      svg.append("g")
        .append("text")
          .attr("y", 350)
          .attr("x", 165)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text((time_window_start) +" \u2013 "+ (time_window_end));
      
      svg.append("g")
        .append("text")
          .attr("y", 350)
          .attr("x", 375)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text((time_window_start_minus_year) +" \u2013 "+ (time_window_end_minus_year));
    });    
}

function graph2(){

    var minDate = Date.today().clearTime().moveToFirstDayOfMonth().addMonths(-12);
    var maxDate = Date.today().clearTime().moveToFirstDayOfMonth();
    
    var x = d3.time.scale().domain([minDate, maxDate])
        .range([0, width]);
    
    var y = d3.scale.linear()
        .range([height, 0]);
            
    colors = []
    for(i in visible)
        colors.push(_COLORS_[visible[i]]);
        
    var color = d3.scale.ordinal().range(colors);
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    
    var line = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return x(Date.today().addMonths(d.month-12)); })
        .y(function(d) { return y(d.cost); });
        
    if($('#pmpm-graph').length)
        $('#pmpm-graph').remove()
        
    var svg = d3.select("#pmpm").append("svg")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top  + margin.bottom)
        .attr("id", "pmpm-graph")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    var tooltip = d3.select("#pmpm")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .attr("class", "tooltip-1");

    function make_x_axis() {        
        return d3.svg.axis()
            .scale(x)
             .orient("bottom")
             .ticks(12)
             /* .ticks(8) */
    }
    
    function make_y_axis() {        
        return d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10)
    }
    
    //svg.on('click', function () {
        //offset = d3.mouse(this)[0];
        
    //});
    
    d3.json("../public/data/pmpm.json", function(error, data) {
                           
        /* color.domain(d3.keys(data[0]).filter(function(key) { return eval(ex); })); */
        
        var table = [];
        var times = [];
        var costs = [];
        var benchmarks = [];
        var c = 0;
                
        data.forEach(function(d) {
    	    d.cost = d.cost;
    	    d.date = Date.today().addMonths(d.month-12);
    	    costs.push(d.cost);
    	    times.push(d.date);
    	    benchmarks.push({"cost":d.benchmark, "month":d.month});
    	    table[c] = d.cost;
    	    c ++;
        });

      x.domain(d3.extent(data, function(d) { return d.date; }));
      /* y.domain(d3.extent(data, function(d) { return d.cost; })); */
    
      y.domain([
        d3.min(costs)*0.90,
        d3.max(costs)*1.1
      ]);
    
    
      svg.append("g")
          .attr("class", "x axis")
          .attr("id", "x-axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .style("opacity", "0")
          .transition().duration(50).delay(0).ease('in')
          .style("opacity", "1");
    
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Avg. Cost ($)")
          .style("opacity", "0")
          .transition().duration(50).delay(0).ease('in')
          .style("opacity", "1");


      svg.append("g")         
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_axis()
            .tickSize(-height, 0, 0)
            .tickFormat("")
        )

      svg.append("g")         
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )        

    
      svg.append("path")
          .datum(data)
          .attr("class", "pmpm")
          .attr("d", line);
            
      svg.append("path")
          .datum(benchmarks)
          .attr("class", "benchmark")
          .attr("d", line);    
    

    var indicator = svg.append("line")
    .attr("x1", 0)
    .attr("y1", height+10)
    .attr("x2", 0)
    .attr("y2", height-10)
    .style("stroke", "#3ea4bf")
    .style("stroke-width", "1.2px")
    .style("visibility", "hidden");
    
    var circle = svg.append("circle")
    .attr("r", 6)
    .attr("display", "none")
    .attr("class","tracker");

    d3.select('#pmpm-graph')
    .on("mouseover", function(){
        circle.attr("display", "block"); 
        tooltip.style("visibility", "visible");
        indicator.style("visibility", "visible");})
    .on("mousemove", update_circle)
    .on("mouseout", function(){ 
        circle.attr("display", "none"); 
        tooltip.style("visibility", "hidden"); 
        indicator.style("visibility", "hidden");});
            
    var max_score = d3.max(costs)*1.1;
    var min_score = d3.min(costs)*0.9;
    
    var spacing = 100;
    
    function update_circle(){
        event = d3.event;
        var xpos = d3.mouse(this)[0] - margin.left;
        var index = (table.length)*(xpos/width);
        var ypos;
                
        if(xpos > 0 && xpos < width){
/*
            if( table[index] === undefined ){     
                var lower = Math.floor(index);
                var upper = Math.floor(index) + 1;
    
                var between = d3.interpolateNumber(
                    (height - ((table[lower] - min_score) / ((max_score- min_score) / height))), 
                    (height - ((table[upper] - min_score) / ((max_score- min_score) / height))));
                ypos = between( (xpos % spacing) / spacing );
                
            } 
            else{
*/
                ypos = height - ((table[Math.floor(index)] - min_score) / ((max_score- min_score) / height));
            //}
            circle
            .attr("cx", xpos)
            .attr("cy", ypos);
            
            indicator
            .attr("x1", xpos)
            .attr("x2", xpos)
            .attr("y1", 0)
            .attr("y2", height+10);
            
            tooltip.style("visibility", "visible")
            tooltip.style("top", ($("#pmpm").position()["top"]+ypos)+"px").style("left",(event.pageX+20)+"px")
            
            $('.tooltip-1').html('<h3>$ '+table[Math.floor(index)]+'</h3>');
            
        }
    }
    
    var key = svg.append("svg:g");
    key.append("svg:circle")
          .attr("cy", 360 )
          .attr("cx", 0 )
          .attr("r", 8) // radius of circle
          .attr("fill", '#F6BB33')
          .attr("stroke", '#777777') 
          .style("opacity", 0.9);
    key.append("text")
            .attr("y", 355)
            .attr("x", 15)
            .attr("dy", ".71em")
            .attr("class", "text dark")
            .text("Benchmark");
    key.append("svg:circle")
          .attr("cy", 360 )
          .attr("cx", 100 )
          .attr("r", 8) // radius of circle
          .attr("fill", '#3ea4bf')
          .attr("stroke", '#777777') 
          .style("opacity", 0.9);
    key.append("text")
            .attr("y", 355)
            .attr("x", 115)
            .attr("dy", ".71em")
            .attr("class", "text dark")      
            .text("Target");
    
    });
}

function graph4(){
    /* var formatPercent = d3.format(".0%"); */
    var x = d3.scale.ordinal()
        .rangeRoundBands([1, width+15], .1);
    
    var y = d3.scale.linear()
        .range([height, 0]);
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .tickValues([1,10,20,30,40,50,60,70,80,90,100])
        .orient("bottom");
    
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        
        /* .tickFormat(formatPercent) */;
    
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return '<strong>Cost:</strong> <span style="color:orange">' + d.frequency + "%</span>";
      })
    
    var svg = d3.select("#cumulative").append("svg")
        .attr("width",  width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg.call(tip);
    
    d3.csv("../public/data/cumulative.csv", function(error, data) {
      x.domain(data.map(function(d) { return d.perc; }));
      y.domain([0, d3.max(data, function(d) { return d.frequency; })]);      
      
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(-5," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("y", 30)
          .attr("x", 690)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Claims %");
    
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .attr("transform", "translate(-1," + 0 + ")")
        .append("text")
          .attr("y", 5)
          .attr("x", 40)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Cost %");
    
      svg.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.perc)-5; })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.frequency); })
          .attr("height", function(d) { return height - y(d.frequency); })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
    
    });
}
