import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ScatterChartComponent = ({ data }) => {
  const keys = Object.keys(data[0]);
  const xKey = keys.find((k) => typeof data[0][k] === "number") || keys[0];
  const yKey =
    keys.find((k) => typeof data[0][k] === "number" && k !== xKey) || keys[1];

  return (
    <div className="text-white">
      <h3 className="mb-2 font-semibold">Scatter Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey={xKey} name={xKey} />
          <YAxis dataKey={yKey} name={yKey} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="Points" data={data} fill="#4caf50" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterChartComponent;
