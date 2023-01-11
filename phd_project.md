---
layout: page
title: PhD Project
categories: media
---

Thesis title:

<h1 style="text-align: center;">“MACHINE LEARNING FOR REMOTE SENSING AND MODELLING OF MOUNTAIN SNOW PATCHES”</h1>


![IMG_3850](https://user-images.githubusercontent.com/48015835/211348290-decc3434-a230-493c-9f77-85d0d1653257.jpeg)


## Scientific background and motivation

Anthropogenic climate change is causing the mountain cryosphere (snow, ice, and permafrost) to deteriorate rapidly, a trend that is expected to accelerate over the coming decades. The impacts of this decline will extend far beyond the mountains and affect physical, biological and human systems in the surrounding lowlands, with changes evident even in the oceans. Mountain snow provides many services as a store of water, a habitat and a playground, but also poses threats as a flood and avalanche risk because it is highly sensitive to climate variability and change. The high spatial variability of snow in mountains, compared with the resolutions of satellite sensors and models, makes measuring and forecasting  snow cover characteristics particularly difficult in the very environments they are most needed. Even in the maritime climate of Scotland, snow can persist throughout the summer in favourable mountain locations. In fact, until recently, some highland corries would house perennial snow patches for many decades without seeing them melt. The fine balance between preferential snow deposition in winter and sheltering in summer makes predicting the distribution of these snow patches a rigorous test for the kind of physically based snow models used in climate projection and impacts studies. The motivation for my project is to use newly available high resolution remote sensing and meteorological modelling with machine learning to improve understanding of the climate sensitivity of mountain snow.

![snow_patch](https://user-images.githubusercontent.com/48015835/211348932-65fc369d-f5af-44c2-84aa-e19a0ca85b9a.jpg)

## Aims and objectives of the PhD project

Artificial Neural Network (ANN) methods will be applied to three problems:

   1. Remote sensing of mountain snow cover in Scotland.
   2. Downscaling meteorological variables over mountain topography.
   3. Constraining physical models of snow mass and energy balances driven with meteorological variables and evaluated with remote sensing.


## Methodology

Step 1. Remote sensing of snow cover is most often achieved using differences between visible and near-infrared channels to distinguish snow from cloud, normalized to compensate for variations in illumination and viewing conditions, and thresholded to distinguish snow from snow-free ground. However, multispectral imagers and snow reflectance models actually provide much more information on snow structure and contaminants that can be exploited with machine learning. Training sets will be developed and used to train ANNs to discriminate snow specifically for snow conditions occurring in the Cairngorms. Initially, I am focusing on using optical imagery from NASA’s Moderate Resolution Imaging Spectroradiometer (MODIS) and ESA’s Sentinel-2 with the potential to extend to Synthetic Aperture Radar (SAR) datasets.

![IMG_3836](https://user-images.githubusercontent.com/48015835/211349249-a5f7d1cc-a4a7-4443-9c37-3b0c5b54fe76.jpeg)

Step 2. Weather stations that could provide inputs for snow models are sparse and difficult to maintain in the mountains (epitomized in the above image). Numerical Weather Prediction (NWP) at 1 km resolution and Computational Fluid Dynamics (CFD) models at higher resolutions are now available but limited in spatial and temporal coverage. Hydrological forecasting and impacts models generally use simple elevation lapse rates to downscale meteorological variables, but some variables – precipitation and wind, in particular – clearly do not behave in such simple ways. Machine learning will be used to identify patterns in NWP and CFD model outputs that can be used for downscaling.

Step 3. A high-resolution, physically-based snow model will be driven with downscaled meteorology and evaluated with remote sensing products developed in this project. Some of the processes required in models of this type, such as shading of snow on slopes, are well understood but require expensive simulations at high resolutions. Other processes, such as wind erosion, turbulent transport and re-deposition of snow, are poorly understood and heavily parametrized. Physical constraints of mass and energy conservation will be incorporated into machine learning of snow patterns, using meteorological variables and topographic metrics as inputs to gain insight into the relative importance of factors contributing to the preservation of late-lying snow patches.

Fieldwork for this project will be focused close to home enabling a fast response to favourable weather conditions and limiting our carbon footprint. There will be a heavy focus on the Cairngorms, take advantage of connections with existing hydrometeorological measurements in the Feshie and Coire Cas catchments of the Cairngorms.
