import React from "react";
import BarChartComponent from "./charts/BarChartComponent";
import LineChartComponent from "./charts/LineChartComponent";
import PieChartComponent from "./charts/PieChartComponent";
import AreaChartComponent from "./charts/AreaChartComponent";
import ScatterChartComponent from "./charts/ScatterChartComponent";
import HeatmapChartComponent from "./charts/HeatmapChartComponent";
import { getNumericFields, getCategoricalFields } from "../utils/dataHelpers";

const ChartRenderer = ({ data, recommendedGraphs }) => {
  if (!data || data.length === 0) return <p>No data to display</p>;

  const numericFields = getNumericFields(data);
  const categoricalFields = getCategoricalFields(data);

  const chartsToRender = [];

  if (
    recommendedGraphs.includes("bar") &&
    numericFields.length &&
    categoricalFields.length
  ) {
    chartsToRender.push(
      <BarChartComponent
        key="bar"
        data={data}
        xKey={categoricalFields[0]}
        yKey={numericFields[0]}
      />
    );
  }

  if (
    recommendedGraphs.includes("line") &&
    numericFields.length &&
    categoricalFields.length
  ) {
    chartsToRender.push(
      <LineChartComponent
        key="line"
        data={data}
        xKey={categoricalFields[0]}
        yKey={numericFields[0]}
      />
    );
  }

  if (
    recommendedGraphs.includes("pie") &&
    numericFields.length &&
    categoricalFields.length
  ) {
    chartsToRender.push(
      <PieChartComponent
        key="pie"
        data={data}
        nameKey={categoricalFields[0]}
        valueKey={numericFields[0]}
      />
    );
  }

  if (
    recommendedGraphs.includes("area") &&
    numericFields.length &&
    categoricalFields.length
  ) {
    chartsToRender.push(
      <AreaChartComponent
        key="area"
        data={data}
        xKey={categoricalFields[0]}
        yKey={numericFields[0]}
      />
    );
  }

  if (recommendedGraphs.includes("scatter") && numericFields.length >= 2) {
    chartsToRender.push(
      <ScatterChartComponent
        key="scatter"
        data={data}
        xKey={numericFields[0]}
        yKey={numericFields[1]}
      />
    );
  }

  if (
    recommendedGraphs.includes("heatmap") &&
    numericFields.length &&
    categoricalFields.length >= 2
  ) {
    chartsToRender.push(
      <HeatmapChartComponent
        key="heatmap"
        data={data}
        xKey={categoricalFields[0]}
        yKey={categoricalFields[1]}
        valueKey={numericFields[0]}
      />
    );
  }

  return <div className="space-y-8">{chartsToRender}</div>;
};

export default ChartRenderer;
