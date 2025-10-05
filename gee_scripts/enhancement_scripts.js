// =============================================================================
// CuriouSAR: Enhancement Scripts and Advanced Features
// Optional advanced features for hackathon presentation
// =============================================================================

// === ANIMATED GIF GENERATION ===
function createAnimatedGIF() {
  // Create monthly composites for animation
  var months = [
    '2024-05-01', '2024-05-15', '2024-06-01', '2024-06-15', 
    '2024-07-01', '2024-07-15', '2024-08-01'
  ];
  
  var animationFrames = [];
  
  months.forEach(function(date) {
    var endDate = ee.Date(date).advance(14, 'day');
    
    var frame = ee.ImageCollection('COPERNICUS/S1_GRD')
      .filterBounds(aoi)
      .filterDate(date, endDate)
      .filter(ee.Filter.eq('instrumentMode', 'IW'))
      .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
      .filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))
      .map(function(img) {
        return img.multiply(0.0001).log10().multiply(10);
      })
      .median()
      .focal_median(50, 'circle', 'meters')
      .clip(aoi)
      .select('VV');
    
    animationFrames.push(frame);
  });
  
  // Create animation collection
  var animationCollection = ee.ImageCollection.fromImages(animationFrames);
  
  // Export as video (uncomment to use)
  // Export.video.toDrive({
  //   collection: animationCollection,
  //   description: 'Kaziranga_SAR_animation',
  //   dimensions: 768,
  //   framesPerSecond: 2,
  //   region: aoi,
  //   crs: 'EPSG:4326'
  // });
  
  return animationCollection;
}

// === POPULATION IMPACT ASSESSMENT ===
function populationImpactAnalysis() {
  // Load WorldPop population data
  var population = ee.ImageCollection('WorldPop/GP/100m/pop')
    .filterDate('2020-01-01', '2020-12-31')
    .median()
    .clip(aoi);
  
  // Load flood mask from main analysis
  var floodMask = analysis.vvDiff.lt(-2);  // Assuming analysis object exists
  
  // Calculate affected population
  var affectedPopulation = population.multiply(floodMask).reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: aoi,
    scale: 100,
    maxPixels: 1e9
  });
  
  // Calculate total population in AOI
  var totalPopulation = population.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: aoi,
    scale: 100,
    maxPixels: 1e9
  });
  
  return {
    affected: affectedPopulation,
    total: totalPopulation,
    population: population
  };
}

// === LANDCOVER INTEGRATION ===
function landcoverImpactAnalysis() {
  // Load ESA WorldCover data
  var landcover = ee.Image('ESA/WorldCover/v100/2020').clip(aoi);
  
  // Define landcover classes relevant to flood impact
  var landcoverClasses = {
    10: 'Tree cover',
    20: 'Shrubland',
    30: 'Grassland',
    40: 'Cropland',
    50: 'Built-up',
    60: 'Bare/sparse vegetation',
    80: 'Permanent water bodies',
    90: 'Herbaceous wetland',
    95: 'Mangroves',
    100: 'Moss and lichen'
  };
  
  // Create flood mask
  var floodMask = analysis.vvDiff.lt(-2);
  
  // Calculate area of each landcover type affected by flooding
  var affectedLandcover = {};
  
  Object.keys(landcoverClasses).forEach(function(classId) {
    var classMask = landcover.eq(parseInt(classId));
    var affectedArea = classMask.and(floodMask).multiply(ee.Image.pixelArea()).reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: aoi,
      scale: 10,
      maxPixels: 1e9
    });
    
    affectedLandcover[landcoverClasses[classId]] = affectedArea;
  });
  
  return {
    landcover: landcover,
    affected: affectedLandcover,
    classes: landcoverClasses
  };
}

// === POLARIZATION DECOMPOSITION ===
function polarizationDecomposition() {
  // Pauli decomposition
  var before = analysis.before;
  var after = analysis.after;
  
  // Calculate Pauli components (simplified)
  var beforePauli = ee.Image.cat([
    before.select('VV').add(before.select('VH')).rename('Pauli1'),
    before.select('VV').subtract(before.select('VH')).rename('Pauli2'),
    before.select('VH').multiply(2).rename('Pauli3')
  ]);
  
  var afterPauli = ee.Image.cat([
    after.select('VV').add(after.select('VH')).rename('Pauli1'),
    after.select('VV').subtract(after.select('VH')).rename('Pauli2'),
    after.select('VH').multiply(2).rename('Pauli3')
  ]);
  
  // Calculate Pauli change
  var pauliChange = afterPauli.subtract(beforePauli);
  
  return {
    before: beforePauli,
    after: afterPauli,
    change: pauliChange
  };
}

// === TIME SERIES TREND ANALYSIS ===
function timeSeriesTrendAnalysis() {
  // Create monthly time series
  var startDate = ee.Date('2024-01-01');
  var endDate = ee.Date('2024-12-31');
  var months = ee.List.sequence(0, 11);
  
  var monthlySeries = months.map(function(month) {
    var date = startDate.advance(month, 'month');
    var nextMonth = date.advance(1, 'month');
    
    var monthlyComposite = ee.ImageCollection('COPERNICUS/S1_GRD')
      .filterBounds(aoi)
      .filterDate(date, nextMonth)
      .filter(ee.Filter.eq('instrumentMode', 'IW'))
      .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
      .filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))
      .map(function(img) {
        return img.multiply(0.0001).log10().multiply(10);
      })
      .median()
      .focal_median(50, 'circle', 'meters')
      .clip(aoi);
    
    return monthlyComposite.select('VV').set('system:time_start', date.millis());
  });
  
  var timeSeries = ee.ImageCollection.fromImages(monthlySeries);
  
  // Calculate trend using linear regression
  var trend = timeSeries.select('VV').reduce(ee.Reducer.linearFit());
  
  return {
    timeSeries: timeSeries,
    trend: trend
  };
}

// === ADVANCED VISUALIZATION FEATURES ===
function createAdvancedVisualizations() {
  // Create custom color palettes
  var floodPalette = ['#000080', '#0000FF', '#0080FF', '#00FFFF', '#FFFFFF', '#FFFF00', '#FF8000', '#FF0000'];
  var vegetationPalette = ['#004400', '#008800', '#00CC00', '#88FF88', '#FFFFFF', '#FFCC00', '#FF8800', '#FF0000'];
  
  // Enhanced flood visualization with custom palette
  Map.addLayer(analysis.vvDiff, {
    min: -5,
    max: 5,
    palette: floodPalette
  }, 'Enhanced Flood Detection (Custom Palette)', false);
  
  // Vegetation impact with custom palette
  Map.addLayer(analysis.vhDiff, {
    min: -3,
    max: 3,
    palette: vegetationPalette
  }, 'Enhanced Vegetation Impact (Custom Palette)', false);
  
  // Add population density overlay
  var popAnalysis = populationImpactAnalysis();
  Map.addLayer(popAnalysis.population, {
    min: 0,
    max: 1000,
    palette: ['white', 'yellow', 'orange', 'red']
  }, 'Population Density', false);
  
  // Add landcover overlay
  var landcoverAnalysis = landcoverImpactAnalysis();
  Map.addLayer(landcoverAnalysis.landcover, {
    min: 10,
    max: 100,
    palette: ['#006400', '#FFBB22', '#FFFF4C', '#F096FF', '#FA0000', '#B4B4B4', '#0064C8', '#0096A0', '#00CF75', '#FAE6A0']
  }, 'Landcover Classification', false);
}

// === EXPORT ENHANCED FEATURES ===
function exportEnhancedFeatures() {
  // Create comprehensive analysis package
  var enhancedPackage = ee.Image.cat([
    analysis.vvDiff.rename('VV_change'),
    analysis.vhDiff.rename('VH_change'),
    populationImpactAnalysis().population.rename('population_density'),
    landcoverImpactAnalysis().landcover.rename('landcover'),
    timeSeriesTrendAnalysis().trend.select('scale').rename('temporal_trend')
  ]);
  
  // Export options (uncomment to use)
  // Export.image.toDrive({
  //   image: enhancedPackage,
  //   description: 'Kaziranga_enhanced_analysis',
  //   region: aoi,
  //   scale: 10,
  //   maxPixels: 1e9,
  //   crs: 'EPSG:4326'
  // });
  
  return enhancedPackage;
}

// === PRESENTATION READY OUTPUTS ===
function generatePresentationOutputs() {
  // Create summary statistics for presentation
  var summary = {
    floodArea: ee.Number(floodAnalysis.areas.threshold_2.get('VV')).divide(1e6),
    vegetationLoss: ee.Number(vegetationAnalysis.areas.severe.get('VH')).divide(1e6),
    affectedPopulation: ee.Number(populationImpactAnalysis().affected.get('population')).divide(1000),
    totalPopulation: ee.Number(populationImpactAnalysis().total.get('population')).divide(1000)
  };
  
  print('=== PRESENTATION SUMMARY ===');
  print('Flooded Area: ' + summary.floodArea + ' sq. km');
  print('Vegetation Loss Area: ' + summary.vegetationLoss + ' sq. km');
  print('Affected Population: ' + summary.affectedPopulation + ' thousand people');
  print('Total Population in AOI: ' + summary.totalPopulation + ' thousand people');
  
  return summary;
}

// === EXECUTE ENHANCED FEATURES ===
// Note: Run the main analysis script first to have the 'analysis' object available

// Uncomment the following lines to run specific enhancements:

// var animation = createAnimatedGIF();
// var popImpact = populationImpactAnalysis();
// var landcoverImpact = landcoverImpactAnalysis();
// var pauliDecomp = polarizationDecomposition();
// var timeSeries = timeSeriesTrendAnalysis();
// createAdvancedVisualizations();
// var enhancedExport = exportEnhancedFeatures();
// var presentationSummary = generatePresentationOutputs();

print('=== ENHANCEMENT SCRIPTS LOADED ===');
print('Uncomment specific functions to run enhanced features');
print('Available enhancements:');
print('- Animated GIF generation');
print('- Population impact assessment');
print('- Landcover integration');
print('- Polarization decomposition');
print('- Time series trend analysis');
print('- Advanced visualizations');
print('- Presentation-ready outputs');
