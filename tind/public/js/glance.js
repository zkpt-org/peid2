/* Javascript used by the "At a Glance" page */

var hidden = [];
var _COLORS_ = ['#3ea4bf','#F6BB33', '#49bf92', '#a084bf', '#FF6A13'];
var colors   = ['#3ea4bf','#F6BB33', '#49bf92', '#a084bf', '#FF6A13'];

var margin = {top: 30, right: 30, bottom: 50, left: 40},
    width  = 760 - margin.left - margin.right,
    height = 400 - margin.top  - margin.bottom;

var tooltip;

var dial_values = [];

/*~~~~~ On Ready State ~~~~~~*/

function onDocumentReady() {
        
    var gauges = {}
    for( var i=0; i<5; i++ ){
            gauges["g" + String(i)] = gauge("#gauge-" + String(i), {
    		size: 168,
    		clipWidth: 218,
    		clipHeight: 218,
    		ringWidth: 6,
    		maxValue: 100,
    		transitionMs: 4000,
    	});
    	gauges["g" + String(i)].render();
    	      
    } 	
		
	function updateReadings() {    		
		for( var n=0; n<5; n++ ){ 
    		var value = dial_values.pop();
    		gauges["g" + String(n)].update(value);
    		
    		$('#led-' + String(n)).removeClass('green orange yellow');
    		if(value < 40 )
                $('#led-' + String(n)).addClass('orange');
            else if(value<70)
                $('#led-' + String(n)).addClass('yellow');
            else
                $('#led-' + String(n)).addClass('green');
            var sNumber = value.toFixed(2);
            len = sNumber.length;
            
            if(value<10)
                sNumber = "0" + sNumber;
            sNumber = sNumber.replace(/\./g,'');
            
            for (var i = 0; i < len; i += 1) {
                $("#counter-" + String(n) + " li.count" + String(i+1)).text( function(){return sNumber.charAt(i);});
            }
        }
	}
    
    /* If the first child in the alert box is a real alert, then display alert. */
    if($("#alerts-box").children().length > 0 && $("#alerts-box .alert").first().attr("id")!="no-alerts"){
        ToggleAlertsBox();
        $('#alerts-label').addClass("active-alerts");
    }
    
    tooltip = d3.select("#graph")
	.append("div")
	.attr("class", "tooltip-0");
	tooltip.append("div")
	.attr("class", "tool-label bold large")
	.text("tooltip");
	
	/* (tooltip[0][0].clientWidth / 2) */
	
	tooltip.append("div").attr("class", "pointer-box down")
	.style("left",  String( 
	      ( $(".pointer.small").width()  - $(".tooltip-0").width()/2 + 8) /2 
	   )  + "px")
	.append("div")
	.attr("class", "pointer small").style("left", "0px");
    
    $.getJSON("../public/data/dials.json", function(json){
        for(var n in json){
            dial_values.push(json[n]);
        }
        dial_values.reverse();
        updateReadings();
    });
		
	
    draw();
    
    $('body').click(function(){
        $('.tooltip-0').animate({
            opacity: 0
            },500,function(){
                $('.tooltip-0').css("opacity", "0.95");
                $('.tooltip-0').css("visibility", "hidden");
            });
        });
    
}

if( !window.isLoaded )
	window.addEventListener("load", function(){ onDocumentReady(); }, false);
else
	onDocumentReady();



/*~~~~~~ Functions ~~~~~~*/

function draw(exclude, index, insert){
    var weeks = [];
    var ex = "key !== 'Week'";
    
    var x = d3.scale.linear()
        .range([0, width]);
    
    var y = d3.scale.linear()
        .range([height, 0]);
     
    tooltip.style("visibility", "hidden");
        
    if(index != null){        
        if(!insert)
            colors.splice(colors.indexOf(_COLORS_[index]), 1);
        else
            colors = intersect(_COLORS_, colors, _COLORS_[index])       
    }
    else{
        colors = _COLORS_.slice(0);
    }
    
    var color = d3.scale.ordinal().range(colors);
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    
    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.engagement); });
    
    var svg = d3.select("#graph .hide").insert("svg","#events")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "glance-graph")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 
    
    d3.tsv("../public/data/glance.tsv", function(error, data) {
    	
    	if(exclude != null)
           for(n in exclude) ex += " && key != '" + exclude[n] + "'";
                   
        color.domain(d3.keys(data[0]).filter(function(key) { return eval(ex); }));
      
        data.forEach(function(d) {
    	    d.date = parseInt(d.Week);
    	    weeks.push(d.date);
        });
    
        var users = color.domain().map(function(name){
          return{
              name: name,
              values: data.map(function(d){
    		      return {date: d.date, engagement: +d[name]};
              })
          };
        });
    
        x.domain([
            d3.min(weeks),d3.max(weeks)
        ]);
        
        xAxis.ticks(d3.max(weeks)/2);
        
        y.domain([
            d3.min(users, function(c) { return d3.min(c.values, function(v) { return v.engagement; }); })*0.90,
            d3.max(users, function(c) { return d3.max(c.values, function(v) { return v.engagement; }); })*1.1
        ]);
        
        yAxis.ticks(d3.max(users, function(c) { return d3.max(c.values, function(v) { return v.engagement; }); })/10);
        
        svg.append("g")
          .attr("class", "x axis")
          .attr("id", "x-axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .style("opacity", "0")
          .transition().duration(50).delay(0).ease('in')
          .style("opacity", "1");
        
        d3.select("#x-axis")
          .append("text")
          .attr("class", "text")
          .attr("y", 30)
          .attr("x", 600)
          .attr("dy", ".71em")
          .text("Time period in weeks")
          .style("opacity", "0")
          .transition().duration(50).delay(0).ease('in')
          .style("opacity", "1");
        
        svg.append("g")
          .attr("class", "y axis")
          .attr("id", "y-axis")
          .call(yAxis)
          .style("opacity", "0")
          .transition().duration(50).delay(0).ease('in')
          .style("opacity", "1");
        
        d3.select("#y-axis")    
          .append("text")
          .attr("class", "text")
          .attr("y", 5)
          .attr("x", 5)
          .attr("dy", ".71em")
          .text("Percentage of users")
          .style("opacity", "0")
          .transition().duration(50).delay(0).ease('in')
          .style("opacity", "1");
        
        var user = svg.selectAll(".user")
          .data(users)
          .enter().append("g")
          .attr("class", "user");
        
        user.append("path")
          .attr("d", function(d) { return d.values[0]; })
          .style("stroke", "#fff")
          .style("opacity", "0")
          .transition().duration(500).delay(50).ease('in')
          .style("opacity", "1")
          .style("stroke", function(d) {return color(d.name); })
          .attr("d", function(d) { return line(d.values); })
          .attr("class",function(d) { return "line line-" + d.name.replace(/_/g,"-"); });
        
        user.append("circle")
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
          .attr("transform", function(d) {return "translate(" + x(d.value.date) + "," + y(d.value.engagement) + ")"; })
          .style("opacity", "0")
          .transition().duration(500).delay(50).ease('in')
          .style("opacity", "1")
          .attr("r", 3)
          .attr("fill",function(d) { return color(d.name); })
          .attr("class",function(d) { return "line-" + d.name.replace(/_/g,"-"); });
        
        d3.csv("../public/data/Events.csv", function(data){
            var i=0;
            data.forEach(function(e) {
                  
                user.append("circle")              
                    .datum(function(d){ return { name: d.name, value: d.values[check(d,e.EventWeek1)] }; })
                    .attr("transform", function(d){ 
                        return "translate(" + x(e.EventWeek1) + "," + y(d.value.engagement) + ")"; })
                    .attr("r", 0)
                    .style("opacity", "0")
                    .transition().duration(600).delay(50).ease('elastic')
                    .style("opacity", "1")
                    .attr("r", 3.5)
                    .attr("stroke",function(e) { return color(e.name); })
                    .attr("fill",function(e) { return "#FFFFFF"; })
                    .attr("class",function(d) { return "line-" + d.name.replace(/_/g,"-"); });
            
                for(var j=0; j<colors.length; j++){
                    
                    var c  = user[0][j].childNodes[i+2];
                    var cp = user[0][j];
                    
                    c.eventkey = String.fromCharCode(65+i);

                    d3.select(c).on("mouseover", function(){
                        tooltip.style("visibility", "visible")
                        .style("top",  function(cy){ return d3.event.pageY - 50 +"px";})
                        .style("left", function(cx){ return d3.event.pageX - (tooltip[0][0].clientWidth/2) +"px";})
                        d3.select('.tool-label').text(function(){ return c.eventkey;});
                        d3.select(".pointer-box.down").style("left",  String( 
                            ( $(".tooltip-0").width() - $(".pointer-box.down").width() - 8) /2 
                        )  + "px");
                        return tooltip;
                    })

                    .on("mousemove", function(){})
                    
                    .on("mouseout", function(d,cx,cy){
                        /*if( d3.event.pageY > cy-20 && d3.event.pageX > cx-20)*/ 
                            /* return tooltip.style("visibility", "hidden"); */
                    });
                    
                    /* d3.select(c).attr("title",function(){ return String.fromCharCode(65+i);} ); */
                    
/*
                    d3.select(cp)
                    .append("text")
                    .attr("class", "text")
                    .attr("transform", function(d){ 
                        return "translate(" + 
                            x(Number(e.EventWeek1)) + "," + 
                            y(d3.max(users, function(c){ 
                                return d3.max(c.values, function(v){ 
                                    return v.engagement; })*1.03; })) + ")"; })
            
                    .attr("dy", ".71em")
                    .text(function(){ return String.fromCharCode(65+i);});   
*/                    
                }
                i++;  
            });
        });
     });
}

function check(arr, val){
    var retVal = false;
    $.each(arr, function(k,v){
        $.each(arr["values"], function(i, v2){
            if (val == v2.date) retVal = i;
        });
    });
    return retVal;
}

function intersect(a, b, c){
    var ai=0, bi=0;
    var result = b.slice(0);
        
    result.push(c)
    var diff = $(a).not(result).get();    
    result = $(a).not(diff).get();

    return result;
}

function eventTip(){
    content = '<span class=\"title\"><a href=\"">' + "hello" + '</a></span><br/>' +
       "world" + "<br/>";
    tooltip.showTooltip(content, d3.event);
}


function ToggleAlertsBox(){
    if($("#alerts-box").css("display") == "none"){
        $("#alerts-box").css("display","block");
        $("#alerts-box").animate( {width:788, opacity:1}, 1000);
    }
    else{
        $("#alerts-box").animate( {width:0, opacity:0.5}, 1000, 
            function(){
                $("#alerts-box").css("display","none");
            }    
        );        
    }
}

function ToggleGraph(elem, line, index){
    if(!$(elem).hasClass("disabled")){
        $(elem).addClass("disabled");
        $(elem).find("i").removeClass("icon-ok");
        $(elem).find("i").addClass("icon-remove");
        
        if($.inArray(line, hidden)==-1)
            hidden.push(line);

        $('.line-'+line).fadeOut(500, function(){
            //$('#glance-graph ').remove();
            //$('.line-'+line).remove();
            //draw(hidden, index, colors, false);
        });
        $('#glance-graph').remove();
        draw(hidden, index, false);
       
    }
    else{
        $(elem).removeClass("disabled");
        $(elem).find("i").removeClass("icon-remove");
        $(elem).find("i").addClass("icon-ok");
        $('.line-'+line).fadeIn(500, function(){});
        hidden.splice(hidden.indexOf(line), 1);    
        $('#glance-graph').remove();
        draw(hidden, index, true);
    }
}

	
	
function ToggleEvent(label, id){
function highlight( content, evnt ){}
function downlight( content, evnt ){}    
}
