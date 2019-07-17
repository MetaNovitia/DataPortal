import React, {Component} from 'react';
import { ResponsiveBar } from '@nivo/bar';

export default class MyResponsiveBar extends Component {

    render(){
        var groupMode = "grouped";
        if(this.props.stacked){
            groupMode = "stacked";
        }
        return(
            <ResponsiveBar
                data={this.props.data}
                keys={[ 'hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut' ]}
                indexBy="country"
                margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                padding={0.3}
                groupMode={groupMode}
                layout="horizontal"
                colors={{ scheme: 'nivo' }}
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'country',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                enableGridX={false}
                enableGridY={false}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'food',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
            />
        );
    }
    
}