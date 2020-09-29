
/* Logics to store data on firebase database */
let auth = firebase.auth();
let data = firebase.database();  //to use data instead of firebase.database()
//console.log(auth, data);

signInWithFacebook = () => {
	console.log("Facebook Pressed")
    let id = data.ref("users").push().key;

	var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {
		var user = result.user;
        localStorage.setItem("name", user.displayName);
        let userFlag = true;
        data.ref("users").once("value", (data) => {
            for (key in data.val()) {
                if (user.displayName === data.val()[key].username) {
                    userFlag = false;
                    console.log(userFlag)
                    console.log(data.val()[key].username)
                }
            }
        })       
        setTimeout(() => {
            console.log(userFlag)
            if(userFlag){
                data.ref("users/" + id).set({
                    id: id,
                    username: user.displayName,
                    email: user.email,
                    password: user.displayName,
                })
            }
            window.location.href = "./chatting.html";
        }, 2000)

    }).catch(function (error) {
        swal({
            text: error.message,
            icon: "warning",
            button: "Okay"
        })
    });
}

signInWithGoogle = () => {
	console.log("Google Pressed")
    let id = data.ref("users").push().key;

	var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {
		var user = result.user;
        localStorage.setItem("name", user.displayName);
        let userFlag = true;
        data.ref("users").once("value", (data) => {
            for (key in data.val()) {
                if (user.displayName === data.val()[key].username) {
                    userFlag = false;
                    console.log(userFlag)
                    console.log(data.val()[key].username)
                }
            }
        })       
        setTimeout(() => {
            console.log(userFlag)
            if(userFlag){
                data.ref("users/" + id).set({
                    id: id,
                    username: user.displayName,
                    email: user.email,
                    password: user.displayName,
                })
            }
            window.location.href = "./chatting.html";
        }, 2000)

    }).catch(function (error) {
        swal({
            text: error.message,
            icon: "warning",
            button: "Okay"
        })
    });
}


//     Sign Up Arrow Function
signUpFunc = () => {
	let username = document.getElementById("signUpUsername").value;
	let email = document.getElementById("SignUpEmail").value;
	let pass = document.getElementById("signUpPassword").value;
	//console.log(username, email, pass);

	/* push users to seperate panel on firebase database */
	let users = data.ref("users").push().key;

	if (username === "" || username === " " || username === undefined) {
		swal({
			text: "Please, Enter Your Username!",
			icon: "warning",
			button: "Ok"
		});
	} else if (email === "" || email === " " || email === undefined) {
		swal({
			text: "Please, Enter Your Email Address!",
			icon: "warning",
			button: "Ok"
		});
	} else if (pass === "" || pass === " " || pass === undefined) {
		swal({
			text: "Please, Enter Your Password!",
			icon: "warning",
			button: "Ok"
		});
	} else {
		//flag used to check condition is fullfil or not
		let flag = true;
		//use firebase database create user auth function
		auth.createUserWithEmailAndPassword(email.toLowerCase(), pass).then(() => {
			swal({
				text: "User Created Successfully!!!",
				icon: "success",
				button: "OK"
			});
		}).catch(err => {
			swal({
				text: err.message,
				icon: "warning",
				button: "OK"
			});
			if (err) {
				flag = false;
			}
		})
		/*
		// clear username, email and password input box
		username.value = "";
		email.value = "";
		pass.value = "";
		console.log(username, email, pass);
		*/
		setTimeout(() => {
			if (flag) {
				data.ref("users/" + users).set({
					id: users,
					username: username,
					email: email.toLowerCase(),
					password: pass
				});
			}
		}, 2000)
	}
}

//     Sign In Arrow Function
logInFunc = (e) => {
	let email = document.getElementById("signInEmail").value;
	let pass = document.getElementById("signInPassword").value;
	//console.log(email, pass);
	//Check if email or password field is empty or not
	if (email === "" || email === " " || email === undefined) {
		swal({
			text: "Please, Enter Your Email Address!",
			icon: "warning",
			button: "OK"
		});
	} else if (pass === "" || pass === " " || pass === undefined) {
		swal({
			text: "Please, Enter Your Password!",
			icon: "warning",
			button: "OK"
		});
	} else {
		auth.signInWithEmailAndPassword(email.toLowerCase(), pass)
		.then((users) => {
			//console.log(users.user.email)  //got email of the sign in user
			data.ref("users").once("value", (userData) => {
				for (user in userData.val()) {
					//console.log(userData.val()[user]);   //get all the information of the user that is login
					if (users.user.email.toLowerCase() === userData.val()[user].email) {
						//console.log(users.user.email)   //got email of the sign in user
						localStorage.setItem("name", userData.val()[user].username);
						//console.log(userData.val()[user])  //get all the information of the user that is login
						//console.log("true");  //successfully come out of the time set function
						//console.log(localStorage.setItem("name"));
					}
				}
				console.log(localStorage.getItem("name"))
			})
			setTimeout(() => {
				window.location.href = "./chatting.html";
			}, 1000)
		}).catch((err) => {
			swal({
				text: err.message,
				icon: "error",
				button: "OK"
			})
		})
	}
}

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
	//console.log(name);
	//console.log(message.value)

	if (message.value) {
		firebase.database().ref("messages").push().set({
			"sender": name,
			"message": message.value,
			"time": time
		});
	}
	message.value = ""
}

//Logout the chat app
logOutFunc = () => {
	// console.log("Log Out")
	firebase.auth().signOut().then(() => {
		localStorage.setItem("name", "");
		window.location.href = "./index.html";
	}).catch((error) => {
		console.log(error.message)
	})
}


//Display message through database
firebase.database().ref("messages").on('child_added', (data) => {
    //console.log(data);
    let li = "";
    let localName = localStorage.getItem("name");
    if (data.val().sender === localName) {
        //console.log("OK");
        //console.log(localName);
        li += `
            <li class="alignRight" id="message-${data.key}">
                <span class="singleMessage" onclick="delMsg(this);" data-id=${data.key}>
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
	
    if (firebase.auth().currentUser) {
        document.getElementById("messages").innerHTML += li;
    }
});

//delete message function
delMsg = (self) => {
	var msgId = self.getAttribute("data-id");
	console.log(msgId);
	swal({
		title: "Delete Message",
		text: "Are you sure!",
		icon: "warning",
		buttons: ["No", "Yes"]
	}).then((res) => {
		if (res) {
			firebase.database().ref("messages").child(msgId).remove();
			swal({
				title: "Success",
				icon: "success",
				button: "Ok"
			})
		}
	});
}

firebase.database().ref("messages").on("child_removed", (data) => {
	document.getElementById("message-" + data.key).innerHTML = "message has been removed";
})