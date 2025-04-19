const HeatmapChartComponent = ({ data }) => {
  const keys = Object.keys(data[0]);
  const xKey = keys.find((k) => typeof data[0][k] === "string") || keys[0];
  const yKey = keys.find((k) => typeof data[0][k] === "number") || keys[1];

  const max = Math.max(...data.map((d) => d[yKey]));

  return (
    <div className="text-white">
      <h3 className="mb-2 font-semibold">Heatmap</h3>
      <div className="grid grid-cols-5 gap-2">
        {data.map((item, i) => {
          const intensity = item[yKey] / max;
          const color = `rgba(0, 188, 212, ${intensity})`;

          return (
            <div
              key={i}
              title={`${xKey}: ${item[xKey]}, ${yKey}: ${item[yKey]}`}
              className="h-16 w-full flex items-center justify-center rounded text-xs text-center"
              style={{ backgroundColor: color }}
            >
              {item[xKey]}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeatmapChartComponent;
