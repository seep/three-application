import { EventDispatcher, WebGLRenderer, PerspectiveCamera, Scene, Clock, Vector2 } from 'three';

/**
 * Create a general purpose three.js application that manages a renderer initialization, an update
 * loop, window resizing, and mouse movement.
 *
 * @return {Application}
 * @constructor
 */
export function Application(options) {

  const { requestAnimationFrame, cancelAnimationFrame } = acquireRAF();

  const renderer = new WebGLRenderer({ antialias: true });
  const camera = new PerspectiveCamera(45, 1, 0.1, 1000);
  const scene = new Scene();
  const mouse = new Vector2(0, 0);
  const clock = new Clock(false);

  let rafID = null; // the return value of requestAnimationFrame

  const app = Object.create(EventDispatcher.prototype, {

    renderer: {
      value: renderer,
      writable: false,
    },

    canvas: {
      value: renderer.domElement,
      writable: false,
    },

    width: {
      get: () => renderer.getSize().width,
      set: () => { throw new Error('The "width" property is readonly.') },
    },

    height: {
      get: () => renderer.getSize().height,
      set: () => { throw new Error('The "height" property is readonly.') },
    },

    scene: {
      value: scene,
      writable: false,
    },

    camera: {
      value: camera,
      writable: false,
    },

    mouse: {
      value: mouse,
      writable: false,
    },

    time: {
      get: () => clock.elapsedTime,
      set: () => { throw new Error('The "time" property is readonly.') },
    }

  });

  // Queue the resize/mousemove events and dispatch them once per animation frame.

  let queuedResizeEvent = null;
  let queuedMousemoveEvent = null;

  const onResize = (event) => queuedResizeEvent = event;
  const onMousemove = (event) => queuedMousemoveEvent = event;


  // Make some event flyweights so we aren't allocating objects every frame.

  const updateEventFlyweight = { type: 'update' };
  const resizeEventFlyweight = { type: 'resize' };
  const mousemoveEventFlyweight  = { type: 'mousemove' };

  // Set the default camera as a property of the scene. The camera property on
  // the scene will be used to render the scene, so if the user wants to use a
  // different camera they can just replace this property.

  scene.camera = camera;

  /**
   * Start running the app.
   */
  app.start = function start() {

    if (rafID !== null) return;

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMousemove);

    clock.start();

    handleResize();

    function loop() {

      updateEventFlyweight.dt = clock.getDelta();
      updateEventFlyweight.time = clock.elapsedTime;

      app.dispatchEvent(updateEventFlyweight);
      app.render();

      rafID = requestAnimationFrame(loop);

    }

    rafID = requestAnimationFrame(loop);

    app.dispatchEvent({ type: 'start' });

  };

  /**
   * Stop running the app.
   */
  app.stop = function () {

    if (rafID === null) return;

    clock.stop();

    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', onMousemove);

    cancelAnimationFrame(rafID);

    rafID = null;

    app.dispatchEvent({ type: 'stop' });

  };

  /**
   * Called on each animation frame.
   */
  app.render = function () {

    if (queuedResizeEvent)    handleResize();
    if (queuedMousemoveEvent) handleMousemove();

    if (!scene.camera || !scene.camera.isCamera) {

      console.warn("A custom camera was assigned to `scene.camera` but it isn't a recognizable three.js camera object. Falling back to the default camera.");
      scene.camera = camera;

    }

    renderer.render(scene, scene.camera);

  };

  function handleResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;
    const pratio = window.devicePixelRatio || 1;

    renderer.setPixelRatio(pratio);
    renderer.setSize(width, height, true);

    if (scene.camera === camera) {

      // update the default camera if it hasn't been overwritten
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

    }

    resizeEventFlyweight.width = width;
    resizeEventFlyweight.height = height;

    queuedResizeEvent = null;

    app.dispatchEvent(resizeEventFlyweight);

  }

  function handleMousemove() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    // normalize the mouse coordinate to [-1, 1]
    const normalizedX = 2 * (queuedMousemoveEvent.clientX / width) - 1;
    const normalizedY = 2 * (1 - queuedMousemoveEvent.clientY / height) - 1;

    mouse.set(normalizedX, normalizedY);

    mousemoveEventFlyweight.mouse = mouse;

    queuedMousemoveEvent = null;

    app.dispatchEvent(mousemoveEventFlyweight);

  }

  return app;

}

/**
 * Find the animation frame functions on the window.
 *
 * @returns {{ requestAnimationFrame: Function, cancelAnimationFrame: Function }}
 */
function acquireRAF() {

  const requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame;

  if (requestAnimationFrame === undefined) throw new Error('window.requestAnimationFrame is missing');

  const cancelAnimationFrame = window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelAnimationFrame;

  if (cancelAnimationFrame === undefined) throw new Error('window.cancelAnimationFrame is missing');

  return { requestAnimationFrame, cancelAnimationFrame };

}
