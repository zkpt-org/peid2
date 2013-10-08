
var categories = ["Weight", "Steps", "BMI", "Systolic_Blood_Pressure", "Diastolic_Blood_Pressure"];
var count = 0;


function onDocumentReady() {
    draw(categories[count], "#slide-0");
    if(count == 0)
        $(".button-back").css("display","none");
    if(count >= categories.length-1)
        $(".button-fwd").css("display","none");   
}

if ( !window.isLoaded ) {
	window.addEventListener("load", function() {
		onDocumentReady();
	}, false);
}else{ onDocumentReady(); }



function ShiftSlide(dir){
        
    if(dir == 'next' && count < categories.length-1){  
        $(".button-back").css("display","block");
        $("#slide-"+count).animate(
            {left: '-=800', opacity: 0}, 
            {duration: 1000, easing: 'easeOutBounce', complete: function(){
                $("#slide-"+count).css('display','none');
                count++;
                
                $("#slides").append('<div id="slide-'+count+'"></div>');
                $("#slide-"+count).css('position','relative');
                $("#slide-"+count).css('opacity','0');
                $("#slide-"+count).css('left','800px');          
                draw(categories[count], "#slide-"+count);
                $("#slide-"+count).animate(
                    {left: '-=800', opacity: 1},
                    {duration: 1000, easing: 'easeOutBounce'});
                if(count >= categories.length-1)
                    $(".button-fwd").css("display","none");                 
        }});       
    }
    else if(dir == 'prev' && count > 0){
        $(".button-fwd").css("display","block");        
        $("#slide-"+count).animate(
            {left: '+=800', opacity: 0},
            {duration: 1000, easing: 'easeOutBounce', complete: function(){
                $("#slide-"+count).remove();
                count--;
                $("#slide-"+count).css('display','inline-block');
                $("#slide-"+count).animate({left: '+=800', opacity: 1},{duration: 1000, easing: 'easeOutBounce'});
                if(count == 0)
                    $(".button-back").css("display","none");   
        }});
        
    }
}



function draw(cat, slide){

    var label = cat.replace(/_/g, " ");
    
    var margin = {top: 30, right: 30, bottom: 50, left: 40},
        width  = 760 - margin.left - margin.right,
        height = 400 - margin.top  - margin.bottom;
    
    var parseDate = d3.time.format("%d-%b-%y").parse;
    
    var x = d3.scale.linear()
        .range([0, width]);
    
    var y = d3.scale.linear()
        .range([height, 0]);
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    
    var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });
    
    var color = d3.scale.ordinal().range(['#3399cc']);
    
    var svg = d3.select(slide).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    d3.csv("../public/data/outcome.csv", function(error, data) {
    	color.domain(d3.keys(data[0]).filter(function(key) { return key == cat; }));
      
      data.forEach(function(d) {
        d.date = parseInt(d.UserSpecificWeek);
        d.close = eval("+d." + cat);
      });
      x.domain(d3.extent(data, function(d) { return d.date; }));
      
      xAxis.ticks(d3.max(data, function(d) { return d.date; })/2);
      
      y.domain(
    	[
    	d3.min(data, function(d) {return d.close; })*0.95,
    	d3.max(data, function(d) {return d.close; })*1.05
    	]
    	// d3.extent(data, function(d) { return d.close; }));
    );
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
      
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          // .attr("transform", "rotate(-90)")
          .attr("y", 6)
    	  .attr("x", 6)
          .attr("dy", ".71em")
          // .style("text-anchor", "end")
    	.attr("class", "text")      
    	.text(label);
    
      svg.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line);
    });

}