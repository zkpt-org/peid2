var dial_values = [];

function onDocumentReady() {
    var gauges = {}
    for( var i=0; i<5; i++ ){
            gauges["g" + String(i)] = gauge("#gauge-" + String(i), {
    		size: 168,
    		clipWidth: 218,
    		clipHeight: 218,
    		ringWidth: 6,
    		maxValue: 100,
    		transitionMs: 4000,
    	});
    	gauges["g" + String(i)].render();
    	      
    } 	
		
	function updateReadings() {    		
		for( var n=0; n<5; n++ ){ 
    		var value = dial_values.pop();
    		gauges["g" + String(n)].update(value);
    		
    		$('#led-' + String(n)).removeClass('green orange yellow');
    		if(value < 40 )
                $('#led-' + String(n)).addClass('orange');
            else if(value<70)
                $('#led-' + String(n)).addClass('yellow');
            else
                $('#led-' + String(n)).addClass('green');
            var sNumber = value.toFixed(2);
            len = sNumber.length;
            
            if(value<10)
                sNumber = "0" + sNumber;
            sNumber = sNumber.replace(/\./g,'');
            
            for (var i = 0; i < len; i += 1) {
                $("#counter-" + String(n) + " li.count" + String(i+1)).text( function(){return sNumber.charAt(i);});
            }
        }
	}
	
    $.getJSON("../public/data/dials.json", function(json){
        for(var n in json){
            dial_values.push(json[n]);
        }
        dial_values.reverse();
        updateReadings();
    });

}

if( !window.isLoaded )
	window.addEventListener("load", function(){ onDocumentReady(); }, false);
else
	onDocumentReady();