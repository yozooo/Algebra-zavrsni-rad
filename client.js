const socket = io('http://localhost:8000');

// Podaci za povezivanje na Scaledrone

// chanelId = 2bKx6H9wAciZyvOG 
// key = eh9pg4jEk9ErauE9vn2Nc4HRkgAtjmSm 

const res = ('POST https://api2.scaledrone.com/[2bKx6H9wAciZyvOG ]/[my-chat-app]/publish')
const b = ("hello: from REST")

const drone = new Scaledrone('2bKx6H9wAciZyvOG');
drone.on('error', error => console.error(error));

drone.on('open', error => {
    if (error) {
      return console.error(error);
    }
    drone.publish({
      room: 'my-chat-app',
      message: {message: 'Connected to scaledrone!'}
    });
  });
  
  const room = drone.subscribe('my-chat-app');
  room.on('open', error => {
    if (error) {
      console.error(error);
    } else {
      console.log('Connected to room');
    }
  });
  room.on('message', message => console.log('Received message:', message));
  
  drone.on('error', error => console.error(error));


const body = document.querySelector('.container');
const chatBox = document.getElementById('chatContainer');
const onUsers = document.getElementById('onUsers');
const messageContainer = document.getElementById('chatting')
const form = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');

const name = prompt('Enter your name to Join');

if (name === null || name.length <= 3) {
    const h1Element = document.createElement('h1');
    h1Element.classList.add('noAccess');
    h1Element.innerText = 'Sorry, you are not allowed to access the chat';
    chatBox.remove();
    body.append(h1Element);
    alert('Access Denied');
} else {
    alert('Access Granted');
    socket.emit('new-user-joined', name)
}


socket.on('userIncrement', data => {
    onUsers.innerText = data
})

const appendAction = (message, position) => {
    const messageElement = document.createElement('div');
    const pElement = document.createElement('p');
    pElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageElement.append(pElement);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

const appendMessage = (message, user, position, id) => {
    const messageElement = document.createElement('div');
    const span = document.createElement('span');
    const i = document.createElement('i');
    const p = document.createElement('p');
    i.classList.add('fa-solid');
    i.classList.add('fa-heart');
    p.innerText = message;
    span.innerText = user;
    messageElement.append(span)
    messageElement.append(i)
    messageElement.append(p);
    messageElement.classList.add(position)
    messageElement.classList.add('message')
    messageElement.setAttribute('id', id)
    messageElement.setAttribute('ondblclick', "likedMessage(this.id)");
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

socket.on('user-joined', data => {
    appendAction(`${data.name} Joined the Chat`, 'center')
    onUsers.innerText = data.onUsers
})

socket.on('receive',data => {
    appendMessage(data.message,data.name,'left',data.id)
})

const likedMessage = (id) => {
    const likedElement = document.getElementById(id);
    likedElement.classList.add('liked');
    socket.emit('liked',id)
}

socket.on('msg-like',id =>{
    const likedElement = document.getElementById(id);
    likedElement.classList.add('liked');
})

socket.on('disconnected',data =>{
    appendAction(`${data.name} left the Chat`,'center')
    onUsers.innerHTML = data.onUsers
})



form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message === "") {
        return
    }
    const id = Math.round(Math.random() * 100000);
    appendMessage(message, 'You', 'right', id);
    socket.emit('send', { message, id })
    messageInput.value = "";
});

