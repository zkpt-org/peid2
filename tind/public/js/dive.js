function genders(){
    margin = {top: 30, right: 20, bottom: 50, left: 50},
    width  = 760 - margin.left - margin.right,
    height = 400 - margin.top  - margin.bottom;

     
    var x = d3.scale.linear()
    .range([0, width])
    
    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], .2);
        
    var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(function(d){
            return Math.abs(d)+"%"
        })
        .orient("top");
        
    var svg = d3.select("#genders").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    d3.json("../public/data/gender.json", function(error, data){
      
      x.domain(d3.extent(data, function(d) { return d.value; })).nice();
      y.domain(data.map(function(d) { return d.name; }));
      
      svg.selectAll(".bar")
          .data(data)
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .append("rect")
          .attr("class", function(d) { return d.gender == "female" ? "bar female" : "bar male"; })
          .attr("x", function(d) { return x(Math.min(0, d.value)); })
          .attr("y", function(d) { return y(d.name); })
          .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
          .attr("height", y.rangeBand())
       
     svg.selectAll(".bar-group") 
        .append("text")
            .text(function(d) { return d.name })
            .style("font-size", "medium")
            .attr("x", function(d){ return d.value < 0 ? x(0)-(this.getComputedTextLength()/2) : x(0) - 10 - this.getComputedTextLength();})
            .attr("y", function(d) { return y(d.name) + 45;})
            .style("text-anchor", function(d){return d.value < 0 ? "left" : "right";})
     svg.selectAll(".bar-group") 
        .append("text")
            .text(function(d) { return Math.abs(d.value) })
            .attr("x", function(d){ return d.value < 0 ? x(d.value)+10 : x(d.value)-10-this.getComputedTextLength();})
            .attr("y", function(d) { return y(d.name) + 45;})
            .style("text-anchor", function(d){return d.value < 0 ? "left" : "right";})
            .style("fill", "#fff")
            
      svg.append("g")
          .attr("class", "x axis")
          .call(xAxis)

      svg.append("g")
          .attr("class", "y axis")
        .append("line")
          .attr("x1", x(0))
          .attr("x2", x(0))
          .attr("y2", height);
    
    });
}

function conditions(){
    var margin = {top: 30, right: 20, bottom: 50, left: 120},
        width  = 760 - margin.left - margin.right,
        height = 400 - margin.top  - margin.bottom;


    var x = d3.scale.linear()
        .range([0, width]);
    
    var y = d3.scale.ordinal().rangeRoundBands([0,height]);
     
    var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(d3.format(".0%"))
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    
    var line = d3.svg.line()
        .interpolate("linear")
        .x(function(d) { return x(d.value) })
        .y(function(d) { return y(d.disease)+ y.rangeBand()/2; })
        
    if($('#conditions-graph').length)
        $('#conditions-graph').remove()
   
    var svg = d3.select("#conditions").append("svg")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top  + margin.bottom)
        .attr("id", "conditions-graph")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function make_x_axis() {        
        return d3.svg.axis()
            .scale(x)
             .orient("bottom")
             .ticks(20)
    }
    
    function make_y_axis() {        
        return d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
    }
    
    d3.json("../public/data/dive_conditions.json", function(error, data) {

      var target = []
      var benchmark = []
        
      data.forEach(function(d){
        benchmark.push({disease:d.disease, value:d.benchmark})
        target.push({disease:d.disease, value:d.target})
      });
            
      x.domain([0,1]);
      y.domain(data.map(function(d){ return d.disease; }));
            
      svg.append("g")
          .attr("class", "x axis")
          .attr("id", "x-axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("y", 25)
          .attr("x", width)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Percentage of population")
          .style("opacity", "0")
          .transition().duration(50).delay(0).ease('in')
          .style("opacity", "1");
    
      svg.append("g")
          .attr("class", "y axis")
          /* .attr("transform", "translate(" + width + ",0)") */
          .call(yAxis)
/*
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Disease Conditions")
          .style("opacity", "0")
          .transition().duration(50).delay(0).ease('in')
          .style("opacity", "1")
*/;

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
          .datum(target)
          .attr("class", "target")
          .attr("d", line);
            
      svg.append("path")
          .datum(benchmark)
          .attr("class", "benchmark")
          .attr("d", line);
    
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





(function() {

// Inspired by http://informationandvisualization.de/blog/boxplot-plot
d3.boxplot = function() {
  var width = 1,
      height = 1,
      duration = 0,
      domain = null,
      value = Number,
      whiskers = boxplotWhiskers,
      quartiles = boxplotQuartiles,
      tickFormat = d3.format(',.2f');

  // For each small multipleÉ
  function boxplot(g) {
    g.each(function(d, i) {
      d = d.map(value).sort(d3.ascending);
      var g = d3.select(this),
          n = d.length,
          min = d[0],
          max = d[n - 1];

      // Compute quartiles. Must return exactly 3 elements.
      var quartileData = d.quartiles = quartiles(d);

      // Compute whiskers. Must return exactly 2 elements, or null.
      var whiskerIndices = whiskers && whiskers.call(this, d, i),
          whiskerData = whiskerIndices && whiskerIndices.map(function(i) { return d[i]; });

      // Compute outliers. If no whiskers are specified, all data are "outliers".
      // We compute the outliers as indices, so that we can join across transitions!
      var outlierIndices = whiskerIndices
          ? d3.range(0, whiskerIndices[0]).concat(d3.range(whiskerIndices[1] + 1, n))
          : d3.range(n);

      // Compute the new x-scale.
      var x1 = d3.scale.linear()
          .domain(domain && domain.call(this, d, i) || [min, max])
          .range([height, 0]);

      // Retrieve the old x-scale, if this is an update.
      var x0 = this.__chart__ || d3.scale.linear()
          .domain([0, Infinity])
          .range(x1.range());

      // Stash the new scale.
      this.__chart__ = x1;

      // Note: the boxplot, median, and boxplot tick elements are fixed in number,
      // so we only have to handle enter and update. In contrast, the outliers
      // and other elements are variable, so we need to exit them! Variable
      // elements also fade in and out.

      // Update center line: the vertical line spanning the whiskers.
      var center = g.selectAll("line.center")
          .data(whiskerData ? [whiskerData] : []);

      center.enter().insert("line", "rect")
          .attr("class", "center")
          .attr("x1", width / 2)
          .attr("y1", function(d) { return x0(d[0]); })
          .attr("x2", width / 2)
          .attr("y2", function(d) { return x0(d[1]); })
          .style("opacity", 1e-6)
        .transition()
          .duration(duration)
          .style("opacity", 1)
          .attr("y1", function(d) { return x1(d[0]); })
          .attr("y2", function(d) { return x1(d[1]); });

      center.transition()
          .duration(duration)
          .style("opacity", 1)
          .attr("y1", function(d) { return x1(d[0]); })
          .attr("y2", function(d) { return x1(d[1]); });

      center.exit().transition()
          .duration(duration)
          .style("opacity", 1e-6)
          .attr("y1", function(d) { return x1(d[0]); })
          .attr("y2", function(d) { return x1(d[1]); })
          .remove();

      // Update innerquartile boxplot.
      var boxplot = g.selectAll("rect.boxplot")
          .data([quartileData]);

      boxplot.enter().append("rect")
          .attr("class", "boxplot")
          .attr("x", 0)
          .attr("y", function(d) { return x0(d[2]); })
          .attr("width", width)
          .attr("height", function(d) { return x0(d[0]) - x0(d[2]); })
        .transition()
          .duration(duration)
          .attr("y", function(d) { return x1(d[2]); })
          .attr("height", function(d) { return x1(d[0]) - x1(d[2]); });

      boxplot.transition()
          .duration(duration)
          .attr("y", function(d) { return x1(d[2]); })
          .attr("height", function(d) { return x1(d[0]) - x1(d[2]); });

      // Update median line.
      var medianLine = g.selectAll("line.median")
          .data([quartileData[1]]);

      medianLine.enter().append("line")
          .attr("class", "median")
          .attr("x1", 0)
          .attr("y1", x0)
          .attr("x2", width)
          .attr("y2", x0)
        .transition()
          .duration(duration)
          .attr("y1", x1)
          .attr("y2", x1);

      medianLine.transition()
          .duration(duration)
          .attr("y1", x1)
          .attr("y2", x1);

      // Update whiskers.
      var whisker = g.selectAll("line.whisker")
          .data(whiskerData || []);

      whisker.enter().insert("line", "circle, text")
          .attr("class", "whisker")
          .attr("x1", 0)
          .attr("y1", x0)
          .attr("x2", width)
          .attr("y2", x0)
          .style("opacity", 1e-6)
        .transition()
          .duration(duration)
          .attr("y1", x1)
          .attr("y2", x1)
          .style("opacity", 1);

      whisker.transition()
          .duration(duration)
          .attr("y1", x1)
          .attr("y2", x1)
          .style("opacity", 1);

      whisker.exit().transition()
          .duration(duration)
          .attr("y1", x1)
          .attr("y2", x1)
          .style("opacity", 1e-6)
          .remove();

      // Update outliers.
      var outlier = g.selectAll("circle.outlier")
          .data(outlierIndices, Number);

      outlier.enter().insert("circle", "text")
          .attr("class", "outlier")
          .attr("r", 5)
          .attr("cx", width / 2)
          .attr("cy", function(i) { return x0(d[i]); })
          .style("opacity", 1e-6)
        .transition()
          .duration(duration)
          .attr("cy", function(i) { return x1(d[i]); })
          .style("opacity", 1);

      outlier.transition()
          .duration(duration)
          .attr("cy", function(i) { return x1(d[i]); })
          .style("opacity", 1);

      outlier.exit().transition()
          .duration(duration)
          .attr("cy", function(i) { return x1(d[i]); })
          .style("opacity", 1e-6)
          .remove();

      // Compute the tick format.
      var format = tickFormat || x1.tickFormat(8);

      // Update boxplot ticks.
      var boxplotTick = g.selectAll("text.boxplot")
          .data(quartileData);

      boxplotTick.enter().append("text")
          .attr("class", "boxplot")
          .attr("dy", ".3em")
          .attr("dx", function(d, i) { return i & 1 ? 6 : -6 })
          .attr("x", function(d, i) { return  i & 1 ? width : 0 })
          .attr("y", x0)
          .attr("text-anchor", function(d, i) { return i & 1 ? "start" : "end"; })
          .text(format)
        .transition()
          .duration(duration)
          .attr("y", x1);

      boxplotTick.transition()
          .duration(duration)
          .text(format)
          .attr("y", x1);

      // Update whisker ticks. These are handled separately from the boxplot
      // ticks because they may or may not exist, and we want don't want
      // to join boxplot ticks pre-transition with whisker ticks post-.
      var whiskerTick = g.selectAll("text.whisker")
          .data(whiskerData || []);

      whiskerTick.enter().append("text")
          .attr("class", "whisker")
          .attr("dy", ".3em")
          .attr("dx", 6)
          .attr("x", width)
          .attr("y", x0)
          .text(format)
          .style("opacity", 1e-6)
        .transition()
          .duration(duration)
          .attr("y", x1)
          .style("opacity", 1);

      whiskerTick.transition()
          .duration(duration)
          .text(format)
          .attr("y", x1)
          .style("opacity", 1);

      whiskerTick.exit().transition()
          .duration(duration)
          .attr("y", x1)
          .style("opacity", 1e-6)
          .remove();
    });
    d3.timer.flush();
  }

  boxplot.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return boxplot;
  };

  boxplot.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return boxplot;
  };

  boxplot.tickFormat = function(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return boxplot;
  };

  boxplot.duration = function(x) {
    if (!arguments.length) return duration;
    duration = x;
    return boxplot;
  };

  boxplot.domain = function(x) {
    if (!arguments.length) return domain;
    domain = x == null ? x : d3.functor(x);
    return boxplot;
  };

  boxplot.value = function(x) {
    if (!arguments.length) return value;
    value = x;
    return boxplot;
  };

  boxplot.whiskers = function(x) {
    if (!arguments.length) return whiskers;
    whiskers = x;
    return boxplot;
  };

  boxplot.quartiles = function(x) {
    if (!arguments.length) return quartiles;
    quartiles = x;
    return boxplot;
  };

  return boxplot;
};

function boxplotWhiskers(d) {
  return [0, d.length - 1];
}

function boxplotQuartiles(d) {
  return [
    d3.quantile(d, .25),
    d3.quantile(d, .5),
    d3.quantile(d, .75)
  ];
}

})();

