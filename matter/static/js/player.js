function rand(min, max) {
  return Math.floor(min + Math.random() * ( max - min));
}

function onReceiveEvent(msg) {
    console.log('RECEIVE', msg.data);
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.style.left = `${rand(0, 800)}px`;
    dot.style.top = `${rand(0, 600)}px`;
    dot.style.backgroundColor = `rgb(${rand(0, 255)}, 255, ${rand(0, 255)})`;
    document.querySelector('.field').appendChild(dot);
}

// Connection to the server
const socket = new WebSocket(`ws://${document.location.host}/play`);
socket.onmessage = onReceiveEvent;
