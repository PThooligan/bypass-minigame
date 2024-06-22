var started = false, minitimeleft = 5, minitimer = null, bigtimer = null, timeleft = 10, connects = 3, dificulty = 0

$(document).ready(function() {
    $('#rulesarea').on('click', '.bypassbtns', function(event) {
        if ($(this).attr("id") == "startbtn" && $(this).css("opacity") == 1) {
        	$(this).css("display", "none")
        	$(".circle").removeClass("disabled")
        	$("#timer").css("display", "flex").hide().fadeIn(1000)
        	$(".lockbypass").css("display", "flex").hide().fadeIn(1000)
	        $(".circle").css("display", "flex").hide().fadeIn(1000)
        	started = true
        	bigtimer = setInterval(function() {
        		if (!started) {
        			clearInterval(bigtimer)
        		}
        		$("#"+timeleft+".tick").css("opacity", 0)
        		var calc = Number(timeleft * 100) / Number(dificulty*2)
        		if (calc <= 25) {
        			$(".tick").css("border", "#DA0000")
	        		$(".tick").css("box-shadow", "inset 0px 0px 7px #DA0000, inset 0px 0px 7px #DA0000")
	        		$(".tick").css("background-color", "B30000")
	        	} else if (calc <= 50) {
	        		$(".tick").css("border", "#DA8300")
	        		$(".tick").css("box-shadow", "inset 0px 0px 7px #DA8300, inset 0px 0px 7px #DA8300")
	        		$(".tick").css("background-color", "B36C00")
	        	}
				if(timeleft <= 0) {
					started = false
					clearInterval(bigtimer)
					$("#msg").html("SYSTEM BYPASS FAILED")
		    		$("#msg").css("background-color", "rgba(220, 0, 37, .5)")
					$("#msg").css("display", "flex").hide().fadeIn(100)
					setTimeout(function() {
				        closebypass(2)
				    }, 1500)
					return
				}
				timeleft -= 1
			}, 900)
        } else if ($(this).attr("id") == "exitbtn") {
        	if (started) {
        		started = false
	        	clearInterval(bigtimer)
				$("#msg").html("SYSTEM BYPASS FAILED")
	    		$("#msg").css("background-color", "rgba(220, 0, 37, .5)")
				$("#msg").css("display", "flex").hide().fadeIn(100)
				setTimeout(function() {
			        closebypass(2)
			    }, 1500)
			} else {
				closebypass(3)
			}
        }
    })
    $('#gamearea').on('click', '.circle', function(event) {
    	if (started && !$(this).hasClass('done') && !$(this).hasClass('selected')) {
	    	if ($(".circle.selected").length) {
	    		if ($(".circle.selected").attr('data-value') == $(this).attr('data-value')) {
	    			var ele = ((dificulty/2) - connects) + 1
	    			$("#"+ele+".part1").animate({"left":"30%"}, 300)
	    			$("#"+ele+".part1").css("filter", "hue-rotate(75deg) drop-shadow(0px 0px 2px white)")
	    			$("#"+ele+".part2").css("filter", "hue-rotate(75deg) drop-shadow(0px 0px 2px white)")
			    	$(".circle.selected").addClass("done")
			    	$(".circle.selected").removeClass("selected")
			    	$(this).addClass("done")
			    	$(this).html(symbols[$(this).attr('data-value')])
			    	connects -= 1
			    	if (connects == 0) {
			    		started = false
			    		clearInterval(bigtimer)
			    		$("#msg").html("SYSTEM BYPASS SUCCESSFUL")
			    		$("#msg").css("background-color", "rgba(0, 220, 37, .5)")
    					$("#msg").css("display", "flex").hide().fadeIn(100)
			    		setTimeout(function() {
					        $("#msg").fadeOut()
					        closebypass(1)
					    }, 1500)
			    	}
			    	return
			    } else {
			    	started = false
			    	clearInterval(bigtimer)
					$("#msg").html("SYSTEM BYPASS FAILED")
		    		$("#msg").css("background-color", "rgba(220, 0, 37, .5)")
					$("#msg").css("display", "flex").hide().fadeIn(100)
					setTimeout(function() {
				        closebypass(2)
				    }, 1500)
			    	return
			    }
		    }
	        $(this).addClass("selected")
	        clearInterval(minitimer)
	        minitimeleft = 5
	        minitimer = setInterval(function() {
				if(minitimeleft <= 0) {
					clearInterval(minitimer)
					$(".circle.selected").html("")
					$(".circle.selected").removeClass("selected")
					return
				}
				minitimeleft -= 1
			}, 600)
	    } else if ($(this).hasClass('selected')) {
	    	minitimeleft = 5
	    }
    })
    $('#gamearea').on('mouseover', '.circle', function(event) {
    	if (started) {
	    	if (!$(".circle.selected").length) {
	        	$(this).html(symbols[$(this).attr('data-value')])
	    	}
	    }
    })
    $('#gamearea').on('mouseleave', '.circle', function(event) {
    	if (started) {
	        if (!$(this).hasClass("selected") && !$(this).hasClass('done')){
	        	$(this).html("")
	        }
	    }
    })
});

window.addEventListener('message', function(event) {
	if(event.data.action == "startbypass") {
		$("#gamearea").html("")
		$("#infoarea").html("")
		dificulty = event.data.dif
		if (!(j%2)) {
			dificulty = dificulty +1
		}
		if (dificulty > 10) {dificulty = 10} else if (dificulty < 2) {dificulty = 2}
		var newDiv = document.createElement('div')
		newDiv.id  = "timer"
		$("#infoarea").append(newDiv)
		var suckme = 1
		for(var j = 0; j < dificulty; ++j) {
			var newDiv 		 = document.createElement('div')
			newDiv.className = 'circle disabled'
			newDiv.style.top = templates[j].top
			newDiv.style.left = templates[j].left
			$("#gamearea").append(newDiv)
			if (j%2) {
				var newDiv 		  = document.createElement('div')
				newDiv.id         = suckme
				newDiv.className  = 'lockbypass'
				$("#infoarea").append(newDiv)

				var newDiv 		 = document.createElement('div')
				newDiv.id        = suckme
				newDiv.className = 'part1'
				$("#"+suckme+".lockbypass").append(newDiv)

				var newDiv 		 = document.createElement('div')
				newDiv.id        = suckme
				newDiv.className = 'part2'
				$("#"+suckme+".lockbypass").append(newDiv)

				suckme += 1
			}
		}
		var count = $("#gamearea").children().length / 2, given = []
		connects = count
		$('.circle').each(function() {
			var give = Math.floor(Math.random() * count) + 1, counts = {}, notfound = true
			jQuery.each(given, function(key,value) {
				if (!counts.hasOwnProperty(value)) {
					counts[value] = 1
				} else {
					counts[value]++
				}
			})
			while (notfound) {
				if (counts[give] == 2) {
					give = Math.floor(Math.random() * count) + 1
				} else {
					notfound = false
				}
			}
			$(this).attr('data-value', give)
			given.push(give)
		})
		$(".circle").css("display", "none")
		timeleft = dificulty * 2
		for(var j = 0; j < timeleft; ++j) {
			var newDiv 		 = document.createElement('div')
			newDiv.id        = j
			newDiv.className = 'tick'
			$("#timer").append(newDiv)
		}
		$("#exitbtn").css("opacity", 0)
		$("#startbtn").css("display", "none")
		$("#timer").css("display", "none")
		$(".lockbypass").css("display", "none")
		$("#msg").html("UNAUTHORIZED ACCESS DETECTED")
		$("#msg").css("background-color", "rgba(220, 0, 37, .5)")
		$("#bypassarea").css("display", "flex").hide().fadeIn()
		$("#msg").css("display", "flex").hide().fadeIn(500)
		setTimeout(function() {
	        $("#msg").fadeOut()
	        $("#startbtn").css("display", "block")
	        $("#exitbtn").css("opacity", 1)
	    }, 2500)
	}
})

function closebypass(data) {
	started = false
	clearInterval(bigtimer)
	if ($("#msg").css("display") == "flex") {
		$("#msg").fadeOut()
	}
	$.post('https://minigames/closebypass', JSON.stringify(data))
	$("#bypassarea").fadeOut()
}

var symbols = [
	'<i class="fas fa-database" style="pointer-events:none"></i>',
	'<i class="fas fa-microchip" style="pointer-events:none"></i>',
	'<i class="fas fa-code-branch" style="pointer-events:none"></i>',
	'<i class="fas fa-memory" style="pointer-events:none"></i>',
	'<i class="fas fa-broadcast-tower" style="pointer-events:none"></i>',
	'<i class="fas fa-project-diagram" style="pointer-events:none"></i>',
	'<i class="fas fa-ethernet" style="pointer-events:none"></i>',
	'<i class="fas fa-server" style="pointer-events:none"></i>',
	'<i class="fas fa-hdd" style="pointer-events:none"></i>',
	'<i class="fas fa-bug" style="pointer-events:none"></i>'
]
var templates = [
	{
		top: "24px",
		left: "376px"
	},
	{
		top: "380px",
		left: "340px"
	},
	{
		top: "250px",
		left: "408px"
	},
	{
		top: "350px",
		left: "70px"
	},
	{
		top: "60px",
		left: "100px"
	},
	{
		top: "220px",
		left: "200px"
	},
	{
		top: "100px",
    	left: "276px"
	},
	{
		top: "200px",
    	left: "70px"
	},
	{
		top: "350px",
    	left: "200px"
	},
	{
		top: "150px",
    	left: "320px"
	}
]


	