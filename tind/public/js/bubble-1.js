var risk = (function() {

    var urls = {      //API urls
        news  : "http://hndroidapi.appspot.com/news/format/json/page/?appid=vishna&callback=?",
        ask   : "http://hndroidapi.appspot.com/ask/format/json/page/?appid=vishna&callback=?",
        newest: "http://hndroidapi.appspot.com/newest/format/json/page/?appid=vishna&callback=?",
        best  : "http://hndroidapi.appspot.com/best/format/json/page/?appid=vishna&callback=?"
    },
        thread = /^(item[?]id[=][0-9]+)/,               //regexp for HN thread posts
        w = 760,  //width
        h = 400, //height
        m = 20,                                         //margin
        center = {                                      //gravity center
            x : ( w - m ) / 2,
            y : ( h - m ) / 2
        },
        posts,        //content
        next,         //next page
        o,            //opacity scale
        r,            //radius scale
        z,            //color scale
        g,            //gravity scale
        t = {         //time factors
            minutes : 1,
            hour    : 60,
            hours   : 60,
            day     : 1440,
            days    : 1440
        },
        gravity  = -0.04,//gravity constants
        damper   = 0.3,
        friction = 0.8,
        force = d3       //gravity engine
            .layout
            .force()
            .size([ w - m,
                    h - m ]),
        svg = d3         //container
            .select("#graph-2 .hide")
            .insert("svg", "#summary-1")
            .attr("height", h + "px")
            .attr("width", w + "px")
            .attr("class", "box"),
        circles,         //data representation
        tooltip = CustomTooltip( "posts_tooltip", 150 );

    function init( category ) {
        if ( urls[ category ] ) {
            load( urls[ category ], function() {
                launch();
                legend();
            });
        }
    }

    function update( category ) {
        if ( urls[ category ] ) {
            load( urls[ category ], function() {
                circles
                    .transition()
                    .duration( 750 )
                    .attr("r", function(d) { return r(d) + 100; })
                    .delay( 250 )
                    .style("opacity", function(d) { return 0; })
                    .remove();

                launch();
            });
        }
    }

    function load( url, callback ){
        $.getJSON("../public/data/risk_segments.json", function( data ) {

            posts = data.items;
            next = posts.pop();

            posts.map( function(d) {
                var comments = parseInt( d.comments ),
                    score    = parseInt( d.score ),
                    time     = d.time.split(" ");

                d.comments = comments ? comments : 0;
                d.score = score ? score : 0;
                d.time = time[0] * t[ time[1] ]; // number * factor

                if ( thread.test(d.url) ) {
                    d.url = "http://news.ycombinator.com/" + d.url;
                }

                return d;
            });

            // Defining the scales
            r = d3.scale.linear()
                .domain([ d3.min(posts, function(d) { return d.score; }),
                          d3.max(posts, function(d) { return d.score; }) ])
                .range([ 5, 90 ])
                .clamp(true);

            z = d3.scale.linear()
                .domain([ d3.min(posts, function(d) { return d.comments; }),
                          d3.median(posts, function(d) { return d.comments; }),
                          d3.max(posts, function(d) { return d.comments; }) ])
                .range([ '#57a1ff', '#a96aff', '#ff4566' ]);

            o = d3.scale.linear()
                .domain([ d3.min(posts, function(d) { return d.time; }),
                          d3.median(posts, function(d) { return d.time; }),
                          d3.max(posts, function(d) { return d.time; }) ])
                .range([ '#57a1ff', '#a96aff', '#ff4566' ]);

            g = function(d) { return -r(d) * r(d) / 2.5; };

            callback();
        });
    }

    function launch() {

        force
            .nodes( posts );

        circles = svg
            .append("g")
            .attr("id", "circles")
            .selectAll("a")
            .data(force.nodes());

        // Init all circles at random places on the canvas
        force.nodes().forEach( function(d, i) {
            d.x = Math.random() * w;
            d.y = Math.random() * h;
        });

        var node = circles
                .enter()
                .append("a")
                .attr("xlink:href", function(d) { return d.url; })
                .append("circle")
                .attr("r", 0)
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("fill", function(d) { return z( d.comments ); })
                /* .attr("stroke-width", 2) */
                .attr("stroke", function(d) { return d3.rgb(o(d.time)).darker(0.5); })
                .attr("id", function(d) { return "post_#" + d.item_id; })
                .style("fill", function(d) { return o( d.time ); })
                .on("mouseover", function(d, i) { force.resume(); highlight( d, i, this ); })
                .on("mouseout", function(d, i) { downlight( d, i, this ); });

        d3.selectAll("circle")
            .transition()
            .delay(function(d, i) { return i * 10; })
            .duration( 1000 )
            .attr("r", function(d) { return r( d.score ); });

        loadGravity( moveCenter );

        //Loads gravity
        function loadGravity( generator ) {
            force
                .gravity(gravity)
                .charge( function(d) { return g( d.score ); })
                .friction(friction)
                .on("tick", function(e) {
                    generator(e.alpha);
                    node
                        .attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; });
                }).start();
        }

        // Generates a gravitational point in the middle
        function moveCenter( alpha ) {
            force.nodes().forEach(function(d) {
                d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
                d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
            });
        }
    }

    function legend() {

        var linearGradient = svg.append("defs")
                .append("linearGradient")
                .attr("id", "legendGradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%")
                .attr("spreadMethod", "pad");

        linearGradient
            .append("stop")
            .attr("offset", "0%")
            .attr("stop-color", '#57a1ff')
            /* .attr("stop-opacity", "0.1"); */

/*
        linearGradient
            .append("stop")
            .attr("offset", "50%")
            .attr("stop-color", '#a96aff')
*/
            /* .attr("stop-opacity", "0.1") */;

        linearGradient
            .append("stop")
            .attr("offset", "100%")
            .attr("stop-color", '#ff4566')
            /* .attr("stop-opacity", "1") */;

        var legend = svg.append("g")
                .attr("id", "legend");

        legend
            .append("rect")
            .attr("x", "20")
            .attr("y", "20")
            .attr("width", "10")
            .attr("height", "200")
            .attr("style", "fill:url(#legendGradient);");

        legend
            .append("text")
            .attr("x", 45)
            .attr("y", 30)
            .text("Best Outcomes");

        legend
            .append("text")
            .attr("x", 45)
            .attr("y", 220)
            .text("Worst");

    }

    function highlight( data, i, element ) {
        d3.select( element ).attr( "stroke", function(d) { return d3.rgb( o( d.time )).brighter(0.5);} );

        var description = data.description.split("|"),
            content = '<span class=\"title\"><a href=\"' + data.url + '\">' + data.title + '</a></span><br/>' +
                       description[0] + "<br/>";

        tooltip.showTooltip(content, d3.event);
    }

    function downlight( data, i, element ) {
        d3.select(element).attr("stroke", function(d) { return d3.rgb( o( d.time )).darker(0.5);  });
        tooltip.hideTooltip();
    }

    //Register category selectors
    $("a.category").on("click", function(e) { update( $(this).attr("value") ); });

    return {
        categories : ["news", "best", "ask", "newest"],
        init : init,
        update : update
    };
})();

risk.init( window.location.href.split("#")[1] ? window.location.href.split("#")[1] : "news");
