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

function redraw(){
    margin = {top: 30, right: 20, bottom: 50, left: 50},
    width  = 760 - margin.left - margin.right,
    height = 400 - margin.top  - margin.bottom;
    
    $(".tooltip-1").remove();
    $("#graph-1 .box svg").remove();
    $("#graph-5 .box svg").remove();
    draw_pmpm();
    draw_cumulative();   
}

function draw_pmpm(){    

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
        var c = 0;
                
        data.forEach(function(d) {
    	    d.cost = d.cost;
    	    d.date = Date.today().addMonths(d.month-12);
    	    costs.push(d.cost);
    	    times.push(d.date);
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
    });
}
function draw_cumulative(){    
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


/*
function draw_top_diseases(){
    
    var radius = Math.min(width, height) / 2;
    var color = d3.scale.ordinal().range(colors);
    
    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 80);
    
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.population; });
    
    var svg = d3.select("#top-diseases").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + 180 + "," + height / 2 + ")");
    
    var legend = svg.append("g")
    .attr("class", "legend")
    .attr("x", width - 65)
    .attr("y", 25)
    .attr("height", 100)
    .attr("width", 200)
    .attr('transform', 'translate(50,-150)');
    
    var tooltip2 = d3.select("#graph-2")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .attr("class", "tooltip-2");
        
     var subcond = d3.select("#graph-2 .box")
    .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("z-index", "10")
    .style("top", String(legend[0][0].getBoundingClientRect().bottom + 160)+"px")
    .style("left", String(legend[0][0].getBoundingClientRect().left + 200) +"px" )
    .attr("id", "subconditions");   
    
    
    var orig_color;
    var labels = ["A", "B", "C", "D", "E", "F"]
    var i = -1;
    
    d3.json("../public/data/top_diseases.json", function(error, data) {
        
      data.forEach(function(d) {
        d.population = +d.population;
      });
    
      var g = svg.selectAll(".arc")
          .data(pie(data))
        .enter().append("g")
          .attr("class", "arc");
          
      g.append("path")
          .attr("d", arc)
          .style("fill", function(d) { return color(d.data.condition); })
          //.style("cursor", "pointer")
          .on("mouseover", function(d){
              orig_color = d3.event.target.style.fill;
              update_subcategories(d, d.data.condition);
              
              tooltip2.style("visibility", "visible")
              tooltip2.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+5)+"px")
            
              $('.tooltip-2').html("pop. "+d.data.population);
              d3.select('#subconditions').style("visibility", "visible")
              
              list = "<ul>"
              for(var label in d.data.intersection){
                list += "<li> + "+label+","+" "+d.data.intersection[label]+"</li>"
              }
              list += "</ul>"    
              
              
              $('#subconditions').html('<h3 style="color:'+orig_color+';">'+d.data.condition+"</h3>"+list);
          })
          .on("mouseout", function(){
             d3.select( d3.event.target ).style("fill", orig_color);
             tooltip2.style("visibility", "hidden")
             d3.select('#subconditions').style("visibility", "hidden")  
          });
    
      g.append("text")
          .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .style("text-anchor", "middle")
          .style("cursor", "default")
          .text(function(d) { i++; return labels[i]; });
      
      
      legend.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 200)
      .attr("y", function(d, i){ return i *  25;})
      .attr("width", 15)
      .attr("height", 15)    
      .style("fill", function(d) { 
         return colors[data.indexOf(d)];
      });
      
      i = -1;
      legend.selectAll('text')
      .data(data)
      .enter()
      .append("text")
        .attr("x", 225)
        .attr("y", function(d, i){ return i *  25+ 12;})
      //.style("fill", function(d) { return colors[data.indexOf(d)];})
      .text(function(d) { i++; return labels[i] + ". " + d.condition; })
      .style("fill", "#aaaaaa");
      
    });    
}*/
/*

function update_subcategories(d, condition){
    d3.select( d3.event.target ).style("fill", function(d){ return d3.rgb(d3.event.target.style.fill).brighter(0.5);});
}
*/
/*
function draw_top_diffs(){
    
    var x = d3.scale.linear()
    .range([0, width])

    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], .2);
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");
    
    var svg = d3.select("#delta-cost").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    d3.json("../public/data/top_diffs.json", function(error, data){
      
      x.domain(d3.extent(data, function(d) { return d.value; })).nice();
      y.domain(data.map(function(d) { return d.name; }));
      
      svg.selectAll(".bar")
          .data(data)
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .append("rect")
          .attr("class", function(d) { return d.value < 0 ? "bar positive" : "bar negative"; })
          .attr("x", function(d) { return x(Math.min(0, d.value)); })
          .attr("y", function(d) { return y(d.name); })
          .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
          .attr("height", y.rangeBand())
       
     svg.selectAll(".bar-group") 
        .append("text")
            .text(function(d) { return d.name })
            .attr("x", function(d){ return d.value < 0 ? x(0)+10 : x(0) - 10 - this.getComputedTextLength();})
            .attr("y", function(d) { return y(d.name) + 15;})
            .style("text-anchor", function(d){return d.value < 0 ? "left" : "right";})
     svg.selectAll(".bar-group") 
        .append("text")
            .text(function(d) { return d.value })
            .attr("x", function(d){ return d.value < 0 ? x(d.value)+10 : x(d.value)-10-this.getComputedTextLength();})
            .attr("y", function(d) { return y(d.name) + 15;})
            .style("text-anchor", function(d){return d.value < 0 ? "left" : "right";})
            .style("fill", "#fff")
            

      svg.append("g")
          .attr("class", "x axis")
          .call(xAxis)
          .append("text")
          
          .attr("y", 6)
          .attr("x", 30)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Avg. Cost ($)");
    
      svg.append("g")
          .attr("class", "y axis")
        .append("line")
          .attr("x1", x(0))
          .attr("x2", x(0))
          .attr("y2", height);
    
    });
}
*/
