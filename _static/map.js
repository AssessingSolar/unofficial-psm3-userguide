class CustomInfoBox extends ol.control.Control {

  constructor(opt_options) {
    const element = document.createElement('div');
    element.className = 'custom-infobox ol-control';
    element.id = 'custom-infobox';

    super({
      element: element,
    });
  }
}

function make_grid_layer(opts){

    var source = new ol.source.Vector();
    var geom;

    // lines of longitude
    var lon = opts.minlon;
    var edge = opts.maxlon+(opts.cellSize/2);
    while (lon<edge){
        geom = new ol.geom.LineString([[lon, opts.minlat], [lon, opts.maxlat]]);
        source.addFeature(
            new ol.Feature({
                geometry: geom.transform('EPSG:4326', 'EPSG:3857')
            })
        );
        lon += opts.cellSize;
    }

    // lines of latitude
    var lat = opts.minlat;
    var edge = opts.maxlat+(opts.cellSize/2);
    while (lat<edge){
        geom = new ol.geom.LineString([[opts.minlon, lat], [opts.maxlon, lat]]);
        source.addFeature(
            new ol.Feature({
                geometry: geom.transform('EPSG:4326', 'EPSG:3857')
            })
        );
        lat += opts.cellSize;
    }

    var layer = new ol.layer.Vector({
        title: opts.name,
        source: source,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: opts.color,
                width: opts.width,
            })
        }),
        maxResolution: opts.maxResolution
    });

    return layer;
}

function snapToCenter(lat, lon, resolution){
    var latStep, lonStep;
    if(resolution == 0.02){
        latStep = 0;
        lonStep = 0.01;
    } else if(resolution == 0.04){
        latStep = -0.01;
        lonStep = 0.02;
    }
    var invRes = Math.round(1/resolution);
    var latRounded = Math.round((lat+latStep) * invRes) / invRes - latStep;
    var lonRounded = Math.round((lon+lonStep) * invRes) / invRes - lonStep;
    return {
        lat: latRounded,
        lon: lonRounded,
    };
}

function init(){
    var view = new ol.View({
        minZoom: 4,
        maxZoom: 15,
        extent: ol.proj.transformExtent([-125, -21, -66.5, 60], 'EPSG:4326', 'EPSG:3857'),
        center: ol.proj.transform([-105.17, 39.74], 'EPSG:4326','EPSG:3857'),
        zoom: 12
    });

    const mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: function(coord) {
            return ol.coordinate.format(coord, "Mouse Position: {y}, {x}", 6);
        },
        projection: 'EPSG:4326',
     });

    map = new ol.Map({
        target: "map",
        view: view,
        controls: ol.control.defaults.defaults().extend([mousePositionControl, new CustomInfoBox()])
    });


    // Base Layers

    var base_group = new ol.layer.Group({title: "Base Layer"});
    map.addLayer(base_group);
    var base_layers = base_group.getLayers();

    base_layers.push(new ol.layer.Tile({
        title: 'OSM',
        source: new ol.source.OSM(),
        visible: true,
        type: 'base'
    }));

    base_layers.push(new ol.layer.Tile({
        title: "NACSE Terrain",
        source: new ol.source.XYZ({
            url: "https://tile7.nacse.org/basemap/{z}/{x}/{y}.png"
        }),
        visible: false,
        type: 'base'
    }));

    base_layers.push(new ol.layer.Tile({
        title: "ESRI Topography",
        source: new ol.source.XYZ({
            attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        }),
        visible: false,
        type: 'base',
    }));

    base_layers.push(new ol.layer.Tile({
        title: "ESRI Satellite",
        source: new ol.source.XYZ({
            url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            attributions: 'Tiles © <a href="https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer">ArcGIS</a>',
        }),
        visible: false,
        type: 'base'
    }));


    // Overlays

    var overlay_group = new ol.layer.Group({title: "Overlays"});
    map.addLayer(overlay_group);
    var overlays = overlay_group.getLayers();

    var grid_layer_2km = make_grid_layer({
        minlon: -180,
        maxlon: -22.5,
        minlat: -21.01,
        maxlat: 60,
        cellSize: 0.02,
        name: "PSM3 2 km",
        maxResolution: 306,
        width: 1,
    });
    overlays.push(grid_layer_2km);

    var grid_layer_4km = make_grid_layer({
        minlon: -180,
        maxlon: -22.5,
        minlat: -21.01,
        maxlat: 60,
        cellSize: 0.04,
        name: "PSM3 4 km",
        maxResolution: 306,
        width: 3,
    });
    overlays.push(grid_layer_4km);

    var vectorSource = new ol.source.Vector();
    var vectorLayer = new ol.layer.Vector({
        title: "Active Pixel",
        source: vectorSource,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 3,
                color: "#00AAFF",
            })
        }),
    });
    overlays.push(vectorLayer);


    // User Interface

    var layer_switcher = new ol.control.LayerSwitcher({
         tipLabel: 'Layers'
    });
    map.addControl(layer_switcher);

    var activePixelCoord = {lat: 0, lon:0};

    var activePixelIsPinned = false;

    map.on('click', function(evt) {
        if(activePixelIsPinned){
            vectorSource.clear();
            vectorSource.changed();
        }
        activePixelIsPinned = !activePixelIsPinned;
    });

    map.on('pointermove', function(evt){
        if(!vectorLayer.state_.visible){
            return;
        }
        if(activePixelIsPinned){
            return;
        }
        var coords = ol.proj.toLonLat(evt.coordinate);
        var lat = coords[1];
        var lon = coords[0];

        var pixelWidth;
        if(grid_layer_2km.state_.visible){
            pixelWidth = 0.02;
        } else if(grid_layer_4km.state_.visible){
            pixelWidth = 0.04;
        } else {
            return;
        }

        var rounded = snapToCenter(lat, lon, pixelWidth);
        if((activePixelCoord.lat != rounded.lat) ||
           (activePixelCoord.lon != rounded.lon)){
            activePixelCoord.lat = rounded.lat;
            activePixelCoord.lon = rounded.lon;
            var lower = rounded.lat - pixelWidth/2;
            var upper = rounded.lat + pixelWidth/2;
            var left = rounded.lon - pixelWidth/2;
            var right = rounded.lon + pixelWidth/2;
            var minPoint = [left + 0.001, lower + 0.001];
            var maxPoint = [right - 0.001, upper - 0.001];
            var polygonFeature = new ol.Feature(
                ol.geom.Polygon.fromExtent(minPoint.concat(maxPoint)).transform('EPSG:4326','EPSG:3857')
            );
            vectorSource.clear();
            vectorSource.addFeature(polygonFeature);
            vectorSource.changed();

            var width = ol.sphere.getDistance([left, lower], [right, lower]) / 1000;
            var height = ol.sphere.getDistance([left, lower], [left, upper]) / 1000;
            document.getElementById('custom-infobox').innerHTML = (
                '<b>Highlighted Pixel:</b>' +
                '<p class="infobox-entry"><b>Lat:</b> ' + lower.toFixed(2) + ' to ' + upper.toFixed(2) + '</p>' +
                '<p class="infobox-entry"><b>Lon:</b> ' + left.toFixed(2) + ' to ' + right.toFixed(2) + '</p>' +
                '<p class="infobox-entry"><b>Width [km]:</b> ' + width.toFixed(4) + '</p>' +
                '<p class="infobox-entry"><b>Height [km]:</b> ' + height.toFixed(4) + '</p>' +
                '<p class="infobox-entry"><b>Aspect Ratio:</b> ' + (width/height).toFixed(3) + '</p>'
            );
        }
    });
}

$(window).on('load', function() {
    init();
});
