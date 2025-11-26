import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

export default function SimpleCard({ 
  title = "Título por defecto",
  content = "Contenido por defecto.",
  buttonText = "Ver más",
  onButtonClick = () => {},
  className = "",
}) {
  return (
    <Card className={`mt-6 w-96 ${className}`}>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {title}
        </Typography>
        <Typography>
          {content}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <Button onClick={onButtonClick}>{buttonText}</Button>
      </CardFooter>
    </Card>
  );
}
