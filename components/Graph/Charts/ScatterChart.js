import { Box, Typography, Stack } from '@mui/material'
import { useState, useEffect, useRef, memo } from 'react'

import store from 'lib/store/store.ts'
import StormIcon from '@mui/icons-material/Storm'
import { Chart} from 'react-google-charts'

function ScatterPlot({ data, options, width, height, legendToggle}) {
    const [legend, setLegend] = useState('none');
    const chartEvents = [
        {
            eventName: 'select',
            callback: ({ chartWrapper }) => {
                const chart = chartWrapper.getChart();
                const selection = chart.getSelection();
                if (selection.length === 0) return;
                const region = data[selection[0].row + 1];
                console.log('Selected : ' + region);
            },
        },
    ];

    useEffect(() => {
        if (legendToggle) {
            setLegend('right');
        } else {
            setLegend('none');
        }
    }, [legendToggle]);



  return (
    <Chart
      width={width}
      height={height}
      chartType={"ScatterChart"}
      loader={<div>Loading Chart</div>}
      data={data}
      options={options}
      chartEvents={chartEvents}
      rootProps={{ 'data-testid': '1' }}
    />
  );
}
