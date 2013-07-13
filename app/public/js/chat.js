window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://localhost:8000');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");

    socket.emit('load:messages', { noteid: 1 });

    socket.on('send:messages', function (data) {
        console.log('blahsasdfsf');
        console.log(data.messages);
        if (data) {
            data.messages.forEach(function(e) {
                messages.push(e.contents);
                var html = '';
                for(var i=0; i<messages.length; i++) {
                    html += '<p>' + messages[i] + '</p>';
                }
                console.log("AHAHAHSAHASHDAS", data.contents);
                content.innerHTML = html;
            });
        } else {
            console.log("Oops. Problem:", data);
        }
    });

    socket.on('create:message', function (data) {
        if(data.contents) {
            messages.push(data.contents);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<p>' + messages[i] + '</p>';
            }
            console.log(data.contents);
            content.innerHTML = html;
            content.scrollTop = content.scrollHeight;
        } else {
            console.log("There is a problem:", data);
        }
    });

    $(document).ready(function() {                                               
        $("#field").keyup(function(e) {                                          
            if(e.keyCode == 13) {                                                
                sendMessage();                                                   
            }                                                                    
        });                                                                      
    });            
 
    sendButton.onclick = sendMessage = function() {
        var text = field.value;
        field.value ="";
        console.log('message sent: ' + text);
        socket.emit('create:message', { note_id: 1, user_id: 1, contents: text });
    }; 

}
