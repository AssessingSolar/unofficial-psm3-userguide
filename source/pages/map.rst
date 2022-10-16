
Interactive Pixel Map
=====================

This page is an interactive map showing the PSM3 4 km and 2 km pixel grid.
Zoom in to display the grid.  Mouse over the grid to see pixel metadata.

.. raw:: html
   
   <script src="https://cdn.jsdelivr.net/npm/ol@v7.1.0/dist/ol.js"></script>
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v7.1.0/ol.css">

   <script src="https://unpkg.com/ol-layerswitcher@4.1.0"></script>
   <link rel="stylesheet" href="https://unpkg.com/ol-layerswitcher@4.1.0/dist/ol-layerswitcher.css" />

   <style>
   .ol-mouse-position {
     background-color: #ffffff;
     border: 1px solid black;
   }

   .custom-infobox {
     top: 65px;
     left: .5em;
     background-color: #ffffff;
     border: 1px solid black;
     padding: 10px;
   }

   .infobox-entry {
     margin:0;
   }
   </style>

   <div id="map" style="height: 580px;"></div>

   <script src="../_static/map.js"></script>


Note that the pixel boundaries here are determined as in :ref:`/pages/pixel-boundaries.ipynb`.


This map tool was strongly inspired by the
`PRISM Data Explorer <https://www.prism.oregonstate.edu/explorer/>`_ developed
by NACSE, based at Oregon State University.
