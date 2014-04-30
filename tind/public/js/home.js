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
        });        
    }
}

function redraw(num){
    margin = {top: 30, right: 20, bottom: 50, left: 50},
    width  = 760 - margin.left - margin.right,
    height = 400 - margin.top  - margin.bottom;
    
    //$(".tooltip-1").remove();
    
    if(num){
        $("#graph-"+num+" .box svg").remove()
        startload(num)
        eval('graph'+num+'()')
    }
    else{
        $(".box svg").remove();
        startload(1);
        startload(2);
        startload(3);
        startload(4);
        graph1();
        graph2();
        graph3();
        graph4();
    }
}

function graph1(){
    var x = d3.scale.ordinal()
    .rangeRoundBands([0, width-40], .1);

    var y = d3.scale.linear()
        .rangeRound([height, 0]);
    
    var color = d3.scale.ordinal()
        /* 
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]); 
        .range(['#3ea4bf','#F6BB33', '#49bf92', '#a084bf', '#FF6A13']) 
        */
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
    
    d3.json("/home/graph1/?"   +
            "reportingTo="     + time_window_end   +
            "&reportingFrom="  + time_window_start +
            "&comparisonFrom=" + time_window_start_minus_year +
            "&comparisonTo="   + time_window_end_minus_year +
            "&" + query_string, 
      function(error, data){
      
      endload(1)
      check_session(data)
      
      total0 = data[0]["Inpatient"]+data[0]["Office Visit"]+ data[0]["Outpatient"]+ data[0]["Pharmacy Claims"]
      total1 = data[1]["Inpatient"]+data[1]["Office Visit"]+ data[1]["Outpatient"]+ data[1]["Pharmacy Claims"]
      
      if(total0 + total1 <= 0)
          show_nodata_warning(1)
      else{
          hide_nodata_warning(1)    

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
    
          d3.select(".x.axis")    
            .append("g")
            .append("text")
              .text((time_window_start) +" \u2013 "+ (time_window_end)) 
              .attr("id", "daterange-1")
              .attr("y", 30)
              .attr("x", (x.rangeBand() - x.rangeBand()/2 - d3.select("#daterange-1").node().getComputedTextLength()/2 + 20))
              .attr("dy", ".71em")
              /* .style("text-anchor", "center") */;
          
          d3.select(".x.axis")  
            .append("g")
            .append("text")
              .text((time_window_start_minus_year) +" \u2013 "+ (time_window_end_minus_year))
              .attr("id", "daterange-2")
              .attr("y", 30)
              .attr("x", (x.rangeBand()*2 - x.rangeBand()/4) - (d3.select("#daterange-2").node().getComputedTextLength()/2))
              .attr("dy", ".71em")
              /* .style("text-anchor", "center") */
              ;
          
          d3.select(".x.axis")  
            .append("g")
            .append("text")
              .text((time_window_start) +" \u2013 "+ (time_window_end))
              .attr("id", "daterange-3")
              .attr("y", 30)
              .attr("x", (x.rangeBand()*3 - x.rangeBand()/6)  - (d3.select("#daterange-3").node().getComputedTextLength()/2))
              .attr("dy", ".71em")
              /* .style("text-anchor", "center") */
              ;    
            
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
              
    /*
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
              */
    }
    });    
}

function graph2(){
    var minDate = Date.parse(time_window_start)
    var maxDate = Date.parse(time_window_end)
    
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
        /*
        .interpolate("basis")
        .interpolate("linear")
        */
        .x(function(d) { return x(d.date); })
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
    
    d3.json("/home/graph2/?reportingTo="    + time_window_end   +
                         "&reportingFrom="  + time_window_start +
                         "&comparisonFrom=" + time_window_start_minus_year +
                         "&comparisonTo="   + time_window_end_minus_year +
                         "&" + query_string, 
      function(error, data) {
                           
        /* color.domain(d3.keys(data[0]).filter(function(key) { return eval(ex); })); */        
        endload(2)
        check_session(data)
        
      if(nodata(data))
        show_nodata_warning(2)
      else{
        hide_nodata_warning(2)    
        
        var table = [];
        var times = [];
        var costs = [];
        var benchmarks = [];
        var c = 0;
                
        data.forEach(function(d) {
    	    d.cost = d.total;
    	    d.date = Date.parse(d.date)
    	    costs.push(d.cost);
    	    times.push(d.date);
    	    benchmarks.push({"cost":d.benchmark, "date":d.date});
    	    table[c] = d.cost;
    	    c ++;
        });
      
      var bench_costs = [] 
      benchmarks.forEach(function(d){bench_costs.push(d.cost)})
      
      x.domain(d3.extent(data, function(d) { return d.date; }));
      /* y.domain(d3.extent(data, function(d) { return d.cost; })); */
    
      y.domain([
        d3.min(costs.concat(bench_costs))*0.9,
        d3.max(costs.concat(bench_costs))*1.1
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
            
    var max_score = d3.max(costs.concat(bench_costs))*1.1;
    var min_score = d3.min(costs.concat(bench_costs))*0.9;
    
    var spacing = width/(table.length-1);
    
    function update_circle(){
        event = d3.event;
        var xpos  = d3.mouse(this)[0]- margin.left//-margin.right;
        var index = (table.length)*(xpos / (width + margin.left + margin.right) );
        var ypos;
        
        if(xpos > 0 && xpos < width){
            if( table[index] === undefined ){     
                var lower = Math.floor(index);
                var upper = (Math.floor(index) < table.length-1) ? (Math.floor(index) + 1) : (Math.floor(index));
                
                var between = d3.interpolateNumber(
                    (height - ((table[lower] - min_score) / ((max_score - min_score) / height))), 
                    (height - ((table[upper] - min_score) / ((max_score - min_score) / height))));
                
                ypos = between( (xpos % spacing) / spacing );
                
            } 
            else{
                ypos = height - ((table[Math.floor(index)] - min_score) / ((max_score - min_score) / height));
            }
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
        else if(xpos > width){
            
        }
    }
    
    var key = svg.append("svg:g");
    key.append("svg:circle")
          .attr("cy", 360 )
          .attr("cx", 0 )
          .attr("r", 8) // radius of circle
          .attr("fill", '#3ea4bf')
          .attr("stroke", '#777777') 
          .style("opacity", 0.9);
    key.append("text")
            .attr("y", 355)
            .attr("x", 15)
            .attr("dy", ".71em")
            .attr("class", "text dark")
            .text("Reporting");
    key.append("svg:circle")
          .attr("cy", 360 )
          .attr("cx", 100 )
          .attr("r", 8) // radius of circle
          .attr("fill", '#F6BB33')
          .attr("stroke", '#777777') 
          .style("opacity", 0.9);
    key.append("text")
            .attr("y", 355)
            .attr("x", 115)
            .attr("dy", ".71em")
            .attr("class", "text dark")      
            .text("Comparison");
    }
    });
}

function graph3(){
    $.getJSON("/home/graph3/?"+
            "reportingTo="     + time_window_end   +
            "&reportingFrom="  + time_window_start +
            "&comparisonFrom=" + time_window_start_minus_year +
            "&comparisonTo="   + time_window_end_minus_year +
            "&" + query_string    
    , function(data){
        endload(3)
        check_session(data)
        for(period in data)
            for( n in data[period] )
                $("td." + period + "." + n)[0].innerText = data[period][n]   
    }) 
}

function graph4(){
    /* var formatPercent = d3.format(".0%"); */
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .08);
    
    var y = d3.scale.linear()
        .range([height, 0]);
    
    var xAxis = d3.svg.axis()
        .scale(x)
        /* .tickValues([1,10,20,30,40,50,60,70,80,90,100]) */
        .orient("bottom");
    
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");        
        /* .tickFormat(formatPercent) */
    
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return '<strong>Cost:</strong> <span style="color:orange">' + d.cost + "%</span>";
      })
    
    var svg = d3.select("#cumulative").append("svg")
        .attr("width",  width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg.call(tip);
    
    //d3.json("../public/data/cumulative.json", function(error, data) {
    d3.json("/home/graph4/"   +
           "?reportingTo="    + time_window_end   +
           "&reportingFrom="  + time_window_start +
           "&comparisonFrom=" + time_window_start_minus_year +
           "&comparisonTo="   + time_window_end_minus_year +
           "&" + query_string, 
      function(error, data){
      
      endload(4)
      check_session(data)
      
      i = 0
      data.forEach(function(d) {
          if(d.cost > 90)
              delete data[data.indexOf(d)];
          else
              i++;
      });

      data.length = i;
      
      if(nodata(data))
          show_nodata_warning(4)
      else{
          hide_nodata_warning(4)
          x.domain(data.map(function(d) { return d.claims; }));
          y.domain([0, d3.max(data, function(d) { return d.cost; })]);      
      
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
              .attr("x", function(d) { return x(d.claims)-5; })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.cost); })
              .attr("height", function(d) { return height - y(d.cost); })
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide)
        }
    });
}
