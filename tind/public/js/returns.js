// data that you want to plot, I've used separate arrays for x and y values
var margin = {top: 30, right: 30, bottom: 50, left: 50},
    width  = 760 - margin.left - margin.right,
    height = 400 - margin.top  - margin.bottom;

if( !window.isLoaded )
	window.addEventListener("load", function(){ onDocumentReady(); }, false);
else
	onDocumentReady();
	
function onDocumentReady(){
    draw_costs();
}

function draw_costs(){
    d3.csv("../public/data/bigcosts.csv", function(error, data) {
        var costs = [];
        var pop = [];
        var size = [];
        var colors = [ '#57a1ff','#8e7cff', '#a96aff','#c95cc7','#db55a6', '#ff4566', '#ff4566','#a96aff'];
        /* var color = d3.scale.ordinal().range([ '#57a1ff','#8e7cff', '#a96aff','#c95cc7','#db55a6', '#ff4566' ]); */
        
        data.forEach(function(d) {
                costs.push(parseInt(d.costs));
                pop.push(parseInt(d.popgrowth));
                size.push(parseInt(d.population))
        });
    
    var formatPercent = d3.format(".0%");
    
    // size and margins for the chart
    
    
    // x and y scales, I've used linear here but there are other options
    // the scales translate data values to pixel values for you
    var x = d3.scale.linear()
              .domain([0, d3.max(costs)*1.2])  // the range of the values to plot
              .range([ 0, width ]);        // the pixel range of the x-axis
    
    var y = d3.scale.linear()
              .domain([/* -d3.min(pop)*1.2 */0, d3.max(pop)*1.2])
              .range([ height, 0 ]);
    
    // the chart object, includes all margins
    var chart = d3.select('#big-costs')
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'chart')
    
    // the main object where the chart and axis will be drawn
    var main = chart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'main')   
    
    // draw the x axis
    var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    /* .tickFormat(formatPercent) */
    .ticks(4);
    
    main.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'main axis date')
    .call(xAxis)
    .append("text")
    .attr("class", "text")
    .attr("y", 30)
    .attr("x", 540)
    .attr("dy", ".71em")
    .text("Growth in average cost, %");
    
    // draw the y axis
    var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    /* .tickFormat(formatPercent) */
    .ticks(8)
    /* .tickValues([0, 10, 20, 30, 40, 50, 60]) */;
    
    
    main.append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'main axis date')
    .call(yAxis)
    .append("text")
    .attr("class", "text")
    .attr("y", -15)
    .attr("x", -25)
    .attr("dy", ".71em")
    .text("Growth in number of people, %");
    
    
    // draw the graph object
    var g = main.append("svg:g");
    
    g.selectAll("scatter-dots")
      .data(pop)  // using the values in the ylow array
      .enter().append("svg:circle")  // create a new circle for each value
          .attr("cy", function (d,i) { return y(pop[i]); } ) // translate y value to a pixel
          .attr("cx", function (d,i) { return x(costs[i]); } ) // translate x value
          .attr("fill", function(d,i){ return colors[i];})
          .attr("stroke", function(d,i) { return d3.rgb(colors[i]).darker(0.6); })
          .attr("r", function(d,i){return size[i]/10;})
          .style("opacity", 0.8)
    
    g.selectAll("scatter-dots")
      .data(data)
      .enter().append("text")
        .attr("dy", function (d,i) { return y(pop[i])-5; } )
        .attr("dx", function(d, i){return x(costs[i])+5;})
        .text(function(d, i){return String(d.group)/*  + ", " + String(size[i]) */;})
        .attr("class", "bubble-labels")
      ;
    
    
    });

}