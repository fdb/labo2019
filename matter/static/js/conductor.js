const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Events = Matter.Events;

// Utility functions

function rand(min, max) {
  return Math.floor(min + Math.random() * ( max - min));
}

// Connection to the server
const socket = new WebSocket(`ws://${document.location.host}/play`);

socket.onmessage = function(msg) {
  console.log('RECEIVED', msg.data)
};

socket.onopen = function() {
  socket.send('TEST');
};

// Set up Matter
const engine = Engine.create();
const render = Render.create({
  element: document.body,
  engine: engine,
  options: { width: 800, height: 600, wireframes: false }
});

// Set up the Matter World
const boxA = Bodies.rectangle(400, 200, 80, 80, { restitution: 0.8 });
const boxB = Bodies.rectangle(450, 50, 80, 80, { restitution: 0.8 });
const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true, restitution: 0.8 });
World.add(engine.world, [boxA, boxB, ground]);

function sendCollisionEvent(body) {
  body.render.fillStyle = `rgb(${rand(0, 255)}, 255, ${rand(0, 255)})`;
  socket.send('X');
}

// Set up collision events
Events.on(engine, "collisionStart", event => {
  const pairs = event.pairs;
  console.log(pairs);

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    if (pair.bodyA.isStatic && !pair.bodyB.isStatic) {
      sendCollisionEvent(pair.bodyB);
    }
    if (!pair.bodyA.isStatic && pair.bodyB.isStatic) {
      sendCollisionEvent(pair.bodyA);
    }
  }
});

// run the engine
Engine.run(engine);
// run the renderer
Render.run(render);
