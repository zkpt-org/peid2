/* Shared Javascript functions */
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

function fold(e){
    $(e+' .hide').toggle();
    $(e+' .show-hide-toggle i').toggleClass('icon-caret-right');
}

function dropdown(elem, num){
    $('#filter-'+num+' .filter-label').text($(elem).text());
}

function reset_dropdown(num, defaults){
    $('#filter-'+num+' .filter-label').text(defaults[num]);
}