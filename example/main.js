import { Application } from 'three-application';
import { Vector3, Mesh, BoxBufferGeometry, MeshBasicMaterial } from 'three';

function ExampleApplication() {

  const app = new Application();

  app.camera.position.set(0, 0, -5);
  app.camera.lookAt(0, 0, 0);

  const box = new Mesh(new BoxBufferGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0xff0000 }));

  app.scene.add(box);

  app.addEventListener('update', event => {

    box.rotation.set(Math.sin(app.time), Math.cos(app.time), event.dt);

  });

  return app;

}

const app = ExampleApplication();

document.getElementById('webgl-container').append(app.canvas);

app.start();
