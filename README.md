# 🌏 Through the Radar Looking Glass: Revealing Earth Processes with SAR

**An Advanced Sentinel-1 Change Detection Workflow in Google Earth Engine**

## 📋 Project Overview

This project demonstrates advanced SAR (Synthetic Aperture Radar) analysis using Sentinel-1 data to detect and quantify environmental changes, specifically focusing on flood dynamics in Kaziranga National Park, Assam, India.

### 🎯 Key Features
- **Dual-polarization analysis** (VV/VH) for comprehensive change detection
- **Multi-temporal comparison** with before/after flood scenarios
- **Quantitative flood area calculation** using GEE reducers
- **Integration with optical data** (Sentinel-2 NDWI) for validation
- **Research-grade methodology** suitable for hackathon presentation

## 🗺️ Area of Interest (AOI)

**Primary AOI: Kaziranga National Park, Assam (26.6°N, 93.4°E)**
- Prone to seasonal flooding from the Brahmaputra River
- Dense vegetation + open floodplains provide ideal SAR contrast
- Rich ecological significance for storytelling
- Excellent Sentinel-1 coverage

**Alternative AOIs:**
- Ranni–Pathanamthitta, Kerala (flood-prone)
- Dehradun–Tehri, Uttarakhand (landslide/deforestation)
- Bhuj–Kutch region, Gujarat (arid surface change)

## 🚀 Quick Start (2-Hour Hackathon Workflow)

### Phase 1: Data & Setup (10-15 min)
1. Open [Google Earth Engine Code Editor](https://code.earthengine.google.com/)
2. Copy the script from `gee_scripts/curiousar_flood_detection.js`
3. Run the script to load and preprocess Sentinel-1 data

### Phase 2: Advanced Analysis (30 min)
- Execute the complete SAR change detection workflow
- Generate before/after composites
- Compute VV difference and VH/VV ratio change maps

### Phase 3: Interpretation (15-30 min)
- Analyze SAR signals using the interpretation guide
- Calculate quantitative flood metrics
- Generate presentation materials

### Phase 4: Deliverables (30 min)
- Create 5-6 slide presentation
- Export key visualizations
- Prepare quantitative results

## 📁 Project Structure

```
SAR/
├── README.md                           # This file
├── gee_scripts/                        # Google Earth Engine scripts
│   ├── curiousar_flood_detection.js    # Main SAR analysis script
│   ├── quantitative_analysis.js        # Flood area calculations
│   └── enhancement_scripts.js          # Optional advanced features
├── analysis_guides/                    # Interpretation documentation
│   ├── sar_signal_interpretation.md    # SAR signal meaning guide
│   └── methodology.md                  # Technical methodology
├── presentation/                       # Presentation materials
│   ├── slides.md                       # Slide content and structure
│   ├── storyline.md                    # Presentation narrative
│   └── visual_assets/                  # Screenshots and diagrams
└── results/                           # Output files and exports
    ├── sample_outputs/                 # Example results
    └── export_instructions.md          # How to export from GEE
```

## 🔬 Scientific Methodology

### SAR Change Detection Approach
1. **Data Preprocessing**: Orbit filtering, speckle reduction, radiometric calibration
2. **Multi-temporal Analysis**: Before/after flood period comparison
3. **Dual-polarization Processing**: VV and VH band analysis
4. **Change Indicators**: VV difference, VH difference, VH/VV ratio change
5. **Validation**: Integration with Sentinel-2 NDWI for optical validation

### Key Metrics
- **Flood Extent**: Calculated using VV backscatter threshold
- **Vegetation Impact**: Assessed through VH polarization changes
- **Surface Roughness**: Evaluated via VH/VV ratio variations

## 🎨 Visualization Strategy

### Color Schemes
- **VV Difference**: Blue (decrease) → White (no change) → Red (increase)
- **VH/VV Ratio**: Purple (decrease) → White (no change) → Yellow (increase)
- **NDWI Overlay**: Brown (dry) → Cyan (water)

### Map Layers
1. VV Before (baseline conditions)
2. VV After (post-flood conditions)
3. VV Difference (change detection)
4. VH/VV Ratio Change (polarization analysis)
5. NDWI Overlay (optical validation)

## 📊 Expected Deliverables

| Output | Tool | Time |
|--------|------|------|
| 2 PNGs (before/after VV) | EO Browser or GEE | 10 min |
| 1 Diff map (VV_diff + VH/VV ratio) | GEE | 30-45 min |
| Flood area value (km²) | GEE Reducer | 10 min |
| 5-6 Slide Deck | PowerPoint/Canva | 30 min |

## 🧠 Storyline for Presentation

*"We looked at Kaziranga through the radar's eyes — unaffected by clouds or night. Sentinel-1's microwave pulses revealed the hidden extent of flooding invisible to optical sensors. By comparing VV and VH polarizations before and after the monsoon, we quantified not just water spread but vegetation loss, mapping nature's response to recurring floods. The same framework can scale to any disaster — from floods to landslides — proving how radar truly lets us see beneath the clouds."*

## 🔧 Technical Requirements

- Google Earth Engine account
- Basic understanding of SAR principles
- Access to Sentinel-1 and Sentinel-2 data
- Image processing software (optional)

## 📚 References

- Sentinel-1 User Guide
- SAR Change Detection Best Practices
- Google Earth Engine Documentation
- Kaziranga National Park Ecological Studies

## 🤝 Contributing

This is a hackathon project designed for rapid prototyping and demonstration. Feel free to adapt the methodology for different AOIs or environmental phenomena.

## 📄 License

Open source - suitable for educational and research purposes.
