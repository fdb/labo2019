const fs = require('fs');
const path = require('path');
const express = require('express');
const expressWs = require('express-ws');

const wsApp = expressWs(express());
const app = wsApp.app;
const port = process.env.PORT | 3000;

const gClients = [];

app.use('/', express.static(path.join(__dirname, 'static')));

app.ws('/play', function(client, req) {
  gClients.push(client);
  client.on('message', function(msg) {
    for (const client of gClients) {
      client.send(msg);
    }
  });
  client.on('close', function() {
    const clientIndex = gClients.indexOf(client);
    gClients.splice(clientIndex, 1);
  })
});

app.post('/postChat', (req, res) => {
  if (!gChannelId) {
    console.error('Channel is not loaded yet!');
    return;
  }

  const message = req.body.message;
  // FIXME: Do something with the player? Send everybody their own notification?

  const result = web.chat.postMessage({
    text: message,
    channel: gChannelId,
  });
  res.end('OK');
});

app.listen(port, () => {
  console.log(`Open the webpage at http://localhost:${port}.`);
  console.log(`(You can hold the Command key to click this link in the Terminal.)`);
})
