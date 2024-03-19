
$(document).ready(
    () => {
        var start = $("#start_audio").get(0);
        var loop = $("#loop_audio").get(0);
        console.log("loop", loop)
        start.play()
        loop.load()
        start.addEventListener("ended", function() { 
            loop.play(); 
            console.log("ended")
        }, true);
    }
)
