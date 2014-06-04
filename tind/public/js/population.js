var visible  = [0, 1, 2, 3, 4, 5];
var _COLORS_ = ['#3ea4bf', '#a084bf', '#ff4566', '#F6BB33', '#FF6A13', '#49bf92'];
var colors   = ['#3ea4bf', '#a084bf', '#ff4566', '#F6BB33', '#FF6A13', '#49bf92'];

var margin = {top: 30, right: 20, bottom: 30, left: 20},
    width  = 760,
    height = 380;

var margin = {top: 30, right: 30, bottom: 50, left: 60},
    width  = 760 - margin.left - margin.right,
    height = 400 - margin.top  - margin.bottom;
    
if( !window.isLoaded )
	window.addEventListener("load", function(){ onDocumentReady(); }, false);
else
	onDocumentReady();
	
function onDocumentReady(){
    redraw()  
}

function redraw(num){
    if(num){
        $("#graph-"+num+" .box svg").remove()
        eval('graph'+num+'()')
    }
    else{
        $(".box svg").remove();
        graph1();
        graph2();
        graph3();
    }    
}

function graph1(){draw_top_diseases()}
function graph2(){treatments()}
function graph3(){draw_top_diffs()}

function draw_top_diseases(){
    
    var radius = Math.min(width, height-20) / 2;
    var color = d3.scale.ordinal().range(colors);
    
    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 80);
    
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.population; });
    
    var svg = d3.select("#top-diseases").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 4 + "," + ((height / 2) + 20)  + ")");
    
    var legend = svg.append("g")
    .attr("class", "legend")
    .attr("x", width)
    .attr("y", 25)
    .attr("height", 100)
    .attr("width", 500)
    .attr('transform', 'translate(50,-150)');
    
    var tooltip2 = d3.select("#graph-1")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .attr("class", "tooltip-2");
        
     var subcond = d3.select("#graph-1 .box")
    .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("z-index", "10")
    .style("top", 350/* String(legend[0][0].getBoundingClientRect().bottom + 160) */+"px")
    .style("left", 615/* String(legend[0][0].getBoundingClientRect().left + 140) */ +"px" )
    .attr("id", "condition-stats");   
    
    
    var orig_color;
    var labels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    var i = -1;
    
    //d3.json("../public/data/top_diseases.json", function(error, data) {
    RenderGraph("population", 1, function(data){    
      
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
              d3.select('#condition-stats').style("visibility", "visible")
              
              list = "<table>"
              for(var cond in d.data.details){
                list += "<tr><td>"+cond+": </td><td>"+ d.data.details[cond] +"</td></tr>"
              }
              list += "</table>"    
              
              $('#condition-stats').html('<h3 style="color:'+orig_color+';">'+d.data.condition +/* ", "+d.data.population+ */"</h3>"+list);
          })
          .on("mouseout", function(){
             d3.select( d3.event.target ).style("fill", orig_color);
             tooltip2.style("visibility", "hidden")
             d3.select('#condition-stats').style("visibility", "hidden")  
          });
    
      g.append("text")
          .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .style("text-anchor", "middle")
          .style("cursor", "default")
          .text(function(d) { i++; return labels[i]; });
      
      var topn = 5;
      
      legend.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d){var xpos = data.indexOf(d)<topn ? 150 : 330; return xpos;})
      .attr("y", function(d, i){var ypos = data.indexOf(d)<topn ? i *  25 : (i-(topn)) * 25; return ypos})
      .attr("width", 15)
      .attr("height",15)    
      .style("fill", function(d) {
            return colors[(data.indexOf(d)<colors.length) ? (data.indexOf(d)) : (data.indexOf(d) % colors.length)];
      });
      
      i = -1;
      legend.selectAll('text')
      .data(data)
      .enter()
      .append("text")
        .attr("x", function(d){var xpos = data.indexOf(d)<topn ? 175 : 355; return xpos;})
        .attr("y", function(d, i){
            var ypos = data.indexOf(d)<topn ? i *  25 + 12 : (i-(topn)) * 25 + 12; 
            return ypos;
        })
      /* .style("fill", function(d) { return colors[data.indexOf(d)];}) */
      .text(function(d) { i++; return labels[i] + ". " + d.condition;} )
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
        .attr("width",  width + margin.left + margin.right)
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

function treatments(){
    // example at http://bl.ocks.org/mbostock/4679202
    
    var margin = {top: 30, right: 30, bottom: 60, left: 30},
    width  = 760 - margin.left - margin.right,
    height = 400 - margin.top  - margin.bottom;
    
    /* var height = 600 - margin.top  - margin.bottom; */
    var parseDate = d3.time.format("%Y-%m").parse,
    formatYear = d3.format("02d"),
/*     formatDate = function(d) { return "Q" + ((d.getMonth() / 3 | 0) + 1) + formatYear(d.getFullYear() % 100); }; */
    formatDate = function(d) { return d };



var y0 = d3.scale.ordinal()
    .rangeRoundBands([height,0], 0.01);
var y1 = d3.scale.linear();
//var y1 = d3.scale.linear().domain([0, height])

var x = d3.scale.ordinal()
    .rangeRoundBands([10, width-80], 0.1, 0);

var xAxis1 = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(formatDate);


var nest = d3.nest()
    .key(function(d) { return d.treatment; });

var stack = d3.layout.stack()
    .values(function(d) { return d.values; })
    .x(function(d) { return d.dates; })
    .y(function(d) { return d.value; })
    .out(function(d, y0) { d.valueOffset = y0; });


/* var color = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]); */
/* var color = d3.scale.ordinal().range([ '#90CA77', '#81C6DD', '#E9B64D', '#E48743', '#E48743', '#9E3B33' ]); */
var color = d3.scale.ordinal().range(['#ff4566','#db55a6','#c95cc7','#a96aff','#8e7cff','#57a1ff']);
/*var color = d3.scale.linear().range(["#aad", "#556"]);*/

var svg = d3.select("#treatments").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//d3.csv("../public/data/treatments.csv", function(error, data) {
RenderGraph("population", 2, function(data){
  data.forEach(function(d) {
    /*d.date = parseDate(d.date);*/
    d.value = +d['cost%'];
  });
  
  var dataByGroup = nest.entries(data);
  dataByGroup = dataByGroup.slice(0, 5);
  
  //nest(dataByGroup);
  stack(dataByGroup);
    
  x.domain(dataByGroup[0].values.map(function(d) { return d.dates; }));
  y0.domain(dataByGroup.map(function(d) { return d.key; }));
/*
  y1.domain([0, d3.max(dataByGroup, function(dg){ 
    var arr = []
    for(i in dg.values)
        arr.push(dg.values[i].count)
    console.log(Math.max.apply(Math,arr))
    return Math.max.apply(Math,arr); 
  })]).range([y0.rangeBand(), 0]);  
*/
  
  y1.domain([0, d3.max(data, function(d) { return d.value; })]).range([y0.rangeBand(), 0]);

  var group = svg.selectAll(".group")
      .data(dataByGroup)
    .enter().append("g")
      .attr("class", "group")
      .attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });

  group.append("text")
      .attr("class", "group-label")
      .attr("x", -20)
      .attr("y", function(d) { return y1(d.values[0].value / 2); })
      .attr("dy", ".35em")
      .text(function(d) { return d.key; });

  group.selectAll("rect")
      .data(function(d) { return d.values; })
    .enter().append("rect")
      .style("fill", function(d) { return color(d.treatment); })
      .style("stroke", "#fff")
      .attr("x", function(d) { return x(d.dates)+(x.rangeBand()/2)*1.1; })
      .attr("y", function(d) { return y1(d.value); })
      .attr("width", x.rangeBand()/1.5)
      .attr("height", function(d) { return (y0.rangeBand() - y1(d.value)); });

  group.filter(function(d, i) { return !i; }).append("g")
      .attr("class", "x axis")
      .attr("transform", "translate("+((x.rangeBand()/3)*1.2)+"," + y0.rangeBand() + ")")
      .call(xAxis1);

  group.selectAll("svg").
      data(function(d) { return d.values; }).
      enter().
      append("svg:text").
      attr("class", "percent").
      attr("x", function(d) { return x(d.dates)+(x.rangeBand()/3)*1.1;}).
      attr("y", function(d) { return y1(d.value); }).
      attr("dx", x.rangeBand()).
      attr("dy", "1.2em").
      attr("text-anchor", "middle").
      text(function(d) { return d.value+"%";}).
      attr("class", "bar-text");

  group.selectAll("svg").
      data(function(d) { return d.values; }).
      enter().
      append("svg:text").
      attr("class", "percent").
      attr("x", function(d) { return x(d.dates)+(x.rangeBand()/3)*1.1;}).
      attr("y", function(d) { return y1(d.value); }).
      attr("dx", x.rangeBand()).
      attr("dy", "1.2em").
      attr("text-anchor", "middle").
      text(function(d) { return d.count+"%";}).
      attr("class", "bar-text2");

  group.selectAll("svg").
      data(function(d) { return d.values; }).
      enter().
      append("svg:text").
      attr("class", "percent").
      attr("x", function(d) { return x(d.dates)}).
      attr("y", function(d) { return y1(d.value); }).
      attr("dx", x.rangeBand()).
      attr("dy", "1.2em").
      attr("text-anchor", "middle").
      text(function(d) { return "$"+d['cost$'];}).
      attr("class", "bar-costs");


  d3.selectAll("input").on("change", change);

  var timeout = setTimeout(function() {
    d3.select("input[value=\"stacked\"]").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(timeout);
    if (this.value === "multiples") transitionMultiples();
    else transitionStacked();
  }

  function transitionMultiples() {
    var t = svg.transition().duration(750),
        g = t.selectAll(".group").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
    
    $(".bar-text2").fadeOut()
    
    g.selectAll("rect").attr("y", function(d) { return y1(d.value); });
    g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2); })
    g.selectAll(".bar-text2").attr("y", function(d) { return y1(d.value); })
    g.selectAll(".bar-costs").attr("y", function(d) { return y1(d.value); })
    
    $('#treatments').animate({
        height: height + margin.top  + margin.bottom + 40,
        }, 750, function() {
    });
    
    $('#graph-3 .box').animate({'min-height': "400px"}, 750)
    
    $('#treatments svg').animate({
        height: height + margin.top  + margin.bottom + 40,
        }, 750, function() {
    });
    
    
  }

  function transitionStacked() {
    var t = svg.transition().duration(750),
        g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
    
    var offset = y0(y0.domain()[0]) - (margin.top + margin.bottom)
    
    g.selectAll("rect").attr("y", function(d) { return y1(d.value + d.valueOffset) - offset; });
    g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2 + d.values[0].valueOffset) - offset; });
    g.selectAll(".bar-text2").attr("y", function(d) { return y1(d.value + d.valueOffset) - offset; });
    g.selectAll(".bar-costs").attr("y", function(d) { return y1(d.value + d.valueOffset) - offset; });
    
    $('#treatments').animate({
        height: offset + (margin.top + margin.bottom),
        }, 750, function() {
        
    });
    
    $('#graph-3 .box').animate({'min-height': (160 + margin.top  + margin.bottom +60) + "px"}, 750)
    
    $('#treatments svg').animate({
        height: offset + (margin.top + margin.bottom),
        }, 750, function() {
            $(".bar-text2").fadeIn()
    });
  }
});
}