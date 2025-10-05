# 🚀 CuriouSAR: Quick Start Guide

## Get Started in 2 Hours - Hackathon Ready!

This guide will get you up and running with the CuriouSAR SAR change detection workflow in under 2 hours, perfect for hackathon presentations.

## ⏱️ 2-Hour Timeline

### Phase 1: Setup (15 minutes)
- [ ] Create Google Earth Engine account
- [ ] Open GEE Code Editor
- [ ] Copy main analysis script
- [ ] Configure AOI and dates

### Phase 2: Analysis (45 minutes)
- [ ] Run main SAR analysis
- [ ] Generate change detection maps
- [ ] Calculate quantitative results
- [ ] Validate with optical data

### Phase 3: Results (30 minutes)
- [ ] Export key visualizations
- [ ] Prepare presentation materials
- [ ] Generate statistics summary
- [ ] Create interpretation guide

### Phase 4: Presentation (30 minutes)
- [ ] Create slide deck
- [ ] Prepare storyline
- [ ] Practice presentation
- [ ] Prepare Q&A responses

---

## 🎯 Step-by-Step Instructions

### Step 1: Google Earth Engine Setup (5 minutes)

1. **Create Account**
   - Go to [Google Earth Engine](https://earthengine.google.com/)
   - Sign up with Google account
   - Wait for approval (usually instant for educational use)

2. **Open Code Editor**
   - Navigate to [Code Editor](https://code.earthengine.google.com/)
   - Create new script
   - Clear default code

### Step 2: Load Analysis Script (5 minutes)

1. **Copy Main Script**
   - Open `gee_scripts/curiousar_flood_detection.js`
   - Copy entire script
   - Paste into GEE Code Editor

2. **Verify Configuration**
   - Check AOI coordinates (Kaziranga: 26.6°N, 93.4°E)
   - Verify date ranges (May vs July 2024)
   - Confirm buffer radius (25km)

### Step 3: Run Analysis (30 minutes)

1. **Execute Script**
   - Click "Run" button
   - Wait for processing (5-10 minutes)
   - Check console for results

2. **Review Results**
   - Examine change detection maps
   - Check quantitative statistics
   - Verify visualization layers

3. **Validate Results**
   - Compare with NDWI overlay
   - Check spatial coherence
   - Verify magnitude ranges

### Step 4: Export Results (15 minutes)

1. **Export Key Maps**
   - Uncomment export code
   - Run export tasks
   - Download from Google Drive

2. **Generate Statistics**
   - Copy console output
   - Create summary table
   - Calculate key metrics

### Step 5: Create Presentation (30 minutes)

1. **Prepare Slides**
   - Use `presentation/slides.md` template
   - Add your specific results
   - Include key visualizations

2. **Practice Storyline**
   - Follow `presentation/storyline.md`
   - Time your presentation
   - Prepare for Q&A

---

## 🔧 Configuration Options

### AOI Selection
```javascript
// Primary: Kaziranga National Park
var aoi = ee.Geometry.Point([93.4, 26.6]).buffer(25000);

// Alternative: Kerala Floods
// var aoi = ee.Geometry.Point([76.8, 9.3]).buffer(25000);

// Alternative: Uttarakhand Landslides
// var aoi = ee.Geometry.Point([78.1, 30.3]).buffer(25000);
```

### Temporal Windows
```javascript
// Monsoon Season (Recommended)
var beforeStart = '2024-05-01';
var beforeEnd   = '2024-05-30';
var afterStart  = '2024-07-01';
var afterEnd    = '2024-07-30';

// Alternative: Pre/Post Monsoon
// var beforeStart = '2024-04-01';
// var beforeEnd   = '2024-04-30';
// var afterStart  = '2024-08-01';
// var afterEnd    = '2024-08-30';
```

### Analysis Parameters
```javascript
// Flood Detection Threshold
var floodThreshold = -2;  // dB

// Vegetation Impact Threshold
var vegetationThreshold = -1;  // dB

// Speckle Filter Size
var speckleFilter = 50;  // meters
```

---

## 📊 Expected Results

### Quantitative Outputs
- **Flooded Area**: 50-200 km²
- **Vegetation Loss**: 30-150 km²
- **Flood Percentage**: 10-40% of study area
- **Accuracy**: 85-95% for flood detection

### Visual Outputs
- **VV Difference Map**: Blue areas = flooded
- **VH Difference Map**: Red areas = vegetation loss
- **VH/VV Ratio Map**: Purple areas = smoother surfaces
- **NDWI Overlay**: Cyan areas = water validation

### Statistical Summary
```
=== QUANTITATIVE RESULTS ===
Flooded Area (sq. km): 125.4
Vegetation Loss Area (sq. km): 89.7
Total Study Area (sq. km): 1963.5
Flood Percentage: 6.4%
```

---

## 🎨 Presentation Ready Outputs

### Key Visualizations
1. **Before/After Comparison**: VV backscatter
2. **Change Detection Map**: VV difference
3. **Vegetation Impact**: VH difference
4. **Validation**: NDWI overlay
5. **Statistics Dashboard**: Quantitative results

### Slide Content
- **Title**: "Through the Radar Looking Glass"
- **Problem**: Cloud cover during monsoon
- **Solution**: SAR change detection
- **Results**: Quantitative flood assessment
- **Impact**: Real-world applications

### Storyline Elements
- **Hook**: "Seeing through clouds with radar"
- **Science**: Dual-polarization analysis
- **Results**: Quantified flood impact
- **Applications**: Emergency response
- **Vision**: Global disaster monitoring

---

## 🚨 Troubleshooting

### Common Issues

**Script Won't Run**
- Check GEE account approval
- Verify internet connection
- Clear browser cache
- Try different browser

**No Data Available**
- Check date ranges
- Verify AOI location
- Try different time periods
- Check data availability

**Poor Results**
- Adjust thresholds
- Increase temporal window
- Apply stronger filtering
- Check orbit consistency

**Export Fails**
- Reduce file size
- Check GEE quotas
- Use lower resolution
- Try different format

### Quick Fixes

**Low Change Detection**
```javascript
// Reduce threshold
var floodThreshold = -1;  // More sensitive

// Increase temporal window
var beforeStart = '2024-04-15';
var beforeEnd   = '2024-05-15';
```

**High Noise Levels**
```javascript
// Increase speckle filtering
.focal_median(100, 'circle', 'meters')

// Use more images
.filterDate(start, end)
```

**Export Issues**
```javascript
// Reduce resolution
scale: 30,  // Instead of 10

// Reduce region size
var aoi = ee.Geometry.Point([93.4, 26.6]).buffer(15000);
```

---

## 📚 Additional Resources

### Documentation
- `README.md`: Complete project overview
- `analysis_guides/`: Technical methodology
- `presentation/`: Slide templates and storyline
- `results/`: Export instructions and examples

### Scripts
- `curiousar_flood_detection.js`: Main analysis
- `quantitative_analysis.js`: Advanced metrics
- `enhancement_scripts.js`: Optional features

### Support
- GEE Documentation: [developers.google.com/earth-engine](https://developers.google.com/earth-engine)
- Community Forum: [groups.google.com/g/google-earth-engine-developers](https://groups.google.com/g/google-earth-engine-developers)
- Stack Overflow: [stackoverflow.com/questions/tagged/google-earth-engine](https://stackoverflow.com/questions/tagged/google-earth-engine)

---

## 🎯 Success Criteria

### Technical Success
- [ ] Script runs without errors
- [ ] Change detection maps generated
- [ ] Quantitative results calculated
- [ ] Validation completed

### Presentation Success
- [ ] Clear before/after comparison
- [ ] Quantified flood impact
- [ ] Validated methodology
- [ ] Real-world applications

### Impact Success
- [ ] Demonstrates SAR advantage
- [ ] Shows scalable methodology
- [ ] Provides actionable insights
- [ ] Engages audience

---

## 🏆 Hackathon Tips

### Time Management
- **Stick to timeline**: Don't get lost in details
- **Focus on results**: Show impact, not just process
- **Prepare backup**: Have simplified version ready
- **Practice presentation**: Time your delivery

### Technical Tips
- **Start simple**: Get basic analysis working first
- **Iterate quickly**: Make small improvements
- **Document issues**: Note problems and solutions
- **Test exports**: Verify you can share results

### Presentation Tips
- **Lead with impact**: Start with the problem
- **Show, don't tell**: Use visualizations
- **Quantify results**: Numbers matter
- **End with vision**: Show future potential

### Judging Tips
- **Demonstrate innovation**: Show what's new
- **Prove scalability**: Show global potential
- **Show impact**: Real-world applications
- **Engage audience**: Make it memorable

---

## 🚀 Ready to Start?

1. **Open Google Earth Engine Code Editor**
2. **Copy the main script from `gee_scripts/curiousar_flood_detection.js`**
3. **Follow the 2-hour timeline above**
4. **Use the presentation materials in `presentation/`**
5. **Export results using `results/export_instructions.md`**

**Good luck with your hackathon presentation!** 🎉

Remember: The goal is to demonstrate the power of SAR for Earth monitoring, not to build a perfect system. Focus on showing impact and scalability.
