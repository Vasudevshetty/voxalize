import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const LineChartComponent = ({ data }) => {
  const keys = Object.keys(data[0]);
  const xKey = keys.find((k) => typeof data[0][k] === "string") || keys[0];
  const yKey = keys.find((k) => typeof data[0][k] === "number") || keys[1];

  return (
    <div className="text-white">
      <h3 className="mb-2 font-semibold">Line Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={yKey} stroke="#4fc3f7" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
