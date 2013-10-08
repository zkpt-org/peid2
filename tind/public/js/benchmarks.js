var margin = {top: 5, right: 75, bottom: 20, left: 110},
    width = 760 - margin.left - margin.right,
    height = 50 - margin.top - margin.bottom;


var chart = d3.bullet()
    .width(width)
    .height(height);

$(document).ready(function() {
    var source = ["engagement", "activity", "outcomes"];
    
    for(var d in source){
        draw(source[d]);
    }
            
});

function randomize(d) {
  if (!d.randomizer) d.randomizer = randomizer(d);
  d.ranges = d.ranges.map(d.randomizer);
  d.markers = d.markers.map(d.randomizer);
  d.measures = d.measures.map(d.randomizer);
  return d;
}

function randomizer(d) {
  var k = d3.max(d.ranges) * .2;
  return function(d) {
    return Math.max(0, d + k * (Math.random() - .5));
  };
}


function draw(source){
    d3.json("../public/data/benchmarks.json", function(error, data) {
      console.log("data[0]."+source);
      var svg = d3.select("#"+source).selectAll("svg")
          .data(eval("data[0]."+source))
        .enter().append("svg")
          .attr("class", "bullet")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .call(chart);
      
      var title = svg.append("g")
          .style("text-anchor", "end")
          .attr("transform", "translate(-6," + height / 2 + ")");
    
      title.append("text")
          .attr("class", "title")
          .text(function(d) { return d.title; });
    
      title.append("text")
          .attr("class", "subtitle")
          .attr("dy", "1.6em")
          .text(function(d) { return d.subtitle; });
    
/*
      d3.selectAll("button").on("click", function() {
        svg.datum(randomize).call(chart.duration(1000)); 
      });
*/
    });

}