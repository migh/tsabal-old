(function(){
    'use strict';

    var commonNodeGeometry = new THREE.BoxGeometry(1, 1, 1),
        commonNodeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: false}),
        commonHoverMaterial = new THREE.MeshBasicMaterial({color: 0xff00ff});

    /**
     * Constructor for Tsabal node
     * @constructor
     * @param {Object} threejs - Three.js' node representation
     * @param {Object} coords - Point coordinates
     * @param {Number} coords.x - Point's x coordinate
     * @param {Number} coords.y - Point's y coordinate
     * @param {Number} coords.z - Point's z coordinate
     * @param {Object} mProps - Dynamic object with mechanical properties
     */

    function Node(config){
        this.container = config.parent;

        this.coords = new THREE.Vector3(config.coords.x,config.coords.y,config.coords.z);
    }

    Node.prototype = {
        /**
         * Initializes Tsabal's Node object
         */

        // for adding the node to the scene
        init: function(){
            // radius, widthSegments, heightSegments
            this.geometry = commonNodeGeometry;
            this.material = commonNodeMaterial;
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.position.set(this.coords.x, this.coords.y, this.coords.z);
            this.container.add(this.mesh);
        }
    }

    /**
     * Constructor for Tsabal edge
     * @constructor
     * @param {Object} threejs - Three.js' edge representation
     * @param {Object} coords - Point coordinates
     * @param {Number} coords.x - Point's x coordinate
     * @param {Number} coords.y - Point's y coordinate
     * @param {Number} coords.z - Point's z coordinate
     * @param {Object} mProps - Dynamic object with mechanical properties
     */

    function Edge(config){
        this.scene = config.scene;

        this.startPoint = new THREE.Vector3(config.startPoint.x,config.startPoint.y,config.startPoint.z);
        this.endPoint = new THREE.Vector3(config.endPoint.x,config.endPoint.y,config.endPoint.z);
    }

    Edge.prototype = {
        /**
         * Adds three js object to scene
         */

        // for adding the node to the scene
        display: function(){
            this.scene.add(this.line);
        },
        /**
         * Initializes Tsabal's Edge object
         */

        // for adding the node to the scene
        init: function(){
            this.geometry = new THREE.Geometry();
            this.geometry.vertices.push(this.startPoint);
            this.geometry.vertices.push(this.endPoint);
            this.material = new THREE.LineBasicMaterial({color: 0xff0000});
            this.line = new THREE.Line(this.geometry, this.material);
        }
    }

    angular.module('tsabal',[]).
        run(function(){
        }).
        factory('three.js',['$window',function(w){
            var scene, container, camera, renderer, controls, stats;
            var keyboard = new THREEx.KeyboardState();
            var clock = new THREE.Clock();
            var projector = new THREE.Projector();
            var mouseVector = new THREE.Vector3();

            var SCREEN_WIDTH = 320, SCREEN_HEIGHT = 240;

            // Three.js init function
            function init(){
                scene = new THREE.Scene();

                // set the view size in pixels (custom or according to window size)
                // camera attributes
                var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
                // set up camera
                camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
                // add the camera to the scene
                scene.add(camera);

                // the camera defaults to position (0,0,0)
                // so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
                camera.position.set(0,150,400);
                camera.lookAt(scene.position);

                renderer = new THREE.WebGLRenderer( {antialias:true} );

                renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

                // attach div element to variable to contain the renderer
                container = document.getElementById( 'webGLContainer' );
                container.insertBefore( renderer.domElement , document.getElementById('updateModelButton') );

                // automatically resize renderer
                THREEx.WindowResize(renderer, camera);
                // toggle full-screen on given key press
                // THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

                // move mouse and: left   click to rotate,
                //                 middle click to zoom,
                //                 right  click to pan
                controls = new THREE.OrbitControls( camera, renderer.domElement );

                // displays current and past frames per second attained by scene
                stats = new Stats();
                stats.domElement.style.position = 'fixed';
                stats.domElement.style.top = '0px';
                stats.domElement.style.right = '0px';
                stats.domElement.style.zIndex = 100;
                container.appendChild( stats.domElement );

                // create a light
                var light = new THREE.PointLight(0xffffff);
                light.position.set(0,250,0);
                scene.add(light);
                var ambientLight = new THREE.AmbientLight(0x111111);
                scene.add(ambientLight);

                // create a set of coordinate axes to help orient user
                //    specify length in pixels in each direction
                var axes = new THREE.AxisHelper(10);
                scene.add( axes );

            }

            // Three.js animate function
            function animate(){

                requestAnimationFrame( animate );
                render();
                update();

            }

            function update(){
                // delta = change in time since last call (in seconds)
                var delta = clock.getDelta();

                // functionality provided by THREEx.KeyboardState.js
                if ( keyboard.pressed("1") )
                    alert(' Have a nice day! - 1');
                if ( keyboard.pressed("2") )
                    alert(' Have a nice day! - 2');

                controls.update();
                stats.update();
            }

            function render(){
                renderer.render( scene, camera );
            }

            // On mouse move listener for object picking
            w.addEventListener( 'mousemove', onMouseMove, false );

            function onMouseMove(ev){

                mouseVector.x = 2 * (ev.clientX / SCREEN_WIDTH) - 1;
                mouseVector.y = 1 - 2 * ( ev.clientY / SCREEN_HEIGHT );

                var raycaster = projector.pickingRay( mouseVector.clone(), camera );
                var intersects = raycaster.intersectObjects( scene.children );

                if(intersects.length != 0){
                    console.log(intersects);
                }
//                intersects[0].object.material = hoverMaterial;
            }

            var three = {
                init: init,
                animate: animate,
                getScene: function(){
                    return scene;
                }
            }

            return three;

        }]).
        controller('webGLCtrl',['$scope','$http','three.js',function($scope,$http,js3){

            js3.init();
            js3.animate();

            // Array for storing nodes
            $scope.nodes = [];
            var lastnode = null;

            var nodeContainer = new THREE.Object3D();

            $http.get('nodes.json').
                success(function(data){
                    // Dummy variable
                    var i;
                    // For now it's not assigned to any scope variable but it should be
                    for(i=0;i<data.length;i++){
                        var item = data[i];

                        // y and z coords are inverted in webGL
                        var sphere = new Node({
                            coords: {
                                x:item.x,
                                y:item.z,
                                z:item.y
                            },
                            parent: nodeContainer
                        });

                        sphere.init();
                        $scope.nodes.push(sphere);
                    }

                    js3.getScene().add(nodeContainer);
                });
        }]).
        controller('formCtrl',['$scope','$http',function(s,$http){

            s.form = {};
            var form = s.form;

            s.start = function(){
                form.projectName = 'Proyecto 001';
                form.mode = 'execution';
                form.program = 'ptlush';
                form.axis = 'Y';
                form.strata = 10;
                form.floormap = [];
            }

            /**
             * Change Internal Object to External JSON object for processing
             * @param {Object} iModel - Angular's form model
             * @return {Object} oModel - Malledi's modeling file
             */

            function createJSON(iModel){
                var oModel = {
                    name: '',
                    config: {},
                    model: {}
                };

                oModel.name = iModel.projectName;
                oModel.config.mode = iModel.mode;
                oModel.config.program = iModel.program;
                oModel.config.axis = iModel.axis;
                oModel.model.xAxis = iModel.xAxis;
                oModel.model.yAxis = iModel.yAxis;
                oModel.model.zAxis = iModel.zAxis;
                oModel.model.soil = {};
                oModel.model.soil.strata = iModel.strata;
                oModel.model.structure = {};
                oModel.model.structure.floorMap = iModel.floormap;

                return oModel;
            }

            s.addFloor = function(){
                form.floormap.push({coords:{x:0,y:0},floors:0});
            }

            s.removeFloor = function(index){
                form.floormap.splice(index,1);
            }

            s.saveAsJSON = function (){
                var content = angular.toJson(createJSON(s.form));

                var textFileAsBlob = new Blob([content], {type:'application/json'});

                var downloadLink = document.createElement("a");
                downloadLink.download = 'malledi.json';
                downloadLink.innerHTML = "Download File";
                if (window.webkitURL != null)
                {
                    // Chrome allows the link to be clicked
                    // without actually adding it to the DOM.
                    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
                }
                else
                {
                    // Firefox requires the link to be added to the DOM
                    // before it can be clicked.
                    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                    downloadLink.onclick = function(e){
                        document.body.removeChild(event.target);
                    };
                    downloadLink.style.display = "none";
                    document.body.appendChild(downloadLink);
                }

                downloadLink.click();
            }

        }]).
        directive('floorfield',[function(){
            return {
                templateUrl: 'ng/partials/floorfield.html',
                restrict: 'E',
                replace: true
            }
        }]);
})();