import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Project } from "../../api/types/model";

type Props = {
  project: Project;
};

export default function ProjectCard(props: Props) {
  const { project } = props;
  const navigate = useNavigate();
  return (
    <Card sx={{ minWidth: 275, margin: "1rem auto" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {project.quarter}
        </Typography>
        <Typography variant="h5" component="div">
          {project.proposal?.title ?? ""}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {project.created_at.toString()}
        </Typography>
        <Typography variant="body2">
          {project.proposal?.content ?? ""}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => navigate(`/project/details/${project.project_id}`)}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
