var margin = {top: 150, right: 180, bottom: 50, left: 20},
    width  = 760 - margin.left - margin.right,
    height = 770 - margin.top  - margin.bottom,
    
    gridSize = Math.floor(width / 10),
    legendElementWidth = gridSize*0.7,
    buckets = 9,
    colors = ["#41b6c4", "#7fcdbb", "#c7e9b4","#d5f6a4", "#fff989", "#ffe188", "#fecc5c", "#fd8d3c", "#f03b20"],
    /* "#d9eca7",  "#edf8b1",  "#ffffd9", "#ffffb2",*/
    /*,"#1d91c0", "#225ea8","#253494","#081d58" */ // alternatively colorbrewer.YlGnBu[9]
    days = ["Memorial Hospital", "Regional Medical Center", "Small Town Hospital", "Small State Hospital", "Cancer Center", "St Mary's", "St Vincents", "Riverdale Clinic", "Medical Center 55", "Ambulance Company"],
    times = ["Muscuo-skeletal", "Gastro-intestinal", "Pregnancy", "Cancer", "Cardiac", "Spinal", "Pulmonary", "Trauma", "Neurological", "Others"];

if( !window.isLoaded )
	window.addEventListener("load", function(){ onDocumentReady(); }, false);
else
	onDocumentReady();

function onDocumentReady(){
    redraw();
}

function redraw(num){
    margin = {top: 150, right: 180, bottom: 50, left:20},
    width  = 760 - margin.left - margin.right,
    height = 800 - margin.top  - margin.bottom;
    
    /* $(".tooltip-1").remove(); */
        
    if(num){
        $("#graph-"+num+" .box svg").remove()
        eval('graph'+num+'()')
    }
    else{
        $(".box svg").remove();
        graph1();
    }    
}


function graph1(){

    d3.tsv("../public/data/providers.tsv",
    function(error, data) {
      
      var colorScale = d3.scale.quantile()
          .domain([1.0,  1.9/* d3.max(data, function (d) { return d.value; }) */ ])
          .range(colors);
    
      var svg = d3.select("#heatmap").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
      var dayLabels = svg.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 575)
            .attr("y", function (d, i) { return i * gridSize; })
            /* .style("text-anchor", "end") */
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });
    
      var timeLabels = svg.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0/* function(d, i) {return -this.getComputedTextLength()} */)
            .style("text-anchor", "middle")
            .attr("transform", function(d,i){return "rotate(-65 " + 
                ((i * gridSize) - (gridSize/4) ) + ", " + 
                (-this.getComputedTextLength()) +")"})
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });
    
      var heatMapGroup = svg.selectAll(".hour")
          .data(data)
          .enter()
          .append("g");
     
     var heatMap = heatMapGroup
          .append("rect")
          .attr("x", function(d) { return (d.hour - 1) * gridSize; })
          .attr("y", function(d) { return (d.day - 1) * gridSize; })
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("class", "hour bordered")
          .attr("width", gridSize)
          .attr("height", gridSize)
          .style("fill", colors[0]);
    
      heatMap.transition().duration(1000)
          .style("fill", function(d) { return colorScale(d.value); });
    
      /* heatMap.append("title").text(function(d) { return d.value; }); */
          
      heatMapGroup
        .append("text")
        .text(function(d) { return d.value; })
        .attr("x", function(d) { return ((d.hour - 1) * gridSize) + gridSize/2; })
        .attr("y", function(d) { return ((d.day) * gridSize) - gridSize/2 + this.getComputedTextLength()/2; })
        .style("text-anchor", "middle")
        .style("fill", function(d){ return d3.rgb(colorScale(d.value)).darker(0.5); })
        .attr("class", "score")
        ;
          
      var legend = svg.selectAll(".legend")
          .data([1].concat(colorScale.quantiles()), function(d) { return d.toFixed(1); })
          .enter().append("g")
          .attr("class", "legend");
    
      svg.append("text")
        .text("Health Risk Assessment Scores")
        .attr("y", height - 20 + gridSize/4);
      
      legend.append("rect")
        .attr("x", function(d, i) { return legendElementWidth * i; })
        .attr("y", height+5)
        .attr("width", legendElementWidth)
        .attr("height", gridSize / 4)
        .style("fill", function(d, i) { return colors[i]; });
            
      legend.append("text")
        .attr("class", "mono")
        .text(function(d, i){ 
            if(i==8)
                return d.toFixed(1) + "+";
            else
                return /* "\u2265" + */ d.toFixed(1);
            })
        .attr("x", function(d, i){ return legendElementWidth * i + legendElementWidth/2 - this.getComputedTextLength()/2; })
        .attr("y", height + 20 + gridSize/4);
    });
}