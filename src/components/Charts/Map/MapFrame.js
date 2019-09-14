import React, { useState, useMemo } from 'react'
import { renderToStaticMarkup } from 'react-dom/server';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { ComposableMap, ZoomableGroup, Geographies, Geography } from "react-simple-maps"

import ReactTooltip from "react-tooltip"

import { Box } from '@material-ui/core';

import { feature } from "topojson-client"

import colormaps from '../../../color'

import chroma from "chroma-js";

import parser from 'csv-parse'
const csvParser = parser({
    cast: function (value, context) {
        if (context.lines === 1) {
            return value
        }
        return Number(value)
    }
})


const useStyles = makeStyles(theme => ({
    mapContainer: {
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
    },
    mapColorLegendContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    mapColorLegend: {
        minHeight: "30px",
    },
    zoomContainer: {
        width: '100%',
        textAlign: "center",
    },
}));

const CustomToolTip = (props) => {
    const { selectedParameters, properties } = props
    return <div>
        {selectedParameters.map((key, i) => {
            return <p key={i}>{key}: {properties[key]}</p>
        })}
    </div>
}

const MapFrame = (props) => {
    const classes = useStyles()

    // ----------------- to remove (ignore) ---------------------
    const [mapCetner, setMapCetner] = useState([0, 20])
    const [mapZoom, setMapZoom] = useState(1)
    const columnChoice = "1980head"

    const mapTooltip = {
        AREA_CALC: true,
        BASIN_ID: true,
        DRAINAGE: true,
        IN_OUT: false,
        MQ_M3_S: false,
        VOL_KM3: false,
    }
    const mapData = require('../../../data/GRDC_405_basins_from_mouth.json')
    const mapFeatures = feature(mapData, mapData.objects[Object.keys(mapData.objects)[0]]).features
    const colors = colormaps['parula'][10]
    const mapDataInfo = {
        'name': "1980-2017_livestock_head_total",
        'primaryKey': "BASIN_ID",
        'headers': ["1980head", "1981head", "1982head", "1983head", "1984head", "1985head", "1986head", "1987head", "1988head", "1989head", "1990head", "1991head", "1992head", "1993head", "1994head", "1995head", "1996head", "1997head", "1998head", "1999head", "2000head", "2001head", "2002head", "2003head", "2004head", "2005head", "2006head", "2007head", "2008head", "2009head", "2010head", "2011head", "2012head", "2013head", "2014head", "2015head", "2016head", "2017head"]
    }

    let start = 0

    let headers = []

    // const findIndexInRange = (n) => {
    //     if (n >= thresholds[0]) {
    //         return 0
    //     }
    //     for (let i = 0; i < thresholds.length - 1; i++) {
    //         if (n <= thresholds[i] && n >= thresholds[i + 1]) {
    //             return i
    //         }
    //     }
    //     return thresholds.length - 1
    // }

    // if (mapFeatures === undefined) {
    //     return (null)
    // }

    // // ----------------- to remove (ignore) ---------------------

    // // ----------------- restore later  -------------------------
    // // following property will receive value from server
    // // currently, it is replaced with hardcoded values
    // const { mapTooltip, mapFeatures } = props
    // const { mapDataInfo } = props
    // const { colors, thresholds } = props

    // // following property will change based on user's selections
    // const { columnChoice } = props

    // const [mapZoom, setMapZoom] = useState(1)
    // const [mapCetner, setMapCetner] = useState([0, 20])

    // const findIndexInRange = (n) => {
    //     if (n >= thresholds[0]) {
    //         return 0
    //     }
    //     for (let i = 0; i < thresholds.length - 1; i++) {
    //         if (n <= thresholds[i] && n >= thresholds[i + 1]) {
    //             return i
    //         }
    //     }
    //     return thresholds.length - 1
    // }

    // // ----------------- restore later  -------------------------

    if (mapFeatures === undefined) {
        return (null)
    }

    const columnHeader = mapDataInfo === undefined ? undefined : mapDataInfo.headers[columnChoice]

    const selectedParameters = Object.keys(mapTooltip).filter(key => mapTooltip[key])
    if (columnHeader !== undefined) {
        selectedParameters.push(columnHeader)
    }

    return <Grid container className={classes.mapContainer}>
        <Grid container item alignItems="center">
            <Grid item xs={12}>
                <ComposableMap projectionConfig={{ scale: 180 }}>
                    <ZoomableGroup center={mapCetner} onMoveEnd={(coord) => { setMapCetner(coord) }}
                        zoom={mapZoom} style={{ width: "100%", height: "auto", }}>
                        <Geographies geography={mapFeatures}>
                            {(geographies, projection) => geographies.map((geography, i) => {
                                const tooltip = renderToStaticMarkup(React.createElement(CustomToolTip, { 'selectedParameters': selectedParameters, 'properties': geography.properties }, null))
                                let baseColor;
                                if (columnHeader !== undefined) {
                                    baseColor = colors[Math.floor(Math.random()) * 10]
                                } else {
                                    baseColor = "#ECEFF1"
                                }
                                return <Geography
                                    key={i}
                                    data-tip={tooltip}
                                    geography={geography}
                                    projection={projection}
                                    style={{
                                        default: {
                                            fill: baseColor,
                                            stroke: "#607D8B",
                                            strokeWidth: 1,
                                            outline: "none",
                                        },
                                        hover: {
                                            fill: baseColor,
                                            stroke: "#607D8B",
                                            strokeWidth: 1,
                                            outline: "none",
                                        },
                                        pressed: {
                                            fill: baseColor,
                                            stroke: "#607D8B",
                                            strokeWidth: 1,
                                            outline: "none",
                                        },
                                    }}
                                />
                            })}
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
                <ReactTooltip html={true} />
            </Grid>
        </Grid>
        <Grid item xs={12} className={classes.zoomContainer}>
            <button onClick={() => { if (mapZoom < 6) { setMapZoom(mapZoom + 1) } }}>zoom in</button>
            &nbsp;&nbsp;&nbsp;&nbsp;
                <button onClick={() => { if (mapZoom > 1) { setMapZoom(mapZoom - 1) } }}>zoom out</button>
            &nbsp;&nbsp;&nbsp;&nbsp;
                <button onClick={() => { setMapCetner([0, 20]); if (mapZoom !== 1) { setMapZoom(1) } }}>reset</button>
        </Grid>
    </Grid>
}

export default MapFrame