function WebGLUnion($container, width, height) {
  var I = this;
  I.$container = $container;
  I.resize(width, height);

  I.sphereRadius = 18; //球体半径
  I.init();
}
WebGLUnion.prototype.init = function () {
  var I = this;
  I.renderer = new THREE.WebGLRenderer({ antialias: true }); //抗据齿
  I.renderer.setSize(I.width, I.height);
  I.renderer.setClearColor('#000000', 1.0);

  // 渲染器放入容器
  I.$container.append(I.renderer.domElement);

  I.renderer.domElement.addEventListener("mousemove", function(e) {
    I.mouseMove(e);
  }, false);

  I.scene = new THREE.Scene();
  // 透视
  I.camera = new THREE.PerspectiveCamera(
    30, //视角(度)
    I.width / I.height, //纵横比,即平面长高比
    1, //物体近平面离摄像头的距离
    150000 //物体远平面离摄像头的距离
  );
  // 摄像头位置
  I.camera.position.x = 0;
  I.camera.position.y = -30;
  I.camera.position.z = 100;
  // 摄像头上方向
  I.camera.up.x = 0;
  I.camera.up.y = 1;
  I.camera.up.z = 0;
  // 摄像头观察点
  I.camera.lookAt({ x: 0, y: 0, z: 0 });
  I.scene.add(I.camera);

  // 直射光
  I.light = new THREE.DirectionalLight('#ffffff', 1);
  I.light.position.set(50, 50, 50);
  I.scene.add(I.light);

  //聚光灯光源
  I.spotLight = new THREE.SpotLight('#ffffff', 6.5, 0, 270 / 180 * Math.PI); //ffffff
  I.spotLight.position.set( 50, 50, -40 );
  I.scene.add(I.spotLight);

  I.addSphere(); // 球
  I.addMovingPoints(); // 球外转动的点
  I.addBackPoints(); // 添加背景星际

  I.animate();
}
WebGLUnion.prototype.addSphere = function () { // 添加球
  var I = this;
  I.turnGroup = new THREE.Object3D();
  I.turnGroup.position.set(0, 0, 0);
  I.scene.add(I.turnGroup);

  var widthSegments = 28;
  var heightSegments = 14;

  var geometry = new THREE.SphereGeometry(
    I.sphereRadius, //球体半径
    widthSegments, // 球体横截面上的面个数，最小3，默认8
    heightSegments, // 球体纵截面上的上半部份面个数，最小2，默认6
  );

  var material = new THREE.PointsMaterial({
    color: '#ffffff',
    size: 3,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,/*该属性决定了这个对象是否影响WebGL的深度缓存，将其设置为false，则各个粒子系统之间互不干涉*/
    map: I.createTexture()
  });
  material.alphaTest = 0.9;

  var points = new THREE.Points(geometry, material);
  points.sortParticles = true;
  I.turnGroup.add(points);

  // 球的表面
  var geometry2 = new THREE.SphereGeometry(
    I.sphereRadius, //球体半径
    widthSegments, // 球体横截面上的面个数，最小3，默认8
    heightSegments, // 球体纵截面上的上半部份面个数，最小2，默认6
  );
  var material2 = new THREE.MeshLambertMaterial({ color: '#004C3F' });//材质
  material2.transparent = true;
  material2.opacity = 0.4;
  var meshSphere2 = new THREE.Mesh(geometry2, material2);
  I.turnGroup.add(meshSphere2);

  // 球的粒子连线
  var geometry3 = new THREE.SphereGeometry(
    I.sphereRadius, //球体半径
    widthSegments, // 球体横截面上的面个数，最小3，默认8
    heightSegments, // 球体纵截面上的上半部份面个数，最小2，默认6
  );
  var material3 = new THREE.MeshLambertMaterial({ color: '#004C3F' });//材质
  material3.wireframe = true;
  material3.transparent = true;
  material3.opacity = 0.3;
  var meshSphere3 = new THREE.Mesh(geometry3, material3);
  I.turnGroup.add(meshSphere3);
}
WebGLUnion.prototype.render = function () {
  var I = this;
  I.renderer.render(I.scene, I.camera);
}
WebGLUnion.prototype.toRadian = function (deg) { //角度转弧度
  var I = this;
  return deg * Math.PI / 180;
}
WebGLUnion.prototype.animate = function () {
  var I = this;
  function run() {
    I.turnGroup.rotation.y += 0.006;
    I.backPointGroup.rotation.y += 0.0003;
    I.MeshPoint1.position.y = 20 * Math.cos(I.turnGroup.rotation.y);
    I.MeshPoint2.position.y = -20 * Math.sin(I.turnGroup.rotation.y);
    I.MeshPoint3.position.y = 20 * Math.sin(I.turnGroup.rotation.y);
    I.MeshPoint4.position.y = -20 * Math.cos(I.turnGroup.rotation.y);

    I.MeshPoint5.position.y = 20 * Math.cos(I.turnGroup.rotation.y);
    I.MeshPoint6.position.y = -20 * Math.sin(I.turnGroup.rotation.y);
    I.MeshPoint7.position.y = 20 * Math.cos(I.turnGroup.rotation.y);
    I.MeshPoint8.position.y = -20 * Math.sin(I.turnGroup.rotation.y);

    I.MeshPoint9.position.y = 20 * Math.sin(I.turnGroup.rotation.y);
    I.MeshPoint10.position.y = -20 * Math.cos(I.turnGroup.rotation.y);
    I.MeshPoint11.position.y = 20 * Math.sin(I.turnGroup.rotation.y);
    I.MeshPoint12.position.y = -20 * Math.cos(I.turnGroup.rotation.y);
    I.MeshPoint13.position.y = -20 * Math.sin(I.turnGroup.rotation.y);

    I.addLines(); // 球外转动的点连线
    I.addLuminousPoints(); // 球上的点
    I.addLuminousLines(); // 球上点与外面的点连线

    I.render();
    requestAnimationFrame(run);
  }
  run();
}
WebGLUnion.prototype.createTexture = function () { //球体点的纹理
  var I = this;
  var canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  var context = canvas.getContext('2d');
  var gradient = context.createRadialGradient(
    canvas.width / 2, canvas.height / 2,
    0,
    canvas.width / 2, canvas.height / 2,
    canvas.width / 2
  );

  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  return texture;
}
WebGLUnion.prototype.addMovingPoints = function () {
  var I = this;

  I.MeshPoint1 = I.addMovingPoint(29, -10, 10, '#158f82');
  I.MeshPoint2 = I.addMovingPoint(20, -20, 0, '#158f82');
  I.MeshPoint3 = I.addMovingPoint(25, 10, 0, '#158f82');
  I.MeshPoint4 = I.addMovingPoint(23, 15, 10, '#158f82');

  I.MeshPoint5 = I.addMovingPoint(-29, -5, 10, '#158f82');
  I.MeshPoint6 = I.addMovingPoint(-30, -10, 0, '#158f82');
  I.MeshPoint7 = I.addMovingPoint(-35, 10, 0, '#158f82');
  I.MeshPoint8 = I.addMovingPoint(-20, 10, -10, '#158f82');

  I.MeshPoint9 = I.addMovingPoint(-10, 20, -20, '#158f82');
  I.MeshPoint10 = I.addMovingPoint(10, 20, -20, '#158f82');
  I.MeshPoint11 = I.addMovingPoint(10, -20, -20, '#158f82');
  I.MeshPoint12 = I.addMovingPoint(-10, -20, -20, '#158f82');

  I.MeshPoint13 = I.addMovingPoint(18, 15, 20, '#158f82');
}
WebGLUnion.prototype.addMovingPoint = function (x, y, z, color) { // 添加球外转动的点
  var I = this;
  var geometry = new THREE.SphereGeometry(
    0.7, //球体半径
    30, // 球体横截面上的面个数，最小3，默认8
    30, // 球体纵截面上的上半部份面个数，最小2，默认6
  );
  var material = new THREE.MeshBasicMaterial({ color: color });//材质
  var mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x, y, z);
  I.turnGroup.add(mesh);
  return mesh;
}
WebGLUnion.prototype.addLines = function () {
  var I = this;
  I.line1to2 = I.addLine(I.line1to2, I.MeshPoint1, I.MeshPoint2);
  I.line1to3 = I.addLine(I.line1to3, I.MeshPoint1, I.MeshPoint3);
  I.line1to4 = I.addLine(I.line1to4, I.MeshPoint1, I.MeshPoint4);
  I.line3to4 = I.addLine(I.line3to4, I.MeshPoint3, I.MeshPoint4);

  I.line2to13 = I.addLine(I.line2to13, I.MeshPoint2, I.MeshPoint13);
  I.line6to13 = I.addLine(I.line6to13, I.MeshPoint6, I.MeshPoint13);
  I.line8to9 = I.addLine(I.line8to9, I.MeshPoint8, I.MeshPoint9);
  I.line8to12 = I.addLine(I.line8to12, I.MeshPoint8, I.MeshPoint12);

  I.line3to10 = I.addLine(I.line3to10, I.MeshPoint3, I.MeshPoint10);
  I.line10to11 = I.addLine(I.line10to11, I.MeshPoint10, I.MeshPoint11);
  I.line10to12 = I.addLine(I.line10to12, I.MeshPoint10, I.MeshPoint12);
  I.line7to11 = I.addLine(I.line7to11, I.MeshPoint7, I.MeshPoint11);

  I.line9to10 = I.addLine(I.line9to10, I.MeshPoint9, I.MeshPoint10);
  I.line7to8 = I.addLine(I.line7to8, I.MeshPoint7, I.MeshPoint8);
  I.line5to6 = I.addLine(I.line5to6, I.MeshPoint5, I.MeshPoint6);
  I.line5to7 = I.addLine(I.line5to7, I.MeshPoint5, I.MeshPoint7);
}
WebGLUnion.prototype.addLine = function (line, point1, point2) {
  var I = this;
  if (line) { //如果线已存在，则修改线的位置
    var p1 = line.geometry.vertices[0];
    var p2 = line.geometry.vertices[1];

    p1.x = point1.position.x;
    p1.y = point1.position.y;
    p1.z = point1.position.z;

    p2.x = point2.position.x;
    p2.y = point2.position.y;
    p2.z = point2.position.z;

    line.geometry.verticesNeedUpdate = true;
    return line;
  }
  else { //如果线不存在，创建
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(point1.position.x, point1.position.y, point1.position.z),
      new THREE.Vector3(point2.position.x, point2.position.y, point2.position.z),
    );

    // 线的材质
    var material = new THREE.LineBasicMaterial({
      color: '#004C3F',
      linewidth: 1,
    });
    line = new THREE.Line(geometry, //顶点
      material, //材质
      THREE.LineStrip, //折线
    );
    I.turnGroup.add(line);
    return line;
  }
}
WebGLUnion.prototype.colorChange = function () {
  var I = this;
  if (!I.luminousPointsColor) {
    I.luminousPointsColor = {
      r1: 0, g1: 75 / 255, b1: 65 / 255, //暗色
      r2: 10 / 255, g2: 255 / 255, b2: 245 / 255, //亮色
      add: 0, // 0
    };
  }

  var cc = I.luminousPointsColor;

  if(!cc.r) {
    cc.r = cc.r1;
    cc.g = cc.g1;
    cc.b = cc.b1;
  }

  var step = 100;
  cc.rc = (cc.r2 - cc.r1) / step;
  cc.gc = (cc.g2 - cc.b1) / step;
  cc.bc = (cc.g2 - cc.b1) / step;


  if(cc.add == 0) {
    cc.add = 1;
  }

  if( cc.add == 1 ) {
    cc.r += cc.rc;
    cc.g += cc.gc;
    cc.b += cc.bc;

    if( cc.r + cc.rc > cc.r2 ) {
      cc.add = -1;
    }
  }

  if (cc.add == -1) {
    cc.r -= cc.rc;
    cc.g -= cc.gc;
    cc.b -= cc.bc;

    if( cc.r + cc.rc < cc.r1 ) {
      cc.add = 1;
    }
  }
}
WebGLUnion.prototype.addLuminousPoints = function () {
  var I = this;
  I.colorChange();
  I.luminousPoint1 = I.addLuminousPoint(I.luminousPoint1, -I.sphereRadius, 0, 0, 90);
  I.luminousPoint2 = I.addLuminousPoint(I.luminousPoint2, I.sphereRadius, 0, 0, 90);
  I.luminousPoint3 = I.addLuminousPoint(I.luminousPoint3, 0, 0, I.sphereRadius, 0);
  I.luminousPoint4 = I.addLuminousPoint(I.luminousPoint4, 0, 0, -I.sphereRadius, 0);
}
WebGLUnion.prototype.addLuminousPoint = function (point, x, y, z, deg) { // 在球上创建发光点
  var I = this;
  if (point) {
    point.material.color.r = I.luminousPointsColor.r;
    point.material.color.g = I.luminousPointsColor.g;
    point.material.color.b = I.luminousPointsColor.b;
    return point;
  }
  else {
    // var geometry = new THREE.SphereGeometry(
    //   0.7, //球体半径
    //   30, // 球体横截面上的面个数，最小3，默认8
    //   30, // 球体纵截面上的上半部份面个数，最小2，默认6
    // );
    // //MeshLambertMaterial
    // //MeshBasicMaterial
    // var material = new THREE.MeshBasicMaterial({ color: '#000000' });//材质
    // var mesh = new THREE.Mesh(geometry, material);
    // mesh.position.set(x, y, z);
    // I.turnGroup.add(mesh);
    // return mesh;

    let geometry = new THREE.CircleGeometry (
      0.7,    // radius
      30,   // segments(分段)
    );
    let material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide} );
    // material.wireframe = true;
    
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(x, y, z);
    mesh.rotation.y = I.toRadian(deg);
    I.turnGroup.add( mesh );
    return mesh;
  }
}
WebGLUnion.prototype.addLuminousLines = function () {
  var I = this;
  I.luminousLine1 = I.addLine(I.luminousLine1, I.MeshPoint7, I.luminousPoint1);
  I.luminousLine2 = I.addLine(I.luminousLine2, I.MeshPoint2, I.luminousPoint2);
  I.luminousLine3 = I.addLine(I.luminousLine3, I.MeshPoint13, I.luminousPoint3);
  I.luminousLine4 = I.addLine(I.luminousLine4, I.MeshPoint10, I.luminousPoint4);

  if (I.luminousPointsColor.add > 0) {
    I.luminousLine1.visible = true;
    I.luminousLine1.material.color.r = I.luminousPointsColor.r;
    I.luminousLine1.material.color.g = I.luminousPointsColor.g;
    I.luminousLine1.material.color.b = I.luminousPointsColor.b;

    I.luminousLine2.visible = true;
    I.luminousLine2.material.color.r = I.luminousPointsColor.r;
    I.luminousLine2.material.color.g = I.luminousPointsColor.g;
    I.luminousLine2.material.color.b = I.luminousPointsColor.b;

    I.luminousLine3.visible = true;
    I.luminousLine3.material.color.r = I.luminousPointsColor.r;
    I.luminousLine3.material.color.g = I.luminousPointsColor.g;
    I.luminousLine3.material.color.b = I.luminousPointsColor.b;

    I.luminousLine4.visible = true;
    I.luminousLine4.material.color.r = I.luminousPointsColor.r;
    I.luminousLine4.material.color.g = I.luminousPointsColor.g;
    I.luminousLine4.material.color.b = I.luminousPointsColor.b;
  }
  else {
    I.luminousLine1.visible = false;
    I.luminousLine2.visible = false;
    I.luminousLine3.visible = false;
    I.luminousLine4.visible = false;
  }
}
WebGLUnion.prototype.addBackPoints = function() { // 添加背景星际
  var I = this;
  var geometry = new THREE.TorusKnotGeometry (
    180, //radius
    30, //tube 管子半径
    150, //radialSegments 
    12, //tubularSegments
    4,
    3,
  );
  var material = new THREE.PointsMaterial({
    color: '#ffffff',
    size: 3,
    map: this.createTexture(),
  });
  material.alphaTest = 0.9;

  I.backPointGroup = new THREE.Object3D();
  I.backPointGroup.position.x = 0;
  I.backPointGroup.position.y = -30;
  I.backPointGroup.position.z = 70;
  I.scene.add(I.backPointGroup);

  var points = new THREE.Points(geometry, material);
  points.rotation.x = I.toRadian(90);
  this.backPointGroup.add(points);
}
WebGLUnion.prototype.distance = function(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
WebGLUnion.prototype.mouseMove = function(e) {
  var I = this;
  var distance = I.distance(e.offsetX, e.offsetY, I.centerPoint.x, I.centerPoint.y);
  var zoom = (I.width - distance * 2) / I.width * 15;

  I.turnGroup.position.z = zoom;
  I.turnGroup.position.y = -zoom / 3
}
WebGLUnion.prototype.resize = function(width, height) {
  var I = this;
  I.width = width;
  I.height = height;
  I.centerPoint = { //中心点
    x: I.width / 2,
    y: I.height / 2,
  }
  if(I.renderer) {
    I.renderer.setSize(I.width, I.height);
  }
  
}