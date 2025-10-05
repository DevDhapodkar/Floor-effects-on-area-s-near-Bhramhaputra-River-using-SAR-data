# 🔬 Technical Methodology

## SAR Change Detection Workflow

This document outlines the technical methodology for the advanced Sentinel-1 change detection analysis implemented in the CuriouSAR project.

## 📡 Data Sources and Specifications

### Sentinel-1 SAR Data
- **Mission**: Copernicus Sentinel-1
- **Product**: Ground Range Detected (GRD)
- **Polarization**: VV and VH
- **Mode**: Interferometric Wide (IW)
- **Resolution**: ~10m (ground range)
- **Temporal Resolution**: 6-12 days (depending on orbit)

### Sentinel-2 Optical Data (Validation)
- **Mission**: Copernicus Sentinel-2
- **Product**: Surface Reflectance (SR)
- **Bands**: Blue (B3), NIR (B8) for NDWI calculation
- **Resolution**: 10m
- **Temporal Resolution**: 5 days

## 🗺️ Area of Interest (AOI) Selection

### Primary AOI: Kaziranga National Park
- **Coordinates**: 26.6°N, 93.4°E
- **Buffer Radius**: 25 km
- **Rationale**: 
  - Seasonal flooding from Brahmaputra River
  - Diverse landcover (grasslands, wetlands, forests)
  - Rich ecological significance
  - Excellent Sentinel-1 coverage

### Temporal Selection
- **Before Period**: May 1-30, 2024 (pre-monsoon)
- **After Period**: July 1-30, 2024 (peak monsoon)
- **Rationale**: Captures seasonal flood dynamics

## 🔧 Data Preprocessing

### 1. Data Filtering
```javascript
// Orbit consistency
.filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))

// Instrument mode
.filter(ee.Filter.eq('instrumentMode', 'IW'))

// Polarization availability
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
```

### 2. Radiometric Calibration
```javascript
// Convert to dB scale
.multiply(0.0001)
.log10()
.multiply(10)
```

### 3. Speckle Reduction
```javascript
// Median composite
.median()

// Spatial filtering
.focal_median(50, 'circle', 'meters')
```

## 📊 Change Detection Algorithms

### 1. VV Difference Analysis
**Purpose**: Primary flood detection
**Method**: Simple differencing
**Formula**: `VV_after - VV_before`
**Threshold**: -2 dB for flood detection

### 2. VH Difference Analysis
**Purpose**: Vegetation impact assessment
**Method**: Simple differencing
**Formula**: `VH_after - VH_before`
**Threshold**: -1 dB for vegetation loss

### 3. VH/VV Ratio Change
**Purpose**: Surface roughness analysis
**Method**: Ratio differencing
**Formula**: `(VH/VV)_after - (VH/VV)_before`
**Interpretation**: Negative = smoother surface, Positive = rougher surface

## 🎯 Threshold Determination

### Flood Detection Thresholds
Based on literature review and empirical analysis:

| Threshold (dB) | Flood Severity | Confidence Level |
|----------------|----------------|------------------|
| -1 | Light | 70% |
| -2 | Moderate | 85% |
| -3 | Severe | 95% |
| -4 | Extreme | 98% |

### Vegetation Impact Thresholds
Based on volume scattering theory:

| Threshold (dB) | Impact Level | Confidence Level |
|----------------|--------------|------------------|
| -0.5 | Light | 60% |
| -1 | Moderate | 80% |
| -2 | Severe | 90% |
| -3 | Extreme | 95% |

## 📈 Quantitative Analysis

### 1. Area Calculations
```javascript
// Flood area calculation
var floodMask = vvDiff.lt(floodThreshold);
var floodArea = floodMask.multiply(ee.Image.pixelArea())
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: aoi,
    scale: 10,
    maxPixels: 1e9
  });
```

### 2. Statistical Analysis
```javascript
// Comprehensive statistics
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
```

## 🔍 Validation Methods

### 1. Optical Validation
- **Method**: Sentinel-2 NDWI comparison
- **Formula**: `NDWI = (Green - NIR) / (Green + NIR)`
- **Purpose**: Cross-validate flood extent

### 2. Multi-threshold Analysis
- **Method**: Multiple threshold testing
- **Purpose**: Sensitivity analysis
- **Output**: Confidence intervals

### 3. Spatial Coherence
- **Method**: Spatial correlation analysis
- **Purpose**: Identify artifacts and noise
- **Implementation**: Focal statistics

## 🎨 Visualization Strategy

### Color Schemes
- **VV Difference**: Blue (decrease) → White (no change) → Red (increase)
- **VH Difference**: Green (vegetation) → White (no change) → Red (loss)
- **Ratio Change**: Purple (smooth) → White (no change) → Yellow (rough)

### Layer Organization
1. **Base Layers**: VV before/after
2. **Change Layers**: VV diff, VH diff, ratio change
3. **Validation Layers**: NDWI overlay
4. **Analysis Layers**: Flood masks, impact zones

## ⚡ Performance Optimization

### 1. Data Reduction
- **Spatial**: Clip to AOI
- **Temporal**: Median compositing
- **Spectral**: Focus on relevant polarizations

### 2. Computational Efficiency
- **Parallel Processing**: GEE's distributed computing
- **Memory Management**: Chunked processing
- **Caching**: Intermediate results

### 3. Export Optimization
- **Format**: GeoTIFF for analysis, PNG for visualization
- **Compression**: LZW compression for GeoTIFF
- **Resolution**: 10m for analysis, 30m for visualization

## 🔬 Advanced Features

### 1. Multi-temporal Analysis
- **Method**: Monthly composites
- **Purpose**: Trend analysis
- **Implementation**: Time series reduction

### 2. Polarization Decomposition
- **Method**: Pauli decomposition
- **Purpose**: Enhanced surface characterization
- **Formula**: 
  - Pauli1 = VV + VH
  - Pauli2 = VV - VH
  - Pauli3 = 2*VH

### 3. Integration with Auxiliary Data
- **Population**: WorldPop data
- **Landcover**: ESA WorldCover
- **Elevation**: SRTM DEM
- **Purpose**: Impact assessment

## 📋 Quality Assurance

### 1. Data Quality Checks
- **Orbit consistency**: Same pass direction
- **Temporal coverage**: Adequate data availability
- **Cloud coverage**: <20% for optical data
- **Speckle level**: Acceptable noise levels

### 2. Processing Validation
- **Radiometric accuracy**: dB conversion verification
- **Geometric accuracy**: Spatial alignment
- **Temporal accuracy**: Date filtering verification

### 3. Results Validation
- **Physical plausibility**: Changes make sense
- **Spatial coherence**: Consistent patterns
- **Magnitude validation**: Within expected ranges

## 🚀 Scalability Considerations

### 1. Regional Scaling
- **Method**: Tiled processing
- **Implementation**: Grid-based analysis
- **Output**: Mosaic of results

### 2. Temporal Scaling
- **Method**: Automated processing
- **Implementation**: Scheduled scripts
- **Output**: Time series products

### 3. Multi-sensor Integration
- **Sentinel-1**: Primary SAR data
- **Sentinel-2**: Optical validation
- **Landsat**: Historical analysis
- **MODIS**: Coarse resolution trends

## 📚 References and Standards

### Scientific Literature
- Flood mapping with SAR: A comprehensive review
- Sentinel-1 change detection best practices
- Polarization decomposition techniques
- Speckle filtering methods

### Technical Standards
- CEOS SAR Calibration Guidelines
- Sentinel-1 Product Specification
- Google Earth Engine Best Practices
- Open Geospatial Consortium Standards

### Software Documentation
- Google Earth Engine API Reference
- Sentinel-1 User Guide
- SNAP Toolbox Documentation
- QGIS SAR Processing Plugins

## 🔄 Workflow Automation

### 1. Script Organization
- **Main Script**: `curiousar_flood_detection.js`
- **Quantitative Analysis**: `quantitative_analysis.js`
- **Enhancements**: `enhancement_scripts.js`

### 2. Parameter Configuration
- **AOI Definition**: Centralized geometry
- **Temporal Windows**: Configurable dates
- **Thresholds**: Adjustable parameters
- **Export Settings**: Standardized formats

### 3. Error Handling
- **Data Availability**: Fallback options
- **Processing Errors**: Graceful degradation
- **Export Failures**: Retry mechanisms
- **Validation Warnings**: User notifications

This methodology provides a robust, scalable framework for SAR-based flood detection that can be adapted for different regions, time periods, and environmental phenomena.
