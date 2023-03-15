import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import SearchRounded from "@mui/icons-material/SearchRounded";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { SyntheticEvent, useEffect, useState } from "react";
import { getProjects } from "../../../api/project";
import { Project } from "../../../api/types/model";
import ProjectCard from "../../components/ProjectICard";

const blankCheckIcon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const statusValues = ["PROPOSAL", "VOTE", "PROGRESS", "EVALUATE", "CLOSE"];
const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>();
  const [filterStatuses, setFilterStatuses] = useState<string[]>([
    // "PROPOSAL",
    // "VOTE",
    // "PROGRESS",
    // "EVALUATE",
    // "CLOSE",
  ]);
  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    value: string[]
  ) => {
    if (!value) {
      return;
    }
    console.log(value);
    setFilterStatuses(value);
  };

  useEffect(() => {
    getProjects().then((projects) => {
      return setProjects(projects);
    });
  }, []);
  return (
    <div>
      <Box justifyContent={"space-between"} display={"flex"}>
        <Autocomplete
          multiple
          // limitTags={5}
          options={statusValues}
          defaultValue={filterStatuses}
          disableCloseOnSelect
          onChange={(event, values) => {
            handleChange(event, values);
          }}
          sx={{ minWidth: "400px" }}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={blankCheckIcon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option}
            </li>
          )}
          renderInput={(params) => (
            <TextField placeholder="filter by status" {...params} />
          )}
        />
        <TextField
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
      {projects?.map((project, index) => {
        if (
          filterStatuses.length === 0 ||
          filterStatuses.includes(project.status)
        ) {
          return <ProjectCard key={index} project={project} />;
        }
      })}
    </div>
  );
};

export default ProjectList;
