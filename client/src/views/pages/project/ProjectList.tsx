/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SearchRounded from "@mui/icons-material/SearchRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { getProjects } from "../../../api/project";
import { Project } from "../../../api/types/model";
import ProjectCard from "../../components/ProjectICard";

const statusValues = [
  { code: "PROPOSAL", label: "Proposing" },
  { code: "VOTE", label: "Vote" },
  { code: "PROGRESS", label: "On Going" },
  { code: "EVALUATION", label: "Evaluating" },
  { code: "CLOSE", label: "Closed" },
];

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>();
  const [selectedStatus, setSelectedStatus] = useState<string>();

  const handleRadio = (code: string) => {
    const selected = statusValues.find((status) => status.code === code);
    if (!selected) return;
    if (selectedStatus && selectedStatus === selected.code) {
      // resolve filter
      setSelectedStatus(undefined);
    } else {
      // filter
      setSelectedStatus(selected.code);
    }
  };

  useEffect(() => {
    getProjects().then((projects) => {
      return setProjects(projects);
    });
  }, []);

  return (
    <div>
      <Box
        justifyContent={"space-between"}
        display={"flex"}
        css={css`
          margin: 1rem 0 1rem;
        `}
      >
        <TextField
          fullWidth
          placeholder="filter by content"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          gap: 0 1rem;
          margin: 1.5rem 0 2rem;
        `}
      >
        {statusValues.map((status) => (
          <Button
            key={status.code}
            variant={
              selectedStatus && selectedStatus === status.code
                ? "contained"
                : "outlined"
            }
            fullWidth
            css={css`
              border-radius: 2rem;
              padding: 0.5rem 0.4rem;
              padding-left: 0.4rem;
            `}
            onClick={() => handleRadio(status.code)}
          >
            {selectedStatus && selectedStatus === status.code ? (
              <CheckCircleIcon
                css={css`
                  width: 36px;
                  height: auto;
                `}
              />
            ) : (
              <CheckCircleOutlineIcon
                css={css`
                  width: 36px;
                  height: auto;
                `}
              />
            )}
            <Typography
              css={css`
                margin: auto;
                font-size: 1.3rem;
              `}
            >
              {status.label}
            </Typography>
          </Button>
        ))}
      </div>
      {projects?.map((project, index) => {
        if (selectedStatus && selectedStatus !== project.status) return;
        return <ProjectCard key={index} project={project} />;
      })}
    </div>
  );
};

export default ProjectList;
