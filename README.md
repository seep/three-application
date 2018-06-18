# three-application

A general purpose three.js application that manages a renderer initialization, an update loop, window resizing, and mouse movement.

## Example

```javascript
const app = new Application();

app.camera.position.set(0, 0, -5);
app.camera.lookAt(0, 0, 0);

const mesh = new ExampleMesh();
app.scene.add(mesh);

app.addEventListener('update', event => {
  
  // app.time is seconds since app was last started
  mesh.rotation.set(Math.sin(app.time), Math.cos(app.time), 0);

});

app.addEventListener('mousemove', event => {
  
  const scale = app.mouse.x + 1; // app.mouse is normalized to [-1, +1] 
  mesh.scale.set(scale, scale, scale);
  
});

app.start(); // start a render loop with requestAnimationFrame

```

## Properties

#### app.renderer

The [WebGLRenderer](https://threejs.org/docs/#api/renderers/WebGLRenderer) used to render the scene. Antialiasing is
turned on by default.

#### app.camera

The camera used to render the scene. The default camera is a [PerspectiveCamera](https://threejs.org/docs/#api/cameras/PerspectiveCamera)
with a 45 FOV.

#### app.clock

The internal [Clock](https://threejs.org/docs/#api/core/Clock) of the application.  It is started and stopped when the
application is started or stopped.

#### app.scene

The main scene of the application.

#### app.mouse

A [Vector2](https://threejs.org/docs/#api/math/Vector2) with the normalized device coordinates of the mouse in the
canvas.

#### app.screen

A [Vector2](https://threejs.org/docs/#api/math/Vector2) with the pixel dimensions of the canvas.

#### app.width

The width of the canvas.

#### app.height

The height of the canvas.

#### app.time

An accessor for `app.clock.elapsedTime`.

#### app.uniforms

An object with shader uniforms for the application's canvas size, mouse position, time, and delta time. See [#uniforms]() for more information.
