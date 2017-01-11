$( document ).ready(function() {
    $("#admin-awsdivout").hide();
    $("#awsdiv").hide();
    $("#resumeselector").show();
    loadResume();    
});
function loadResume(){
 var skills = $(".remove").text(); 
    var count = 0, count1 = 0;
    $("#resumeappendout").html("<table width='100%'><thead><tr><th>Name</th><th>Email</th><th>Resume URL</th><th>Date</th><th>Approve Status</th><th>Action Status</th></tr></thead><tbody id='resumeappend'></tbody><table>");
    $("#load").html('<img src="images/load.gif">');
    var result = skills.split(" "); 
    $.post( "/getmatch", { skills: skills})
    .done(function(resume){
        setTimeout(function(){
            var l = resume.length;
            for (i = 0; i < l; i++) {
                 $("#resumeappend").append('<tr class="nofilter"><td>'+resume[i].fullname+'</td><td>'+resume[i].email+'</td>'+
                '<td><a href="'+resume[i].resume+'" target="_blank"><i class="fa fa-file-pdf-o fa-1x"> Resume</i></a></td>'+
                '<td>'+resume[i].datetime+'</td><td> <img src="images/warn.jpg" width="12" height="12"> No Filter</td>'+
                '<td> <img src="images/warn.jpg" width="12" height="12"> No Filter</td></tr>');
                count1++;
            }
        $("#resultcount").text("TOTAL RESUME IN SYSTEM = "+count1);
        $("#load").html('');
        },2500);
    })
}
 $(document).on("keyup","#city,#state, #staddress, #zip",function() {
    $("#longlatidiv").show().addClass("animated rotateInDownRight");
    $("#map").show().addClass("animated rotateInDownRight");
    var address1 = $('#staddress').val()+", "+$('#city').val()+", "+$('#state').val()+", "+$('#zip').val();
    getLatitudeLongitude(showResult, address1);
});

$(document).on("click",".allresume",function() {
    $("#admin-awsdivout").hide();
    $("#awsdiv").hide();
    $("#resumeselector").show();
});

$(document).on("click",".admin",function() {
    var person = prompt("Please enter admin password", "");
    if (person == "sysy") {
        $("#admin-awsdivout").show();
        $("#resumeselector").hide();
        $("#awsdiv").hide();
    }else{
        alert("WRONG PASSWORD")
    }
});


$(document).on("click",".upload",function() {
    $("#admin-awsdivout").hide();
    $("#awsdiv").show();
    $("#resumeselector").hide();
});



$(document).on("change",".select",function() { 
    var input = $(this).val();
    var skillsdiv = $("#skillsdiv").html();
    skillsdiv = "<span class='remove' id='"+input+"'>"+input+" <img src='images/cross.jpg' width='12' height='12'><span>";
    if(input!="default"){
        $("#skillsdiv").append(skillsdiv); 
    }  
    $("#go").click();
});
$(document).on("click","#go", function(){
    var skills = $(".remove").text(); 
    var count = 0, count1 = 0;
    $("#resumeappendout").html("<table width='100%'><thead><tr><th>Name</th><th>Email</th><th>Resume URL</th><th>Date</th><th>Approve Status</th><th>Action Status</th></tr></thead><tbody id='resumeappend'></tbody><table>");
    
    $("#load").html('<img src="images/load.gif">');
    var result = skills.split(" "); 
    $.post( "/getmatch", { skills: skills})
    .done(function(resume){
        setTimeout(function(){
        var l = resume.length;
        for (i = 0; i < l; i++) {
          var con = resume[i].resumetext.toLowerCase();
          var status = false;
          for (j = 0; j < result.length; j++) {
            var skill = result[j];
            if(con.includes(skill)){
                status = true;
            }else{
                status = false; break;
            }
          }
          if(status==true){
            count++;
            $("#resumeappend").append('<tr class="approved"><td>'+resume[i].fullname+'</td><td>'+resume[i].email+'</td>'+
                '<td><a href="'+resume[i].resume+'" target="_blank"><i class="fa fa-file-pdf-o fa-1x"> Resume</i></a></td>'+
                '<td>'+resume[i].datetime+'</td><td> <img src="images/done.jpg" width="12" height="12"> Resume Approved</td><td>SEND APPROVE <i class="fa fa-envelope-open-o"></td></tr>');
            }else{
                count1++;
                $("#resumeappend").append('<tr class="rejected"><td>'+resume[i].fullname+'</td><td>'+resume[i].email+'</td>'+
                '<td><a href="'+resume[i].resume+'" target="_blank"><i class="fa fa-file-pdf-o fa-1x"> Resume</i></a></td>'+
                '<td>'+resume[i].datetime+'</td><td> <img src="images/cross.jpg" width="12" height="12"> Resume Rejected</td><td>SEND - REJECT <i class="fa fa-envelope-open-o"></td></tr>');
            }
         }
        $("#resultcount").text(count+" RESUME APPROVED | "+count1+" RESUME REJECTED");
        $("#load").html('');
     },100);
    })
})

 
$(document).on("click",".remove",function() { 
    $(this).remove();
    $("#go").click();
});

$(document).on("click","#checkpdf",function() { 
    var name = $("#name").val();
    var email = $("#email").val();
    var file = $("#file").val();
    var ext = file.split('.').pop();
    var count = 0;
    // alert(name+", "+email+", "+ext)
    if(name=="") $("#name-msg").html(" <img src='images/cross.jpg' width='12' height='12'> Invalid Name");
    else { count++; $("#name-msg").html(" <img src='images/done.jpg' width='12' height='12'> DONE");}

    if(!validateForm(email)) $("#email-msg").html(" <img src='images/cross.jpg' width='12' height='12'> Invalid Email");
    else { count++; $("#email-msg").html(" <img src='images/done.jpg' width='12' height='12'> DONE");}
    
    if(ext=="pdf") {count++; $("#file-msg").html(" <img src='images/done.jpg' width='12' height='12'> DONE");}
    else { $("#file-msg").html(" <img src='images/cross.jpg' width='12' height='12'> - Invalid File");}

    if(count==3){
        $("#finalsubmit").click();
    }else{
    }

});

$(document).on("keyup, change","#name,#email, #file",function() { 
   var name = $("#name").val();
    var email = $("#email").val();
    var file = $("#file").val();
    var ext = file.split('.').pop();
    // alert(name+", "+email+", "+ext)
    if(name=="") $("#name-msg").html(" <img src='images/cross.jpg' width='12' height='12'> Invalid Name");
    else $("#name-msg").html(" <img src='images/done.jpg' width='12' height='12'> DONE");

    if(!validateForm(email)) $("#email-msg").html(" <img src='images/cross.jpg' width='12' height='12'> Invalid Email");
    else $("#email-msg").html(" <img src='images/done.jpg' width='12' height='12'> DONE");
    
    if(ext=="pdf") { $("#file-msg").html(" <img src='images/done.jpg' width='12' height='12'> DONE");}
    else { $("#file-msg").html(" <img src='images/cross.jpg' width='12' height='12'> - Invalid File");}
});
function validateForm(email) {
    var x = email;
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        return false;
    }else{ return true;}
}
