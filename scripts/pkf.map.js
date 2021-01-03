/**
* @name MarkerClusterer for Google Maps v3
* @version version 1.0
* @author Luke Mahe
* @fileoverview
* The library creates and manages per-zoom-level clusters for large amounts of
* markers.
* <br/>
* This is a v3 implementation of the
* <a href="http://gmaps-utility-library-dev.googlecode.com/svn/tags/markerclusterer/"
* >v2 MarkerClusterer</a>.
* V3 src http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/
*/

/**
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/


/**
* A Marker Clusterer that clusters markers.
*
* @param {google.maps.Map} map The Google map to attach to.
* @param {Array.<google.maps.Marker>} opt_markers Optional markers to add to
*   the cluster.
* @param {Object} opt_options support the following options:
*     'gridSize': (number) The grid size of a cluster in pixels.
*     'maxZoom': (number) The maximum zoom level that a marker can be part of a
*                cluster.
*     'zoomOnClick': (boolean) Whether the default behaviour of clicking on a
*                    cluster is to zoom into it.
*     'styles': (object) An object that has style properties:
*       'url': (string) The image url.
*       'height': (number) The image height.
*       'width': (number) The image width.
*       'anchor': (Array) The anchor position of the label text.
*       'textColor': (string) The text color.
*       'textSize': (number) The text size.
* @constructor
* @extends google.maps.OverlayView
*/

var latitude;
var longitude;
var zoom;

function MarkerClusterer(map, opt_markers, opt_options) {
    this.extend(MarkerClusterer, google.maps.OverlayView);
    this.map_ = map;
    this.markers_ = [];
    this.clusters_ = [];
    this.sizes = [53, 56, 66, 78, 90];
    this.styles_ = [];
    this.ready_ = false;
    var options = opt_options || {};
    this.gridSize_ = options['gridSize'] || 60;
    this.maxZoom_ = options['maxZoom'] || null;
    this.styles_ = options['styles'] || [];
    this.imagePath_ = options['imagePath'] ||
this.MARKER_CLUSTER_IMAGE_PATH_;
    this.imageExtension_ = options['imageExtension'] ||
this.MARKER_CLUSTER_IMAGE_EXTENSION_;
    this.zoomOnClick_ = options['zoomOnClick'] || true;
    this.setupStyles_();
    this.setMap(map);
    this.prevZoom_ = this.map_.getZoom();
    var that = this;
    google.maps.event.addListener(this.map_, 'zoom_changed', function () {
        var maxZoom = that.map_.mapTypes[that.map_.getMapTypeId()].maxZoom;
        var zoom = that.map_.getZoom();
        if (zoom < 0 || zoom > maxZoom) {
            return;
        }
        if (that.prevZoom_ != zoom) {
            that.prevZoom_ = that.map_.getZoom();
            that.resetViewport();
        }
    });
    google.maps.event.addListener(this.map_, 'idle', function () {
        that.redraw();
    });
    if (opt_markers && opt_markers.length) {
        this.addMarkers(opt_markers, false);
    }
}
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ =
'http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/' +
'images/m';
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_ = 'png';
MarkerClusterer.prototype.extend = function (obj1, obj2) {
    return (function (object) {
        for (property in object.prototype) {
            this.prototype[property] = object.prototype[property];
        }
        return this;
    }).apply(obj1, [obj2]);
};
MarkerClusterer.prototype.onAdd = function () {
    this.setReady_(true);
};
MarkerClusterer.prototype.idle = function () { };
MarkerClusterer.prototype.draw = function () { };
MarkerClusterer.prototype.setupStyles_ = function () {
    for (var i = 0, size; size = this.sizes[i]; i++) {
        this.styles_.push({
            url: this.imagePath_ + (i + 1) + '.' + this.imageExtension_,
            height: size,
            width: size
        });
    }
};
MarkerClusterer.prototype.setStyles = function (styles) {
    this.styles_ = styles;
};
MarkerClusterer.prototype.getStyles = function () {
    return this.styles_;
};
MarkerClusterer.prototype.isZoomOnClick = function () {
    return this.zoomOnClick_;
};
MarkerClusterer.prototype.getMarkers = function () {
    return this.markers_;
};
MarkerClusterer.prototype.getTotalMarkers = function () {
    return this.markers_;
};
MarkerClusterer.prototype.setMaxZoom = function (maxZoom) {
    this.maxZoom_ = maxZoom;
};
MarkerClusterer.prototype.getMaxZoom = function () {
    return this.maxZoom_ || this.map_.mapTypes[this.map_.getMapTypeId()].maxZoom;
};
MarkerClusterer.prototype.calculator_ = function (markers, numStyles) {
    var index = 0;
    var count = markers.length;
    var dv = count;
    while (dv !== 0) {
        dv = parseInt(dv / 10, 10);
        index++;
    }
    index = Math.min(index, numStyles);
    return {
        text: count,
        index: index
    };
};
MarkerClusterer.prototype.setCalculator = function (calculator) {
    this.calculator_ = calculator;
};
MarkerClusterer.prototype.getCalculator = function () {
    return this.calculator_;
};
MarkerClusterer.prototype.addMarkers = function (markers, opt_nodraw) {
    for (var i = 0, marker; marker = markers[i]; i++) {
        this.pushMarkerTo_(marker);
    }
    if (!opt_nodraw) {
        this.redraw();
    }
};
MarkerClusterer.prototype.pushMarkerTo_ = function (marker) {
    marker.setVisible(false);
    marker.setMap(null);
    marker.isAdded = false;
    if (marker['draggable']) {
        var that = this;
        google.maps.event.addListener(marker, 'dragend', function () {
            marker.isAdded = false;
            that.resetViewport();
            that.redraw();
        });
    }
    this.markers_.push(marker);
};
MarkerClusterer.prototype.addMarker = function (marker, opt_nodraw) {
    this.pushMarkerTo_(marker);
    if (!opt_nodraw) {
        this.redraw();
    }
};
MarkerClusterer.prototype.removeMarker = function (marker) {
    var index = -1;
    if (this.markers_.indexOf) {
        index = this.markers_.indexOf(marker);
    } else {
        for (var i = 0, m; m = this.markers_[i]; i++) {
            if (m == marker) {
                index = i;
                continue;
            }
        }
    }
    if (index == -1) {
        return false;
    }
    this.markers_.splice(index, 1);
    marker.setVisible(false);
    marker.setMap(null);
    this.resetViewport();
    this.redraw();
    return true;
};
MarkerClusterer.prototype.setReady_ = function (ready) {
    if (!this.ready_) {
        this.ready_ = ready;
        this.createClusters_();
    }
};
MarkerClusterer.prototype.getTotalClusters = function () {
    return this.clusters_.length;
};
MarkerClusterer.prototype.getMap = function () {
    return this.map_;
};
MarkerClusterer.prototype.setMap = function (map) {
    this.map_ = map;
};
MarkerClusterer.prototype.getGridSize = function () {
    return this.gridSize_;
};
MarkerClusterer.prototype.setGridSize = function (size) {
    this.gridSize_ = size;
};
MarkerClusterer.prototype.getExtendedBounds = function (bounds) {
    var projection = this.getProjection();
    var tr = new google.maps.LatLng(bounds.getNorthEast().lat(),
bounds.getNorthEast().lng());
    var bl = new google.maps.LatLng(bounds.getSouthWest().lat(),
bounds.getSouthWest().lng());
    var trPix = projection.fromLatLngToDivPixel(tr);
    trPix.x += this.gridSize_;
    trPix.y -= this.gridSize_;
    var blPix = projection.fromLatLngToDivPixel(bl);
    blPix.x -= this.gridSize_;
    blPix.y += this.gridSize_;
    var ne = projection.fromDivPixelToLatLng(trPix);
    var sw = projection.fromDivPixelToLatLng(blPix);
    bounds.extend(ne);
    bounds.extend(sw);
    return bounds;
};
MarkerClusterer.prototype.isMarkerInBounds_ = function (marker, bounds) {
    return bounds.contains(marker.getPosition());
};
MarkerClusterer.prototype.clearMarkers = function () {
    this.resetViewport();
    this.markers_ = [];
};
MarkerClusterer.prototype.resetViewport = function () {
    for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
        cluster.remove();
    }
    for (var i = 0, marker; marker = this.markers_[i]; i++) {
        marker.isAdded = false;
        marker.setMap(null);
        marker.setVisible(false);
    }
    this.clusters_ = [];
};
MarkerClusterer.prototype.redraw = function () {
    this.createClusters_();
};
MarkerClusterer.prototype.createClusters_ = function () {
    if (!this.ready_) {
        return;
    }
    var mapBounds = new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(),
this.map_.getBounds().getNorthEast());
    var bounds = this.getExtendedBounds(mapBounds);
    for (var i = 0, marker; marker = this.markers_[i]; i++) {
        var added = false;
        if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
            for (var j = 0, cluster; cluster = this.clusters_[j]; j++) {
                if (!added && cluster.getCenter() &&
cluster.isMarkerInClusterBounds(marker)) {
                    added = true;
                    cluster.addMarker(marker);
                    break;
                }
            }
            if (!added) {
                var cluster = new Cluster(this);
                cluster.addMarker(marker);
                this.clusters_.push(cluster);
            }
        }
    }
};
function Cluster(markerClusterer) {
    this.markerClusterer_ = markerClusterer;
    this.map_ = markerClusterer.getMap();
    this.gridSize_ = markerClusterer.getGridSize();
    this.center_ = null;
    this.markers_ = [];
    this.bounds_ = null;
    this.clusterIcon_ = new ClusterIcon(this, markerClusterer.getStyles(),
markerClusterer.getGridSize());
}
Cluster.prototype.isMarkerAlreadyAdded = function (marker) {
    if (this.markers_.indexOf) {
        return this.markers_.indexOf(marker) != -1;
    } else {
        for (var i = 0, m; m = this.markers_[i]; i++) {
            if (m == marker) {
                return true;
            }
        }
    }
    return false;
};
Cluster.prototype.addMarker = function (marker) {
    if (this.isMarkerAlreadyAdded(marker)) {
        return false;
    }
    if (!this.center_) {
        this.center_ = marker.getPosition();
        this.calculateBounds_();
    }
    if (this.markers_.length == 0) {
        marker.setMap(this.map_);
        marker.setVisible(true);
    } else if (this.markers_.length == 1) {
        this.markers_[0].setMap(null);
        this.markers_[0].setVisible(false);
    }
    marker.isAdded = true;
    this.markers_.push(marker);
    this.updateIcon();
    return true;
};
Cluster.prototype.getMarkerClusterer = function () {
    return this.markerClusterer_;
};
Cluster.prototype.getBounds = function () {
    this.calculateBounds_();
    return this.bounds_;
};
Cluster.prototype.remove = function () {
    this.clusterIcon_.remove();
    delete this.markers_;
};
Cluster.prototype.getCenter = function () {
    return this.center_;
};
Cluster.prototype.calculateBounds_ = function () {
    var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
    this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
};
Cluster.prototype.isMarkerInClusterBounds = function (marker) {
    return this.bounds_.contains(marker.getPosition());
};
Cluster.prototype.getMap = function () {
    return this.map_;
};
Cluster.prototype.updateIcon = function () {
    var zoom = this.map_.getZoom();
    var mz = this.markerClusterer_.getMaxZoom();
    if (zoom > mz) {
        for (var i = 0, marker; marker = this.markers_[i]; i++) {
            marker.setMap(this.map_);
            marker.setVisible(true);
        }
        return;
    }
    if (this.markers_.length < 2) {
        this.clusterIcon_.hide();
        return;
    }
    var numStyles = this.markerClusterer_.getStyles().length;
    var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
    this.clusterIcon_.setCenter(this.center_);
    this.clusterIcon_.setSums(sums);
    this.clusterIcon_.show();
};
function ClusterIcon(cluster, styles, opt_padding) {
    cluster.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);
    this.styles_ = styles;
    this.padding_ = opt_padding || 0;
    this.cluster_ = cluster;
    this.center_ = null;
    this.map_ = cluster.getMap();
    this.div_ = null;
    this.sums_ = null;
    this.visible_ = false;
    this.setMap(this.map_);
}
ClusterIcon.prototype.triggerClusterClick = function () {
    var markerClusterer = this.cluster_.getMarkerClusterer();
    google.maps.event.trigger(markerClusterer, 'clusterclick', [this.cluster_]);
    if (markerClusterer.isZoomOnClick()) {
        this.map_.panTo(this.cluster_.getCenter());
        this.map_.fitBounds(this.cluster_.getBounds());
    }
};
ClusterIcon.prototype.onAdd = function () {
    this.div_ = document.createElement('DIV');
    if (this.visible_) {
        var pos = this.getPosFromLatLng_(this.center_);
        this.div_.style.cssText = this.createCss(pos);
        this.div_.innerHTML = this.sums_.text;
    }
    var panes = this.getPanes();
    panes.overlayImage.appendChild(this.div_);
    var that = this;
    google.maps.event.addDomListener(this.div_, 'click', function () {
        that.triggerClusterClick();
    });
};
ClusterIcon.prototype.getPosFromLatLng_ = function (latlng) {
    var pos = this.getProjection().fromLatLngToDivPixel(latlng);
    pos.x -= parseInt(this.width_ / 2, 10);
    pos.y -= parseInt(this.height_ / 2, 10);
    return pos;
};
ClusterIcon.prototype.draw = function () {
    if (this.visible_) {
        var pos = this.getPosFromLatLng_(this.center_);
        this.div_.style.top = pos.y + 'px';
        this.div_.style.left = pos.x + 'px';
    }
};
ClusterIcon.prototype.hide = function () {
    if (this.div_) {
        this.div_.style.display = 'none';
    }
    this.visible_ = false;
};
ClusterIcon.prototype.show = function () {
    if (this.div_) {
        var pos = this.getPosFromLatLng_(this.center_);
        this.div_.style.cssText = this.createCss(pos);
        this.div_.style.display = '';
    }
    this.visible_ = true;
};
ClusterIcon.prototype.remove = function () {
    this.setMap(null);
};
ClusterIcon.prototype.onRemove = function () {
    if (this.div_ && this.div_.parentNode) {
        this.hide();
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
};
ClusterIcon.prototype.setSums = function (sums) {
    this.sums_ = sums;
    this.text_ = sums.text;
    this.index_ = sums.index;
    if (this.div_) {
        this.div_.innerHTML = sums.text;
    }
    this.useStyle();
};
ClusterIcon.prototype.useStyle = function () {
    var index = Math.max(0, this.sums_.index - 1);
    index = Math.min(this.styles_.length - 1, index);
    var style = this.styles_[index];
    this.url_ = style['url'];
    this.height_ = style['height'];
    this.width_ = style['width'];
    this.textColor_ = style['opt_textColor'];
    this.anchor_ = style['opt_anchor'];
    this.textSize_ = style['opt_textSize'];
};
ClusterIcon.prototype.setCenter = function (center) {
    this.center_ = center;
};
ClusterIcon.prototype.createCss = function (pos) {
    var style = [];
    /*
    if (document.all) {
        style.push('filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(' +
'sizingMethod=scale,src="' + this.url_ + '");');
    } else {
        style.push('background:url(' + this.url_ + ');');
    }*/
    style.push('background:url(' + this.url_ + ');');

    if (typeof this.anchor_ === 'object') {
        if (typeof this.anchor_[0] === 'number' && this.anchor_[0] > 0 &&
this.anchor_[0] < this.height_) {
            style.push('height:' + (this.height_ - this.anchor_[0]) +
'px; padding-top:' + this.anchor_[0] + 'px;');
        } else {
            style.push('height:' + this.height_ + 'px; line-height:' + this.height_ +
'px;');
        }
        if (typeof this.anchor_[1] === 'number' && this.anchor_[1] > 0 &&
this.anchor_[1] < this.width_) {
            style.push('width:' + (this.width_ - this.anchor_[1]) +
'px; padding-left:' + this.anchor_[1] + 'px;');
        } else {
            style.push('width:' + this.width_ + 'px; text-align:center;');
        }
    } else {
        style.push('height:' + this.height_ + 'px; line-height:' +
this.height_ + 'px; width:' + this.width_ + 'px; text-align:center;');
    }
    var txtColor = this.textColor_ ? this.textColor_ : 'black';
    var txtSize = this.textSize_ ? this.textSize_ : 11;
    style.push('cursor:pointer; top:' + pos.y + 'px; left:' +
pos.x + 'px; color:' + txtColor + '; position:absolute; font-size:' +
txtSize + 'px; font-family:Arial,sans-serif; font-weight:bold');
    return style.join('');
};




google.load('maps', '3.5', {
    other_params: 'key=AIzaSyDMnNrqgfqTekK-XxMgutXsFBmX0Y2MBDs&sensor=false'
});

google.setOnLoadCallback(initialize);



var markerClusterer = null;
var map = null;

function refreshMap() {
    if (markerClusterer) {
        markerClusterer.clearMarkers();
    }

    var styles = [[{
        url: '/images/googleIcons/pkf_number_small.png',
        height: 35,
        width: 34,
        opt_textColor: '#000000',
        opt_anchor: [12, 20],
        opt_textSize: 11
    }, {
        url: '/images/googleIcons/pkf_number.png',
        height: 49,
        width: 48,
        opt_anchor: [22, 24],
        opt_textColor: '#000000',
        opt_textSize: 15
    }, {
        url: '/images/googleIcons/pkf_number.png',
        height: 49,
        width: 48,
        opt_anchor: [21, 23],
        opt_textColor: '#000000',
        opt_textSize: 10
    }]];

    var imageUrl = '/images/googleIcons/pkf_single.png';

    var markers = [];

    var markerImage = new google.maps.MarkerImage(imageUrl, new google.maps.Size(34, 34));

    var infowindow = new google.maps.InfoWindow();
    $(".pkfLocations .pkfLocation").each(function () {
        var pkfLocation = $(this);
        var latlng = new google.maps.LatLng($(pkfLocation).attr("data-latitude"), $(pkfLocation).attr("data-longitude"));
        var marker = new google.maps.Marker({
            position: latlng,
            draggable: false,
            icon: markerImage
        });

        markers.push(marker);

        //        var infowindow = new google.maps.InfoWindow();
        var locationName = $(".link", pkfLocation).text();

        google.maps.event.addListener(marker, "click", function () {
            var infoHtml = '<div class="locationInfoBox"><h5>' + $(pkfLocation).attr("data-name") + '</h5><p>';
            if ($(pkfLocation).attr("data-image") !== undefined) {
                infoHtml = infoHtml + '<img src="http://cms.pkf.com/umbraco/ImageGen.ashx?image=' + $(pkfLocation).attr("data-image") + '&width=50&height=100&constrain=True" />';
            }
            infoHtml = infoHtml + $(pkfLocation).attr("data-address");
            infoHtml = infoHtml + '</p>';
            infoHtml = infoHtml + '<p><a href="http://maps.google.com/maps?key=AIzaSyDMnNrqgfqTekK-XxMgutXsFBmX0Y2MBDs&q=' + $(pkfLocation).attr("data-location") + '" class="action button">Get Directions</a></p>';
            if ($(pkfLocation).attr("data-url") !== undefined) {
                infoHtml = infoHtml + '<p><a href="' + $(pkfLocation).attr("data-url") + '" class="action button">Go to website</a></p>';
            }
            infoHtml = infoHtml + '</div>';

            infowindow.setContent(infoHtml);
            infowindow.open(map, marker);
        });
    });

    var zoom = 20;
    var size = 22;
    var style = 0;

    markerClusterer = new MarkerClusterer(map, markers, {
        maxZoom: 20,
        gridSize: size,
        styles: styles[style]
    });
}


function initialize() {
    var mapDiv = $('#pkfmap')[0];

    if (mapDiv == null) {
        return;
    }
    var minZoomLevel = 18;
    map = new google.maps.Map(mapDiv, {
        zoom: 1,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
        },
        minZoom: 1,
        maxZoom: 20,
        scrollwheel: true,
        scaleControl: true,
        mapTypeControl: false,
        center: new google.maps.LatLng(20, 15),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    refreshMap();
    map.zoom = isNaN(parseInt($("#hdnZoomLevel").val())) ? 1 : parseInt($("#hdnZoomLevel").val());
    map.center = new google.maps.LatLng(parseFloat($("#hdnLatitude").val()), parseFloat($("#hdnLongitude").val()));
    latitude = isNaN(parseFloat($("#hdnLatitude").val())) ? 1 : parseFloat($("#hdnLatitude").val());
    longitude = isNaN(parseFloat($("#hdnLongitude").val())) ? 1 : parseFloat($("#hdnLongitude").val())
    zoom = isNaN(parseInt($("#hdnZoomLevel").val())) ? 1 : parseInt($("#hdnZoomLevel").val());
    if (latitude != undefined && longitude != undefined && zoom != undefined) {
        changeFocus(latitude, longitude, zoom);
    } else {
        changeFocus(1, 1, 1);
    }
}

function changeFocus(lat, long, zoom) {
    var mapDiv = $('#pkfmap')[0];

    if (mapDiv == null) {
        return;
    }

    map = new google.maps.Map(mapDiv, {
        zoom: zoom,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
        },
        maxZoom: 20,
        scrollwheel: true,
        scaleControl: true,
        mapTypeControl: false,
        center: new google.maps.LatLng(lat, long),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    refreshMap();
}