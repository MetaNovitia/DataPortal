import React, { useState, useEffect } from 'react';
import Slider from '@material-ui/core/Slider';
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import {Row} from 'reactstrap';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import lighten from '../../../lighten';

// styling slider to make mark bigger
const styles = {
    mark :{
        width:"2px",
        height:"5px",
        backgroundColor:"blue"
    }
}
const StyledSlider = withStyles(styles)(Slider);

const CustomNode = ({ node, x, y, size, blendMode, onMouseEnter, onMouseMove, onMouseLeave, onClick }) => {
    return (
        <g transform={`translate(${x},${y})`}>
        <circle
            r={size / 2}
            fill={node.data.color}
            style={{ mixBlendMode: blendMode }}
            onMouseEnter={onMouseEnter}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        />
        </g>
    );
}

const ScatterGraph = (props) => {

    const classes = props.classes

    const dataGenerator = props.dataGenerator;
    const [current, setCurrent] = useState([0,0]);
    useEffect(() => {
        const timer = setTimeout(() => {
            if(current[1]){
                setCurrent([(current[0] + 1)%dataGenerator.length,current[1]]);
            }
        }, 1400);
        return () => clearTimeout(timer);
    }, [current, setCurrent]);


    if(props.dataGenerator.length===0){
        current[0] = 0;
        return null;
    }
    
    if(current[0] >= props.dataGenerator.length){
        current[0] = props.dataGenerator.length-1;
    }

    const max_x = props.max_x[dataGenerator[current[0]][0]];
    const max_y = props.max_y[dataGenerator[current[0]][0]];

    console.log(props.max_x,props.max_y);

    var xDiv = 1;
    var xmul = 0;
    while(Math.abs(max_x / xDiv) >= 1000){
        xDiv *= 1000;
        xmul += 3;
    }
    while(Math.abs(max_x / xDiv) < 1){
        xDiv /= 1000;
        xmul -= 3;
    }

    var yDiv = 1;
    var ymul = 0;
    while(Math.abs(max_y / yDiv) >= 1000){
        yDiv *= 1000;
        ymul += 3;
    }
    while(Math.abs(max_y / yDiv) < 1){
        yDiv /= 1000;
        ymul -= 3;
    }

    const title_x =     xmul===0 ? props.titleX : props.titleX + " x 10^" + xmul.toString();
    const title_y =     ymul===0 ? props.titleY : props.titleY + " x 10^" + ymul.toString();

    return (
        <>
        
            <div style={{width:'100%',height:"500px"}} id="dp-graphdiv" position="relative">

                <ResponsiveScatterPlot
                    style={{zIndex: 1}}
                    data={dataGenerator[current[0]][1]}
                    useMesh={false}
                    margin={{ top: 60, right: 60, bottom: 70, left: 90 }}
                    xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                    // xFormat={function(e){return e+" kg"}}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                    // yFormat={function(e){return e+" cm"}}
                    colors={props.colors}
                    blendMode="multiply"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: title_x,
                        legendPosition: 'middle',
                        legendOffset: 60,
                        format: (value) => {return Math.round(value/xDiv*10)/10;}
                    }}
                    renderNode={CustomNode}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: title_y,
                        legendPosition: 'middle',
                        legendOffset: -60,
                        format: (value) => {return Math.round(value/yDiv*10)/10;}
                    }}
                    tooltip={({ node }) => {
                        return(
                        <div
                          style={{
                            color: "black",
                            background: lighten(node.data.color),
                            border: '2px solid #333',
                            borderRadius: "5px",
                            padding: '12px 16px',
                          }}
                        >
                          <strong>
                          {node.data.this_id} - {node.data.serieId}
                          </strong>
                          <br />
                          {`${props.titleX}: ${node.data.formattedX}`}
                          <br />
                          {`${props.titleY}: ${node.data.formattedY}`}
                        </div>
                      )}}
                />
            </div>

            {/* ----------------------------------- Year ----------------------------------- */}
            <Grid container direction="row" justify="center" alignItems="center" className={classes.chartContainer}>
                <Grid item xs={12} className={classes.gridContainer}>
                    <h2 style={{ paddingLeft:"30px", fontWeight: 400, color: '#555', textAlign:"center" }}>
                        <strong style={{ color: 'black', fontWeight: 900 }}>{dataGenerator[current[0]][0]}</strong>
                    </h2>
                </Grid>
            </Grid>

            {/* --------------------------  Player and Progress Bar-------------------------- */}
            <Grid container direction="row" justify="center" alignItems="center" className={classes.chartContainer}>
                <Grid item xs={1} className={classes.gridContainer}>
                    <Fab onClick={()=>{setCurrent([(current[0] - current[1]+1)%dataGenerator.length,1-current[1]])}}
                        size="medium" aria-label="Add">
                        {[<PlayIcon />,<PauseIcon />][current[1]]}
                    </Fab>
                </Grid>
                
                <Grid item xs={10} className={classes.gridContainer}>
                    <StyledSlider value={current[0]}
                            style={{width:"100%"}}
                            aria-labelledby="discrete-slider"
                            step={1}
                            onChange={(event, newValue)=>{setCurrent([newValue,current[1]])}}
                            marks
                            min={0}
                            max={dataGenerator.length-1}/>
                </Grid>
            </Grid>
        </>
    );
};

export default withStyles({gridContainer: {
    paddingBottom: "10px",
    alignItems:"center",
    justifyItems:"center",
    textAlign:"left"
}})(ScatterGraph);