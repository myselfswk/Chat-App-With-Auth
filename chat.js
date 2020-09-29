//  Send messagess........
//function to send message and save message to database


function sendMessage() {

	//console.log("Send")
	let date = new Date();
	let hours = date.getHours();
	let min = date.getMinutes();
	let sec = date.getSeconds();
	let message = document.getElementById("message");
	let time = "";
	if (hours > 12) {
		//scripting, different with coding
		time = `${Math.ceil(hours - 12)}:${min}:${sec} PM`;
		//console.log(time);
	}
	else {
		time = `${hours}:${min}:${sec} AM`;
	}

	let name = localStorage.getItem("name");
	console.log(name);
	console.log(message.value)

	if (message.value) {
		firebase.database().ref("messages").push().set({
			"sender": name,
			"message": message.value,
			"time": time
		});
	}
	message.value = ""
}


//Display message through database
firebase.database().ref("messages").on('child_added', (data) => {
    //console.log(data);
    let li = "";
    let localName = localStorage.getItem("name");
    if (data.val().sender === localName) {
        //console.log("OK");
        li += `
            <li class="alignRight" id="message-${data.key}">
                <span class="singleMessage" onclick="delMessage(this);" data-id=${data.key}>
                    <span class="senderName">${data.val().sender}:</span>
                    <span class="senderMessage">${data.val().message}:</span>
                    <small class="sentTime">${data.val().time}</small>
                </span>
            </li>
        `;
    }
    else {
        li += `
            <li class="alignLeft" id="messgae-${data.key}">
                <span class="singleMessage">
                    <span class="senderName">${data.val().sender}:</span>
                    <span class="senderMessage">${data.val().message}:</span>
                    <small class="sentTime">${data.val().time}</small>
                </span>
            </li>
        `;
    }
    document.getElementById("messages").innerHTML += li;
});
