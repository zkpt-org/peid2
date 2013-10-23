var visible  = [0, 1, 2, 3, 4, 5];
var _COLORS_ = ['#3ea4bf', '#a084bf', '#ff4566', '#F6BB33', '#FF6A13', '#49bf92'];
var colors   = ['#3ea4bf', '#a084bf', '#ff4566', '#F6BB33', '#FF6A13', '#49bf92'];

var margin = {top: 30, right: 20, bottom: 50, left: 50},
    width  = 760 - margin.left - margin.right,
    height = 400 - margin.top  - margin.bottom;

if( !window.isLoaded )
	window.addEventListener("load", function(){ onDocumentReady(); }, false);
else
	onDocumentReady();
	
function onDocumentReady(){
    draw_top_diseases();
    draw_top_diffs();
}

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
          /* .style("cursor", "pointer") */
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
      /* .style("fill", function(d) { return colors[data.indexOf(d)];}) */
      .text(function(d) { i++; return labels[i] + ". " + d.condition; })
      .style("fill", "#aaaaaa");
      
    });    
}

function update_subcategories(d, condition){
    d3.select( d3.event.target ).style("fill", function(d){ return d3.rgb(d3.event.target.style.fill).brighter(0.5);});
}

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