
var categories = ["Weight", "Blood_Glucose", "Systolic_Blood_Pressure", "Diastolic_Blood_Pressure"];
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

var label = "Change in "+cat.replace(/_/g, " ");
/* var label = cat; */
d3.csv("../public/data/"+cat+".csv", function(error, data) {
// size and margins for the chart
var margin = {top: 30, right: 30, bottom: 50, left: 40},
    width  = 760 - margin.left - margin.right,
    height = 400 - margin.top  - margin.bottom;

    var x1 = [];
    var y1 = [];
    var x2 = [];
    var y2 = [];

    if(cat=="Weight"){
        data.forEach(function(d) {
            if(d.cnt >= 30 && d.group == "low"){
                x1.push(parseInt(d.date));
                y1.push(parseFloat(d.diff));                
            }
            if(d.cnt >= 30 && d.group == "high"){
                x2.push(parseInt(d.date));
                y2.push(parseFloat(d.diff))
            }
        });
        var x = d3.scale.linear()
                  .domain([0, d3.max(x1)])
                  .range([ 0, width ]);
        /* console.log(Math.min(d3.min(y1),d3.min(y2)).toFixed(2)); */
        ymax = Math.max(d3.max(y1),d3.max(y2));
        ymax > 0 && ymax < 1 ? ymaxx = ymax+Math.abs(ymax*1.5) : ymaxx = 1.0; 
        var y = d3.scale.linear()
                  .domain([Math.min(d3.min(y1),d3.min(y2)).toFixed(1)*1.2, (ymaxx).toFixed(1)])
                  .range([ height, 0 ]);
    }
    else if(cat=="Blood_Glucose"){
        data.forEach(function(d) {    
            if(d.cnt >= 10 && d.group==1){
                x1.push(parseInt(d.date));
                y1.push(parseFloat(d.diff));                
            }
        });
        var x = d3.scale.linear()
                  .domain([0, d3.max(x1)])
                  .range([ 0, width ]);
        /* console.log(Math.min(d3.min(y1),d3.min(y2)).toFixed(2)); */
        var y = d3.scale.linear()
                  .domain([d3.min(y1).toFixed(1)*1.2, (d3.max(y1) + Math.abs(d3.max(y1)*0.2)).toFixed(1)])
                  .range([ height, 0 ]);
    }
    else{
        data.forEach(function(d) {
            if(d.cnt >= 30){
                x1.push(parseInt(d.date));
                y1.push(parseFloat(d.diff));
            }
        });
        var x = d3.scale.linear()
                  .domain([0, d3.max(x1)])
                  .range([ 0, width ]);

        ymax = Math.max(d3.max(y1),d3.max(y2));
        ymax > 0 && ymax < 1 ? ymaxx = ymax+Math.abs(ymax*1.5) : ymaxx = 1.0; 

        var y = d3.scale.linear()
                  .domain([d3.min(y1).toFixed(1)*1.2, (ymaxx).toFixed(1)])
                  .range([ height, 0 ]);      
    }


// the chart object, includes all margins
var chart = d3.select(slide).append("svg")
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
.ticks(10);

main.append('g')
.attr('transform', 'translate(0,' + height + ')')
.attr('class', 'main axis date')
.call(xAxis)
.append("text")
// .attr("transform", "rotate(-90)")
.attr("y", 35)
.attr("x", 600)
.attr("dy", ".71em")
// .style("text-anchor", "end")
.attr("class", "text")      
.text("Weeks Elapsed");



// draw the y axis
var yAxis = d3.svg.axis()
.scale(y)
.orient('left')
/* .tickValues([-10.0, -7.5, -5.0, -2.5, 0.0]) */
.tickFormat(d3.format(".1f"));

main.append('g')
.attr('transform', 'translate(0,0)')
.attr('class', 'main axis date')
.call(yAxis)
.append("text")
// .attr("transform", "rotate(-90)")
.attr("y", -10)
.attr("x", 6)
.attr("dy", ".71em")
// .style("text-anchor", "end")
.attr("class", "text")      
.text(label);


/*
y.domain([
    d3.min(users, function(c) { return d3.min(c.values, function(v) { return v.engagement; }); })*0.90,
    d3.max(users, function(c) { return d3.max(c.values, function(v) { return v.engagement; }); })*1.1
]);
*/
// draw the graph object
var g = main.append("svg:g");
 g.selectAll("scatter-dots")
  .data(y1)  // using the values in the y1 array
  .enter().append("svg:circle")  // create a new circle for each value
      .attr("cy", function (d) { return y(d); } ) // translate y value to a pixel
      .attr("cx", function (d,i) { return x(x1[i]); } ) // translate x value
      .attr("r", 5) // radius of circle
      .attr("fill", '#3399cc')
      .style("opacity", 0.8); // opacity of circle


if(cat=="Weight"){
    var g2 = main.append("svg:g");
    g2.selectAll("scatter-dots")
      .data(y2)  // using the values in the y1 array
      .enter().append("svg:circle")  // create a new circle for each value
          .attr("cy", function (d) { return y(d); } ) // translate y value to a pixel
          .attr("cx", function (d,i) { return x(x2[i]); } ) // translate x value
          .attr("r", 5) // radius of circle
          /* .attr("fill", '#ff8a2b') */
          .attr("fill", '#ff4566') 
          .style("opacity", 0.8); // opacity of circle
    var key = main.append("svg:g");
    key.append("svg:circle")
          .attr("cy", 355 )
          .attr("cx", 0 )
          .attr("r", 8) // radius of circle
          /* .attr("fill", '#ff8a2b') */
          .attr("fill", '#ff4566')
          .attr("stroke", '#999999') 
          .style("opacity", 0.8);
    key.append("text")
            .attr("y", 350)
            .attr("x", 15)
            .attr("dy", ".71em")
            .attr("class", "text")      
            .text("High BMI");
    key.append("svg:circle")
          .attr("cy", 355 )
          .attr("cx", 80 )
          .attr("r", 8) // radius of circle
          /* .attr("fill", '#ff8a2b') */
          .attr("fill", '#3399cc')
          .attr("stroke", '#999999') 
          .style("opacity", 0.8);
    key.append("text")
            .attr("y", 350)
            .attr("x", 95)
            .attr("dy", ".71em")
            .attr("class", "text")      
            .text("Low BMI");
    
}    
    });
}