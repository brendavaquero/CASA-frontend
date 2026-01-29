// components/dashboard/MetricCard.jsx
import { Card, CardBody, Typography } from "@material-tailwind/react";

export function MetricCard({ title, value }) {
  return (
    <Card className="shadow-sm">
      <CardBody>
        <Typography variant="small" color="blue-gray">
          {title}
        </Typography>
        <Typography variant="h4">
          {value}
        </Typography>
      </CardBody>
    </Card>
  );
}
