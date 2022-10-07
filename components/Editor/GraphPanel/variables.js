//Under Construction

export default function Paramaters() {
  let types = [
    "ScatterChart",
    "AreaChart",
    "BarChart",
    "LineChart",
    "PieChart",
    "BubbleChart",
    "ColumnChart",
    "Histogram",
  ];
  let axisChanged = false;
  let chartType = "ScatterChart";
  let chartParams = { title: "deneme", subtitle: "deneme" };
  let axisParams = {
    xAxis: { title: " ", minValue: 0, maxValue: 0 },
    yAxis: { title: " ", minValue: 0, maxValue: 0 },
  };
  const getChartParams = () => {
    return chartParams;
  };
  const getAxisParams = () => {
    return axisParams;
  };
  const getType = () => {
    return chartType;
  };
  const getReRender = () => {
    return axisChanged;
  };
  const setReRender = () => {
    axisChanged = !axisChanged;
  };
  const setChartParams = (title, subtitle) => {
    chartParams.title = title;
    chartParams.subtitle = subtitle;
  };
  const setXAxis = (xAxis) => {
    axisParams.xAxis.title = xAxis.title || "X axis";
    axisParams.xAxis.minValue = xAxis.minValue || 0;
    axisParams.xAxis.maxValue = xAxis.maxValue || 0;
  };
  const setYAxis = (yAxis) => {
    axisParams.yAxis.title = yAxis.title || "Y axis";
    axisParams.yAxis.minValue = yAxis.minValue || 0;
    axisParams.yAxis.maxValue = yAxis.maxValue || 0;
  };
  const setType = (type) => {
    chartType = type;
  };
  return {
    getChartParams,
    getAxisParams,
    getType,
    getReRender,
    setReRender,
    setXAxis,
    setYAxis,
    setType,
  };
}
