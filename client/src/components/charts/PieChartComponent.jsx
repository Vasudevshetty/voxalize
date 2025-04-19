import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#00bcd4", "#4caf50", "#ff9800", "#e91e63", "#9c27b0"];

const PieChartComponent = ({ data }) => {
  const keys = Object.keys(data[0]);
  const nameKey = keys.find((k) => typeof data[0][k] === "string") || keys[0];
  const valueKey = keys.find((k) => typeof data[0][k] === "number") || keys[1];

  return (
    <div className="text-white">
      <h3 className="mb-2 font-semibold">Pie Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip />
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#00bcd4"
            label
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
