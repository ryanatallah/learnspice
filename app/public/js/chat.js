window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://localhost:8000');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
 
    socket.on('create:message', function (data) {
        if(data.contents) {
            messages.push(data.contents);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += messages[i] + '<br />';
            }
            console.log(data.contents);
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.onclick = function() {
        var text = field.value;
        console.log('message sent: ' + text);
        socket.emit('create:message', { note_id: 1, user_id: 1, contents: text });
    }; 
}
