import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AreaChartComponent = ({ data }) => {
  const keys = Object.keys(data[0]);
  const xKey = keys.find((k) => typeof data[0][k] === "string") || keys[0];
  const yKey = keys.find((k) => typeof data[0][k] === "number") || keys[1];

  return (
    <div className="text-white">
      <h3 className="mb-2 font-semibold">Area Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00bcd4" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00bcd4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey={xKey} />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={yKey}
            stroke="#00bcd4"
            fillOpacity={1}
            fill="url(#colorY)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent;
