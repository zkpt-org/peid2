function onDocumentReady() {
    
    d3.tsv("../public/data/defscore_percent.tsv", function(error, data) {
          
          var stayers = Number(data[data.length-1].Stayers);
          var leavers = Number(data[data.length-1].Leavers);
          var fencers = Number(data[data.length-1].OnTheFence);
          
          var diff_stayers = stayers - Number(data[data.length-20].Stayers);
          var diff_leavers = leavers - Number(data[data.length-20].Leavers);
          var diff_fencers = fencers - Number(data[data.length-20].OnTheFence);          
          
          $(".hide svg").animate({
              opacity:1.0
          },2000 );
          
          //risk.init( window.location.href.split("#")[1] ? window.location.href.split("#")[1] : "news");          
          
          $("#traffic-1").animate({
              opacity: 1.0,
              width:50+leavers,
              height:50+leavers,
              easing: 'easeOutBounce'
              }, 800, function(){
                  $("#traffic-1 h4").text(leavers.toFixed(1)+"%");
                  $("#diff_leavers").text(function(){return diff_leavers>0 ? "+"+diff_leavers.toFixed(1)+"%":diff_leavers.toFixed(1)+"%";});
                  $("#snapshot article").fadeIn(1600);
                  $("#traffic-2").animate({
                      opacity: 1.0,
                      easing: 'easeOutBounce',
                      width:50+fencers,
                      height:50+fencers
                      }, 800, function(){
                            $("#traffic-2 h4").text(fencers.toFixed(1)+"%");
                            $("#diff_fencers").text(function(){return diff_fencers>0 ? "+"+diff_fencers.toFixed(1)+"%":diff_fencers.toFixed(1)+"%";});
                            
                            $("#traffic-3").animate({
                                opacity: 1.0,
                                easing: 'easeOutBounce',
                                width:50+stayers,
                                height:50+stayers
                                }, 800, function(){
                                    $("#traffic-3 h4").text(stayers.toFixed(1)+"%");
                                    $("#diff_stayers").text(function(){return diff_stayers>0 ? "+"+diff_stayers.toFixed(1)+"%" : diff_stayers.toFixed(1)+"%"});
                                }
                            )}
                  )}
          );
    });
}

if ( !window.isLoaded ) {
	window.addEventListener("load", function() {
		onDocumentReady();
	}, false);
}else{ onDocumentReady(); }