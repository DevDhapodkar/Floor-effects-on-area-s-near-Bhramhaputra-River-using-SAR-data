// =============================================================================
// CuriouSAR: Advanced Sentinel-1 Flood Change Detection Workflow
// AOI: Kaziranga National Park, Assam, India
// Author: NASA Space Apps Challenge - SAR Analysis Team
// =============================================================================

// === CONFIGURATION ===
// Define Area of Interest (Kaziranga National Park)
var aoi = ee.Geometry.Point([93.4, 26.6]).buffer(25000);

// Time periods for change detection
var beforeStart = '2024-05-01';  // Pre-monsoon period
var beforeEnd   = '2024-05-30';
var afterStart  = '2024-07-01';  // Peak monsoon period
var afterEnd    = '2024-07-30';

// === SENTINEL-1 PREPROCESSING FUNCTION ===
function s1Preproc(start, end) {
  var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filterBounds(aoi)
    .filterDate(start, end)
    .filter(ee.Filter.eq('instrumentMode', 'IW'))  // Interferometric Wide mode
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
    .filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))  // Use ascending passes for consistency
    .map(function(img) {
      // Convert to dB and apply radiometric calibration
      return img.multiply(0.0001)
                .log10()
                .multiply(10)
                .copyProperties(img, img.propertyNames());
    });
  
  // Create median composite and apply speckle filtering
  return s1.median()
           .focal_median(50, 'circle', 'meters')  // Speckle reduction
           .clip(aoi);
}

// === DATA PROCESSING ===
print('Processing Sentinel-1 data...');
var before = s1Preproc(beforeStart, beforeEnd);
var after = s1Preproc(afterStart, afterEnd);

// === CHANGE DETECTION ANALYSIS ===
// VV polarization difference (primary flood indicator)
var vvDiff = after.select('VV').subtract(before.select('VV')).rename('VV_diff');

// VH polarization difference (vegetation impact indicator)
var vhDiff = after.select('VH').subtract(before.select('VH')).rename('VH_diff');

// VH/VV ratio change (surface roughness indicator)
var beforeRatio = before.select('VH').divide(before.select('VV'));
var afterRatio = after.select('VH').divide(after.select('VV'));
var ratioChange = afterRatio.subtract(beforeRatio).rename('VH_VV_ratio_change');

// === OPTIONAL: SENTINEL-2 NDWI OVERLAY ===
function getNDWI(start, end) {
  var s2 = ee.ImageCollection('COPERNICUS/S2_SR')
    .filterBounds(aoi)
    .filterDate(start, end)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))  // Low cloud coverage
    .median()
    .clip(aoi);
  
  return s2.normalizedDifference(['B3', 'B8']).rename('NDWI');
}

var ndwiAfter = getNDWI(afterStart, afterEnd);

// === VISUALIZATION ===
Map.centerObject(aoi, 10);

// Base layers
Map.addLayer(before.select('VV'), {
  min: -25, 
  max: 0, 
  palette: ['black', 'white']
}, 'VV Before (dB)', false);

Map.addLayer(after.select('VV'), {
  min: -25, 
  max: 0, 
  palette: ['black', 'white']
}, 'VV After (dB)', false);

// Change detection layers
Map.addLayer(vvDiff, {
  min: -5, 
  max: 5, 
  palette: ['blue', 'lightblue', 'white', 'pink', 'red']
}, 'VV Difference (dB) - Flood Detection');

Map.addLayer(vhDiff, {
  min: -5, 
  max: 5, 
  palette: ['darkgreen', 'green', 'white', 'orange', 'red']
}, 'VH Difference (dB) - Vegetation Impact', false);

Map.addLayer(ratioChange, {
  min: -0.5, 
  max: 0.5, 
  palette: ['purple', 'blue', 'white', 'yellow', 'orange']
}, 'VH/VV Ratio Change - Surface Roughness', false);

// Optical validation layer
Map.addLayer(ndwiAfter, {
  min: -0.5, 
  max: 1, 
  palette: ['brown', 'yellow', 'lightblue', 'cyan']
}, 'NDWI Overlay (Optical Validation)', false);

// === QUANTITATIVE ANALYSIS ===
// Flood area calculation using VV difference threshold
var floodThreshold = -2;  // dB threshold for flood detection
var floodMask = vvDiff.lt(floodThreshold);

// Calculate flooded area
var floodArea = floodMask.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 10,
  maxPixels: 1e9
});

// Vegetation loss area calculation
var vegetationLossThreshold = -1;  // dB threshold for vegetation loss
var vegetationLossMask = vhDiff.lt(vegetationLossThreshold);

var vegetationLossArea = vegetationLossMask.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 10,
  maxPixels: 1e9
});

// Print results
print('=== QUANTITATIVE RESULTS ===');
print('Flooded Area (sq. km):', ee.Number(floodArea.get('VV_diff')).divide(1e6));
print('Vegetation Loss Area (sq. km):', ee.Number(vegetationLossArea.get('VH_diff')).divide(1e6));

// === EXPORT OPTIONS ===
// Uncomment the following lines to export results to Google Drive

// Export.image.toDrive({
//   image: vvDiff.addBands(vhDiff).addBands(ratioChange),
//   description: 'Kaziranga_SAR_change_detection',
//   region: aoi,
//   scale: 10,
//   maxPixels: 1e9,
//   crs: 'EPSG:4326'
// });

// Export.image.toDrive({
//   image: floodMask.rename('flood_mask'),
//   description: 'Kaziranga_flood_mask',
//   region: aoi,
//   scale: 10,
//   maxPixels: 1e9,
//   crs: 'EPSG:4326'
// });

// === ADDITIONAL ANALYSIS ===
// Create a composite change map
var changeComposite = ee.Image.cat([
  vvDiff.rename('VV_change'),
  vhDiff.rename('VH_change'),
  ratioChange.rename('Ratio_change')
]);

// Add statistics panel
var stats = changeComposite.reduceRegion({
  reducer: ee.Reducer.minMax().combine({
    reducer2: ee.Reducer.mean(),
    sharedInputs: true
  }),
  geometry: aoi,
  scale: 10,
  maxPixels: 1e9
});

print('=== CHANGE STATISTICS ===');
print('VV Change Statistics:', stats);

// === LEGEND AND ANNOTATIONS ===
// Add text annotations for better interpretation
var legend = ui.Panel({
  widgets: [
    ui.Label('SAR Change Detection Legend', {fontWeight: 'bold'}),
    ui.Label('VV Diff: Blue=Flood, Red=Dry'),
    ui.Label('VH Diff: Green=Vegetation, Red=Loss'),
    ui.Label('Ratio: Purple=Smooth, Yellow=Rough')
  ],
  style: {
    position: 'bottom-left',
    backgroundColor: 'white',
    padding: '10px'
  }
});

Map.add(legend);

// === FINAL OUTPUT ===
print('=== ANALYSIS COMPLETE ===');
print('AOI: Kaziranga National Park, Assam');
print('Analysis Period: ' + beforeStart + ' to ' + afterEnd);
print('Primary Change Indicators: VV difference, VH/VV ratio');
print('Use the layer controls to toggle different visualizations');
print('Check the Console for quantitative results');
