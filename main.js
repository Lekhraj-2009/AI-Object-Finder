objectAlarm = "";
objectName = "";

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
    objectName = document.getElementById("object_name").value;
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

function draw(){
    image(video, 0, 0, 400, 400);
}