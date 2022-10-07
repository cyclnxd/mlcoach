import { Box, Typography, Stack } from "@mui/material";
import { useState, useEffect, useRef, memo } from "react";

import store from "lib/store/store.ts";
import StormIcon from "@mui/icons-material/Storm";
import { Chart } from "react-google-charts";

function PlotGraph({
  data,
  width,
  height,
  chartType = "ScatterChart",
  chartParams,
  axisParams,
  update,
  style,
  axisChanged,
}) {
  const [option, setOption] = useState()
  const [chartData, setChartData] = useState()
  const optionHandler = (type) => {
      var options = {
        title: chartParams.title,
        subtitle: chartParams.subtitle,
        hAxis: {
          title: axisParams.xAxis.title,
          minValue: axisParams.xAxis.minValue,
          maxValue: axisParams.xAxis.maxValue,
        },
        vAxis: {
          title: axisParams.yAxis.title,
          minValue: axisParams.yAxis.minValue,
          maxValue: axisParams.yAxis.maxValue,
        },
        legend: "none",
      };
      setOption(options);
    
  }
 
    useEffect(() => {
      if(data !== undefined)
      {
        ChartHandler(data)
      }
      else
      {
        ChartHandler(undefined)
      }
    }, [data,update,width, axisChanged]);
  
    function ChartHandler  (data){
     
    if(data !== undefined){
      optionHandler(chartType)
        let scatterData = [[axisParams.xAxis.title, axisParams.yAxis.title]];
        for (var index in data) {
          scatterData.push([
            parseFloat(data[index][axisParams.xAxis.title]),
            parseFloat(data[index][axisParams.yAxis.title]),
          ]);
      }
      setChartData(scatterData)
    }
  }
    return (
      <Chart 
        width={width}
        height={height}
        chartType={chartType}
        loader={<div>Loading Chart</div>}
        data={chartData}
        options={option}
        style = {style}
      />
    )
}

export default memo(PlotGraph);
