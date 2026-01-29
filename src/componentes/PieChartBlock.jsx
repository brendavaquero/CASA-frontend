// components/dashboard/PieChartBlock.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const COLORS = ["#0284c7", "#7c3aed", "#16a34a", "#dc2626"];

export function PieChartBlock({ title, data }) {
  if (!data || data.length === 0) return null;

  return (
    <Card>
      <CardBody>
        <Typography variant="h6" className="mb-4">
          {title}
        </Typography>

        <div className="flex">
  <div className="w-2/3 h-64">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="total" nameKey="etiqueta" outerRadius={90} label>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

  <div className="w-1/3 ml-4 flex flex-col justify-center">
    {data.map((item, index) => (
      <div key={index} className="flex items-center mb-2">
        <div
          className="w-4 h-4 rounded mr-2"
          style={{ backgroundColor: COLORS[index % COLORS.length] }}
        />
        <span>{item.etiqueta} ({item.total})</span>
      </div>
    ))}
  </div>
</div>

      </CardBody>
    </Card>
  );
}
