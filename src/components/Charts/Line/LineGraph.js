import React, { useEffect, useRef, Component } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Row, Col } from 'reactstrap';
import * as d3 from 'd3';
import * as Label from "d3-area-label"

		//useEffect( () => {
		//}, [this.props.data, svgDataGraph])

function darkenHexColor(color) {
	const componentToHex = (c) => {
	  var hex = c.toString(16);
	  return hex.length == 1 ? "0" + hex : hex;
	}
	
	const rgbToHex = (r, g, b) => {
	  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}

	const hexToRgb = hex => hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(m, r, g, b) => '#' + r + r + g + g + b + b).substring(1).match(/.{2}/g).map(x => parseInt(x, 16))

	var rgbColor = hexToRgb(color)
	rgbColor[0]	-= 0.34 * rgbColor[0]
	rgbColor[1]	-= 0.34 * rgbColor[1]
	rgbColor[2]	-= 0.34 * rgbColor[2]
	return rgbToHex(Math.floor(rgbColor[0]), Math.floor(rgbColor[1]), Math.floor(rgbColor[2]))
}

function handleDataDraw(props, svgDataGraph) {
	console.log(props.data)
	if (props.data && svgDataGraph.current) {
		graph = d3.select(svgDataGraph.current).selectAll("svg").remove()
		var graph = d3.select(svgDataGraph.current).
			append("svg")

		graph = d3.select(svgDataGraph.current).selectAll("svg")
		.attr("width", "100%")
		.attr("height", "100%")
		if (props.data === undefined || props.data.length === 0 )
			return;

		const width = svgDataGraph.current.clientWidth
		const height = svgDataGraph.current.clientHeight - 50 
		
		const createData = (data) => {
			var formattedData = d3.range(data[0]["data"].length).map((d, rowIndex) => {
				var rowFormattedResult = { "year"  : data[0]["data"][rowIndex]["x"] }
				data.forEach(row => {
					rowFormattedResult[row["id"]] = row["data"][rowIndex]["y"]
				})	
				return rowFormattedResult 
      		})
			formattedData["keys"] = []
			for (var index in data)
				formattedData["keys"].push(data[index]["id"])	
			return formattedData
		}

		const domainLogScale = (val, base) => {
		  if ( val <= 0 )
		  	return val
		  return Math.log(val, base)
		}

		const stack = d3.stack()
		const formattedData = createData(props.data, "year")
		const xValue = d => d.year
		const xScale = d3.scaleTime()
		const yScale = d3.scaleLinear()
		const colorScale = d3.scaleOrdinal().range(d3.schemeCategory10)
		
		const areaPlot = d3.area()
			.x( d => xScale(xValue(d.data)))
			.y0(d => { return yScale(d[0]) } )
			.y1(d => { return yScale(d[1]) } )
//        	.curve(d3.curveBasis)


      	const render = (data) => {
      	  colorScale.domain(data.keys)
      	  const stacked = stack.keys(data.keys)(data)

		  xScale
		    .domain(d3.extent(data, d => xValue(d)))
		    .range([50, width])
		    .ticks()
		    .push(1)

      	  yScale
   		    .domain([d3.min(stacked[0], d => d[0]), d3.max(stacked[stacked.length - 1], d => {return d[1] + d[1] * 0.07})])
      	    .range([height, 0])

      	  const transition = d3.transition().duration(1000)
			
		  var sheet = window.document.styleSheets[0];
		  sheet.insertRule('path:hover { opacity: 0.8; }', sheet.cssRules.length);
		  sheet.insertRule('text { pointer-events: none; }', sheet.cssRules.length);

      	  const paths = graph.selectAll('path')
      	  paths
			.data(stacked)
			.attr('pointer-events', 'all')
      	    .enter()
			.append('path')
      	    .merge(paths)
      	    .attr('fill', d => {return colorScale(d.key)})
      	    .attr('stroke', d => colorScale(d.key))
      	    .transition(transition)
      	    .attr('d', areaPlot)

		    var points = graph.selectAll("dot").data(stacked[0])
		  for (var dataIndex in stacked) {
		    graph.selectAll("dot").data(stacked[dataIndex])
    	    .enter()
		    .append("circle")
	        .attr("r", 3)
		    .attr('fill', d => darkenHexColor(colorScale(stacked[dataIndex].key)))
      	    .transition(transition)
       	    .attr("cx", d => xScale(xValue(d.data)))
       	    .attr("cy", d => yScale(d[1]))
		  }

      	  const labels = graph.selectAll('text').data(stacked)
      	  labels
      	    .enter()
			.append('text')
      	    .attr('class', 'area-label')
			.attr('fill', d => darkenHexColor(colorScale(d.key)))
      	    .merge(labels)
      	    .text(d => d.key)
      	    .transition(transition)
      	    .attr('transform', Label.areaLabel(areaPlot).interpolateResolution(1000))

		  //X-AXIS
		  graph.append("text")
      	  .attr("text-anchor", "end")
      	  .attr("x", width)
      	  .attr("y", height+40 )
      	  .text("Time (year)");

		  var ticks = []
		  for (var i = 0; i < stacked[0].length; ++i) 
			ticks.push(i)

		  var tickValues = ticks.map( function(t) { return stacked[0][t].data.year; });

		  function isMajorTick(i) { return i % 3 == 0}
		  var xAxis = d3.axisBottom(xScale)
        	.tickSize(10)
        	.tickValues(tickValues)
        	.tickFormat(function (d, i) {
           return isMajorTick(i) ? d : "";
         });

  		  var x_axis = graph.append("g")
    	  .attr("transform", "translate(0," + height + ")")
    	  .call(xAxis)
		  

		  //Y-AXIS
          var y_axis = graph.append("g")
    	  .attr("transform", "translate(50,0)")
          .call(d3.axisLeft(yScale).ticks(5))
      	}

		render(formattedData)
	}
}

export default function LineGraph(props) {
        // set if area shown
        const div = props.data.length===0?
                    1:
                    Math.max(Math.floor(props.data[0].data.length/10),1);

        const min = props.stacked ? 0 : (props.min_value * 0.9); const max = props.stacked ? props.max_stacked * 1.1 : props.max_value * 1.1;

        var yDiv = 1;
        var mul = 0;
        while(Math.abs(max / yDiv) >= 1000){
            yDiv *= 1000;
            mul += 3;
        }
        while(Math.abs(max / yDiv) < 1){
            yDiv /= 1000;
            mul -= 3;
        }

        const title =   mul===0 ? props.title :
                        props.title + " x 10^" + mul.toString();
		
		var displayData = props.data;
		//for (var i = 0; i < displayData[1]["data"].length; ++i)
		//		if (displayData[1]["data"][i] != null && displayData[1]["data"][i] != undefined) {
		//			displayData[1]["data"][i]["y"] *= 1000000000
		//		}
	
		const svgDataGraph = useRef();
		useEffect(() => {
			handleDataDraw(props, svgDataGraph)
		}, [props, svgDataGraph])	

        return (
        	<div id="dp-graphdiv" style={{ height: "600px", width: "100%" }} ref={ svgDataGraph }>
        	</div>
        );
    }


//sliceTooltip={({ slice }) => {
//    // custom tooltip for stacked and not stacked
//	console.log(slice)
//    return (
//		<div>
//		</div>
//	)
//}}
//
//var colors = this.props.colors;
//colors.push("#");
//<ResponsiveLine
//    style={{fontFamily:"Verdana"}}
//    data={displayData}
//    margin={{ top: 50, right: 25, bottom: 50, left: 70 }}
//    xScale={{ type: 'point', min: 'auto', max: 'auto' }}
//    yScale={{ type: 'linear', 
//                min: min, 
//                max: max}}
//    axisBottom={{
//        orient: 'bottom',
//        tickSize: 5,
//        tickPadding: 5,
//        tickRotation: 0,
//        legend: 'year',
//        legendOffset: 40,
//        legendPosition: 'middle',
//        format: (value,props) => { return (Number(value)%div ===0 &&value); },
//    }}
//    axisLeft={{
//        orient: 'left',
//        tickSize: 4,
//        tickPadding: 2,
//        tickRotation: 0,
//        legend: title,
//        legendOffset: -50,
//        legendPosition: 'middle',
//        format: (value,props) => { return Math.round(value/yDiv*10)/10; },
//    }}

//    labelFormat=".0s"
//    curve={this.props.curve}
//    enableSlices="y"
//    colors={colors}
//    pointSize={10}
//    pointColor="#ffffff"
//    enableArea={this.props.area}
//	enablePoints={true}
//    areaOpacity={0.7}
//    pointBorderWidth={2}
//    pointBorderColor={{ from: 'serieColor' }}
//    useMesh={false}

///>
