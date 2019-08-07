import React, { useState, useEffect } from 'react';
import Slider from '@material-ui/core/Slider';
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import {Row} from 'reactstrap';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';

// styling slider to make mark bigger
const styles = {
    mark :{
        width:"2px",
        height:"5px",
        backgroundColor:"blue"
    }
}
const StyledSlider = withStyles(styles)(Slider);

const Scatter = (props) => {

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

    if(current[0] >= props.dataGenerator.length){
        current[0] = props.dataGenerator.length-1;
    }

    return (
        <>
        
            <div style={{width:'100%',height:"500px"}}>
                <ResponsiveScatterPlot
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
                        legend: props.titleX,
                        legendPosition: 'middle',
                        legendOffset: 46
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: props.titleY,
                        legendPosition: 'middle',
                        legendOffset: -60
                    }}
                />
            </div>
        
            {/* ----------------------------------- Year ----------------------------------- */}
            <h2 style={{ marginLeft: 60, fontWeight: 400, color: '#555', textAlign:"center" }}>
                <strong style={{ color: 'black', fontWeight: 900 }}>{dataGenerator[current[0]][0]}</strong>
            </h2>

            {/* --------------------------  Player and Progress Bar-------------------------- */}
            <Row style={{margin:0, padding:0, alignItems:"center"}}>
                <Fab onClick={()=>{setCurrent([(current[0] - current[1]+1)%dataGenerator.length,1-current[1]])}}
                    size="medium" aria-label="Add" style={{marginLeft:50}}>
                    {[<PlayIcon />,<PauseIcon />][current[1]]}
                </Fab>
                
                <StyledSlider value={current[0]}
                        style={{width:550, marginLeft:30}}
                        aria-labelledby="discrete-slider"
                        step={1}
                        onChange={(event, newValue)=>{setCurrent([newValue,current[1]])}}
                        marks
                        min={0}
                        max={dataGenerator.length-1}/>
            </Row>
        </>
    );
};

export default Scatter;