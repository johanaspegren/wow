// example https://docs.agora.io/en/3.x/video-calling/quickstart-guide/get-started-sdk?platform=web



// Handle errors.
let handleError = function(err){
    console.log("Error: ", err);
};

// Query the container to which the remote stream belong.
let remoteContainer = document.getElementById("remote-container");

// Add video streams to the container.
function addVideoStream(elementId){
    // Creates a new div for every stream
    let streamDiv = document.createElement("div");
    // Assigns the elementId to the div.
    streamDiv.id = elementId;
    // Takes care of the lateral inversion
    streamDiv.style.transform = "rotateY(180deg)";
    // Adds the div to the container.
    remoteContainer.appendChild(streamDiv);
};

// Remove the video stream from the container.
function removeVideoStream(elementId) {
    let remoteDiv = document.getElementById(elementId);
    if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
};


// debug
let _token ="007eJxTYPCYy7foldLbt0/FGDI+7xBzTZKWrzuncmil7D2uU7m2fk0KDKkmxkZmlkYGZuYpqSYGJoZJloYmxhZGBkaplmmWSaYpziq5yQ2BjAx252YxMTJAIIjPxpCYmVqeX87AAAAF6R4D"
let _channel = "aiewow"
let _appId = "e432692067de4041b91438202e9f9b5d"


console.log("write to boxes... _appid = " + _appId)

document.getElementById("app-id").value = _appId
document.getElementById("channel").value = _channel
document.getElementById("token").value = _token


// create client
let client = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8",
});
   
client.init(_appId, function() {
    console.log("client initialized");
}, function(err) {
    console.log("client init failed ", err);
});


// Join a channel
client.join(_token, _channel, null, (uid)=>{
    // Create a local stream
    let localStream = AgoraRTC.createStream({
        audio: false,
        video: true,
    });
    // Initialize the local stream
    localStream.init(()=>{
        // Play the local stream
        localStream.play("me");
        // Publish the local stream
        client.publish(localStream, handleError);
    }, handleError);
  }, handleError);

// Subscribe to the remote stream when it is published
client.on("stream-added", function(evt){
    client.subscribe(evt.stream, handleError);
});
// Play the remote stream when it is subsribed
client.on("stream-subscribed", function(evt){
    let stream = evt.stream;
    let streamId = String(stream.getId());
    addVideoStream(streamId);
    stream.play(streamId);
});

// Remove the corresponding view when a remote user unpublishes.
client.on("stream-removed", function(evt){
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});
// Remove the corresponding view when a remote user leaves the channel.
client.on("peer-leave", function(evt){
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});