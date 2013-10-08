var payment;
var duration;
var steps;
var kudos;
var score;
var defaults1;
var defaults2;

function GetDefaults(f){
    defaults1 = [50,7,5000,50];
    defaults2 = [0,2,0,8];
}

function SetDefaults(pay, dur, stp, kud){
    payment.value(pay);
    duration.value(dur);
    steps.value(stp);
    kudos.value(kud);
}

function SetDefaults2(checked){
    $('input:checkbox').attr('checked',false);
    $('input:checkbox').prop("checked", false);
    for(var c in checked){
        $("#check-"+checked[c]).attr('checked',true);
        $("#check-"+checked[c]).prop('checked',true);
    }
}

function ResetDefaults(){
    SetDefaults.apply(this, defaults1);
    SetDefaults2(defaults2);
    CalculateScore(1);
    CalculateScore(2);
}

function CalculateScore(f){
    switch(f){
        case 1:
            score = CalculateF1();
            break;
        case 2:
            score = CalculateF2();
            break;
    }
    DisplayScore(f);
}

function CalculateF1(){
    return Math.round( ((payment.value()*10 + kudos.value()*2) / (steps.value() +  duration.value()*100)) *100);
}

function CalculateF2(){
    var rates = [6, 5, 7, 5, 10, 5, 5, 5, 1, 2, 1];
    var checked = $(':checkbox:checked').map(function() {return this.id;}).get();
    score = 0;            
    for(var c in checked){
        if(checked[c].replace("check-","")<8)
            score += rates[checked[c].replace("check-","")];
        else
            score = score * rates[checked[c].replace("check-","")];
    }
    return score;
}


function DisplayScore(f){
    var size;
    var max = 120;
    var min = 15;
    
    if(score <= max/3 && score >= min/3)
        size = score *3;
    else if(score > 30)
        size = max;
    else
        size = min;
        
    font = size/2;
    
    $("#result-"+f).css("width", size+"px"); 
    $("#result-"+f).css("height", size+"px");
    $("#result-"+f+" #lift").text(score);
    $("#result-"+f+" #lift").css("font-size", font);
}

$(document).ready(function() {
    $("#currency").kendoNumericTextBox({
        format: "c",
        decimals: 3,
        spin: onSpin
    });

    $("#days").kendoNumericTextBox({
        format: "# days",
        spin: onSpin
    });

    $("#steps").kendoNumericTextBox({
        format: "#, steps",
        spin: onSpin
    });
    
    $("#kudos").kendoNumericTextBox({
        format: "#, points",
        spin: onSpin
    });
    
    function onSpin() {
        CalculateScore(1);
    }
    
    payment  = $("#currency").data("kendoNumericTextBox");
    duration = $("#days").data("kendoNumericTextBox");
    steps    = $("#steps").data("kendoNumericTextBox");
    kudos    = $("#kudos").data("kendoNumericTextBox");        
    
    GetDefaults();
    ResetDefaults();
});