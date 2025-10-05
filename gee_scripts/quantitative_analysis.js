// =============================================================================
// CuriouSAR: Quantitative Analysis and Advanced Metrics
// Extension script for detailed flood impact assessment
// =============================================================================

// === ADVANCED QUANTITATIVE ANALYSIS ===
// This script extends the main analysis with detailed metrics and statistics

// Load the main analysis results (run curiousar_flood_detection.js first)
// Or define the same variables here for standalone use

var aoi = ee.Geometry.Point([93.4, 26.6]).buffer(25000);
var beforeStart = '2024-05-01';
var beforeEnd   = '2024-05-30';
var afterStart  = '2024-07-01';
var afterEnd    = '2024-07-30';

// === ENHANCED FLOOD DETECTION ===
function enhancedFloodAnalysis() {
  // Load and preprocess Sentinel-1 data
  var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filterBounds(aoi)
    .filterDate(beforeStart, afterEnd)
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
    .filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))
    .map(function(img) {
      return img.multiply(0.0001).log10().multiply(10);
    });

  // Create before and after composites
  var before = s1.filterDate(beforeStart, beforeEnd).median().focal_median(50, 'circle', 'meters');
  var after = s1.filterDate(afterStart, afterEnd).median().focal_median(50, 'circle', 'meters');

  // Calculate differences
  var vvDiff = after.select('VV').subtract(before.select('VV'));
  var vhDiff = after.select('VH').subtract(before.select('VH'));

  return {
    before: before,
    after: after,
    vvDiff: vvDiff,
    vhDiff: vhDiff
  };
}

var analysis = enhancedFloodAnalysis();

// === MULTI-THRESHOLD FLOOD DETECTION ===
function multiThresholdFloodDetection(vvDiff) {
  var thresholds = [-1, -2, -3, -4, -5];  // Different flood severity levels
  var floodMasks = {};
  var floodAreas = {};

  thresholds.forEach(function(threshold) {
    var mask = vvDiff.lt(threshold);
    var area = mask.multiply(ee.Image.pixelArea()).reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: aoi,
      scale: 10,
      maxPixels: 1e9
    });

    floodMasks['threshold_' + Math.abs(threshold)] = mask;
    floodAreas['threshold_' + Math.abs(threshold)] = area;
  });

  return { masks: floodMasks, areas: floodAreas };
}

var floodAnalysis = multiThresholdFloodDetection(analysis.vvDiff);

// === VEGETATION IMPACT ASSESSMENT ===
function vegetationImpactAnalysis(vhDiff) {
  // Different vegetation impact levels
  var impactLevels = {
    severe: vhDiff.lt(-2),      // Severe vegetation loss
    moderate: vhDiff.lt(-1).and(vhDiff.gte(-2)),  // Moderate impact
    light: vhDiff.lt(0).and(vhDiff.gte(-1))       // Light impact
  };

  var impactAreas = {};
  Object.keys(impactLevels).forEach(function(level) {
    var area = impactLevels[level].multiply(ee.Image.pixelArea()).reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: aoi,
      scale: 10,
      maxPixels: 1e9
    });
    impactAreas[level] = area;
  });

  return { levels: impactLevels, areas: impactAreas };
}

var vegetationAnalysis = vegetationImpactAnalysis(analysis.vhDiff);

// === TEMPORAL ANALYSIS ===
function temporalAnalysis() {
  // Create monthly composites for trend analysis
  var months = ['2024-05', '2024-06', '2024-07'];
  var monthlyData = {};

  months.forEach(function(month) {
    var start = month + '-01';
    var end = month + '-30';
    
    var monthlyComposite = ee.ImageCollection('COPERNICUS/S1_GRD')
      .filterBounds(aoi)
      .filterDate(start, end)
      .filter(ee.Filter.eq('instrumentMode', 'IW'))
      .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
      .filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))
      .map(function(img) {
        return img.multiply(0.0001).log10().multiply(10);
      })
      .median()
      .focal_median(50, 'circle', 'meters')
      .clip(aoi);

    monthlyData[month] = monthlyComposite;
  });

  return monthlyData;
}

var temporalData = temporalAnalysis();

// === SPATIAL STATISTICS ===
function spatialStatistics(image) {
  var stats = image.reduceRegion({
    reducer: ee.Reducer.minMax().combine({
      reducer2: ee.Reducer.mean().combine({
        reducer2: ee.Reducer.stdDev(),
        sharedInputs: true
      }),
      sharedInputs: true
    }),
    geometry: aoi,
    scale: 10,
    maxPixels: 1e9
  });

  return stats;
}

// === COMPREHENSIVE REPORTING ===
function generateComprehensiveReport() {
  print('=== COMPREHENSIVE FLOOD IMPACT ASSESSMENT ===');
  print('Area of Interest: Kaziranga National Park, Assam');
  print('Analysis Period: ' + beforeStart + ' to ' + afterEnd);
  print('');

  // Flood area statistics
  print('=== FLOOD EXTENT ANALYSIS ===');
  Object.keys(floodAnalysis.areas).forEach(function(threshold) {
    var area = ee.Number(floodAnalysis.areas[threshold].get('VV')).divide(1e6);
    print('Flood Area (threshold ' + threshold.replace('threshold_', '') + ' dB): ' + area + ' sq. km');
  });

  // Vegetation impact statistics
  print('');
  print('=== VEGETATION IMPACT ANALYSIS ===');
  Object.keys(vegetationAnalysis.areas).forEach(function(level) {
    var area = ee.Number(vegetationAnalysis.areas[level].get('VH')).divide(1e6);
    print('Vegetation ' + level + ' impact area: ' + area + ' sq. km');
  });

  // Spatial statistics
  print('');
  print('=== SPATIAL STATISTICS ===');
  var vvStats = spatialStatistics(analysis.vvDiff);
  var vhStats = spatialStatistics(analysis.vhDiff);
  
  print('VV Difference Statistics:', vvStats);
  print('VH Difference Statistics:', vhStats);

  // Temporal trends
  print('');
  print('=== TEMPORAL TRENDS ===');
  print('Monthly VV backscatter trends available for:', Object.keys(temporalData));
}

// === EXPORT ENHANCED RESULTS ===
function exportEnhancedResults() {
  // Create comprehensive change map
  var comprehensiveMap = ee.Image.cat([
    analysis.vvDiff.rename('VV_change'),
    analysis.vhDiff.rename('VH_change'),
    floodAnalysis.masks.threshold_2.rename('flood_mask'),
    vegetationAnalysis.levels.severe.rename('severe_vegetation_loss')
  ]);

  // Export options (uncomment to use)
  // Export.image.toDrive({
  //   image: comprehensiveMap,
  //   description: 'Kaziranga_comprehensive_analysis',
  //   region: aoi,
  //   scale: 10,
  //   maxPixels: 1e9,
  //   crs: 'EPSG:4326'
  // });

  return comprehensiveMap;
}

// === VISUALIZATION ENHANCEMENTS ===
function createEnhancedVisualizations() {
  // Multi-threshold flood visualization
  var floodVis = {
    min: -5,
    max: 5,
    palette: ['darkblue', 'blue', 'lightblue', 'white', 'pink', 'red', 'darkred']
  };

  // Vegetation impact visualization
  var vegetationVis = {
    min: -3,
    max: 3,
    palette: ['darkgreen', 'green', 'lightgreen', 'white', 'yellow', 'orange', 'red']
  };

  // Add enhanced layers
  Map.addLayer(analysis.vvDiff, floodVis, 'Enhanced VV Change (Multi-threshold)', false);
  Map.addLayer(analysis.vhDiff, vegetationVis, 'Enhanced VH Change (Impact Levels)', false);
  
  // Add flood severity layers
  Map.addLayer(floodAnalysis.masks.threshold_1, {palette: ['white', 'lightblue']}, 'Light Flooding (-1 dB)', false);
  Map.addLayer(floodAnalysis.masks.threshold_2, {palette: ['white', 'blue']}, 'Moderate Flooding (-2 dB)', false);
  Map.addLayer(floodAnalysis.masks.threshold_3, {palette: ['white', 'darkblue']}, 'Severe Flooding (-3 dB)', false);

  // Add vegetation impact layers
  Map.addLayer(vegetationAnalysis.levels.light, {palette: ['white', 'yellow']}, 'Light Vegetation Impact', false);
  Map.addLayer(vegetationAnalysis.levels.moderate, {palette: ['white', 'orange']}, 'Moderate Vegetation Impact', false);
  Map.addLayer(vegetationAnalysis.levels.severe, {palette: ['white', 'red']}, 'Severe Vegetation Impact', false);
}

// === EXECUTE ANALYSIS ===
generateComprehensiveReport();
createEnhancedVisualizations();
var exportMap = exportEnhancedResults();

print('=== ENHANCED ANALYSIS COMPLETE ===');
print('Use layer controls to explore different flood severity levels');
print('Check console for detailed quantitative metrics');
print('Enhanced visualizations available with multi-threshold analysis');
