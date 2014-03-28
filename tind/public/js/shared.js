/* Shared Javascript functions */
var shadowbox = false;
var counter   = 0;
var time_window_start, time_window_end, time_window_start_minus_year, time_window_end_minus_year, months_diff;
var firstdate, lastdate;
//var today    = Date.today().clearTime();
//var year_ago = Date.today().clearTime().addMonths(-12);
//var start_of_month = Date.today().clearTime().moveToFirstDayOfMonth();

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth()+1;
    return months <= 0 ? 0 : months;
}

if( !window.isLoaded )
	window.addEventListener("load", function(){ onready(); }, false);
else
	onready();
	
function onready() {

    $(function () {$("[data-toggle='tooltip']").tooltip(
       { delay: { show: 1000, hide: 0 } }
    );});

    $(function () {
        $('body').popover({
            selector: '[data-toggle="popover"]'
        });

        /*
        $('body').tooltip({
            delay: { show: 5000, hide: 0 },
            selector: 'a[rel="tooltip"], [data-toggle="tooltip"]'
        });
        */
    });
    
    $('.nav.nav-tabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    
    $('ul.nav.nav-pills li a').click(function() {			
        $(this).parent().addClass('active').siblings().removeClass('active');			
    });
}

function check_session(response){
    if(typeof response === 'string')
        return response;
    else if("session" in response && response["session"]=="expired")
        end_of_session();
}

function end_of_session(){document.location = "/login/"}
    
function fold(e){
    $(e+' .hide').toggle();
    $(e+' .show-hide-toggle i').toggleClass('fa-caret-right');
}

function dropdown(elem, num){
    $('#filter-'+num+' .filter-label').text($(elem).text());
}

function reset_dropdown(num, defaults){
    $('#filter-'+num+' .filter-label').text(defaults[num]);
}

function details(elem){
    $("#container").animate( {width:1200}, 750);
    $(".box").animate( {width:300, height:300}, 750, function(){
        $(".box")
            .animate({
                borderTopLeftRadius: '50%', 
                borderTopRightRadius: '50%', 
                borderBottomLeftRadius: '50%', 
                borderBottomRightRadius: '50%'}, 300);
    });
    
    $(".box svg").animate( {width:300, height:300}, 750, function(){
        $(".box svg")
            .animate({
                borderTopLeftRadius: '50%', 
                borderTopRightRadius: '50%', 
                borderBottomLeftRadius: '50%', 
                borderBottomRightRadius: '50%'}, 300, function(){
                    if(!shadowbox){
                        var ypos = $(elem).position().top
                        $('body').append("<div id=shadow-box></div><div id=disable>");
                        $("#disable").css("display", "block");
                        $("#container").append('<div id=details><button type=button class=close onclick="details_reset()">×</button><div id=deep-dive></div></div>');
                        $("#details").append("<div class=pointer-box-left><div class=pointer></div></div>");
                        $("#details").css("top", (ypos-30)+"px");
                        $("#details").css("width", "820px");
                        $(".pointer-box-left").css("top", 130+"px");
                        $(".pointer").css("position", "relative");
                        shadowbox = true;
                        $("#deep-dive").load( "/dive" );
                    }
                });    
    });
    $(elem).css("position", "relative");
    $(elem).css("z-index", "10");
}

function details_reset(){
    $("#shadow-box").animate({opacity:0}, 750);
    $("#disable").css("display", "none");
    $("#disable").remove();
    $("#deep-dive").remove();
    shadowbox = false;
    
    $("#details").animate({width:0}, 750, function(){
        $(".pointer-box-left").remove();
        $("#details").remove();
        $("#details button.close").remove();
        $("#shadow-box").remove();
        
        $(".box").animate({
                borderTopLeftRadius: '5px', 
                borderTopRightRadius: '5px', 
                borderBottomLeftRadius: '5px', 
                borderBottomRightRadius: '5px'}, 300, function(){$(".box").animate( {width:760, height:400}, 750);});
        
        $(".box svg")
            .animate({
                borderTopLeftRadius: '5px', 
                borderTopRightRadius: '5px', 
                borderBottomLeftRadius: '5px', 
                borderBottomRightRadius: '5px'}, 300, function(){
                    
                    $("#container").animate({width:760},750);
                    $(".box svg").animate( {width:760, height:400}, 750,
                        function(){
                            //redraw();
                            $(".box").css("position", "static");
                            $(".box").css("z-index", "0");
                            $(".box svg").css("position", "static");
                            $(".box svg").css("z-index", "0");
                            
                            //location.reload();

                        }
                    );     
                });
        
    });
    
}

function first_date(){
    response = $.ajax({type: "GET", url: "/data/firstdate/", async: false}).responseText;
    console.log(response)
    check_session(response);
    firstdate = Date.parse(response);
    return firstdate
}

function last_date(){
    response = $.ajax({type: "GET", url: "/data/lastdate/", async: false}).responseText;
    console.log(response)
    check_session(response)
    lastdate = Date.parse(response)
    return lastdate
}

function startload(num){
    window['timer' + num] = setInterval(function(){loading(num);},80);
}

function loading(num){
    $('#loader-'+num).fadeIn(100);
    $('#loader-'+num).text(counter);
    counter++;
    if(counter == 7)
        counter = 0;
}

function endload(num, timer){
   $('#loader-'+num).fadeOut(1000);
   // $('#loader-'+num).css("display","none");
   clearInterval(eval("timer"+num));
}

