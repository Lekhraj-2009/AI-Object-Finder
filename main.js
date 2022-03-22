objectAlarm = "";
objectName = "";

status = "";
objects = [];

function preload(){
    objectAlarm = loadSound("ObjectAlarm.wav");
}

function setup(){
    canvas = createCanvas(400, 400);

    video = createCapture(VIDEO);
    video.size(400, 400);
    video.hide();
}

function confirm_object(){
    objectName = document.getElementById("object_name").value.toLowerCase();
    if (objectName == ""){
        alert("Please Enter an Object first!");
    } else {
        console.log("Find Object: "+objectName);

        var synth = window.speechSynthesis;
        speak_data = "Received Object, Please click the START Button below.";
        var utterThis = new SpeechSynthesisUtterance(speak_data);
        synth.speak(utterThis);
    }
}

function start(){
    if (objectName == ""){
        alert("Please Enter an Object first!");
    } else {
        objectAlarm.play();
        
        window.setTimeout(function(){
            objectAlarm.stop();

            status = true;

            var synth = window.speechSynthesis;
            speak_data = "Object Detection Started.";
            var utterThis = new SpeechSynthesisUtterance(speak_data);
            synth.speak(utterThis);

            console.log("Object Detection Started");

            objectDetector = ml5.objectDetector('cocossd', modelLoaded);
            document.getElementById("status").innerHTML = "Detecting Objects";
        }, 2500);
    }
}

function modelLoaded(){
    console.log("CocoSSD Model Loaded Successfully!");
}

function gotResult(error, results){
    if (error){
        console.error(error);
    }
    console.log(results);
    objects = results;
}

function draw(){
    image(video, 0, 0, 400, 400);

    if (status != ""){
        objectDetector.detect(video, gotResult);

        for (i=0; i<objects.length; i++){
            document.getElementById("status").innerHTML = "Objects Detected";

            fill("#FF0000");
            percent = floor(objects[i].confidence*100);
            text(objects[i].label+" "+percent+"%", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke("#FF0000");
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

            if (objects[i].label == objectName){
                window.setTimeout(function(){
                    document.getElementById("result").innerHTML = "'"+objectName.toUpperCase()+"' Found";

                    var synth = window.speechSynthesis;
                    speak_data = objectName+" Found!";
                    var utterThis = new SpeechSynthesisUtterance(speak_data);
                    synth.speak(utterThis);

                    console.log(objectName+" Found!");

                    video.stop();
                    objectDetector.detect(gotResult);
                }, 2500);
            } else {
                window.setTimeout(function(){
                    objectAlarm.stop();

                    document.getElementById("result").innerHTML = "'"+objectName.toUpperCase()+"' Not Found";

                    console.log(objectName+" Not Found!");

                    video.stop();
                    objectDetector.detect(gotResult);
                }, 2500);
            }
        }
    }
}