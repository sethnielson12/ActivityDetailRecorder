import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { ActivitySheet } from "./types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      width: "100%",
      maxWidth: 300,
    },
  })
);

interface ActivityListSelectorProps {
  timesheetTitle: string;
  setShowTimesheetSelect: React.Dispatch<React.SetStateAction<boolean>>;
  timesheetList: ActivitySheet[];
  setValues: (timesheet: ActivitySheet) => void;
  emptyActivity: ActivitySheet;
  loading: boolean;
}

const ActivityListSelector = ({
  timesheetTitle,
  setShowTimesheetSelect,
  timesheetList,
  setValues,
  emptyActivity,
  loading,
}: ActivityListSelectorProps) => {
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedTimesheetId = event.target.value as string;
    setShowTimesheetSelect(false);

    const selectedTimesheet = timesheetList.find(
      (timesheet) => timesheet.timesheetId === selectedTimesheetId
    );
    if (selectedTimesheet !== undefined) {
      setValues(selectedTimesheet);
    } else {
      setValues(emptyActivity);
    }
  };

  const generateOptions = (list: ActivitySheet[]) => {
    let tempList = list.map((activity) => {
      return (
        <MenuItem key={activity.timesheetId} value={activity.timesheetId}>
          {activity.timesheetId}
        </MenuItem>
      );
    });
    return tempList;
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="controlled-select-label">
          Select Timesheet Title
        </InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          value={timesheetTitle}
          variant="outlined"
          onChange={handleChange}
          disabled={loading}
        >
          {generateOptions(timesheetList)}
        </Select>
      </FormControl>
    </div>
  );
};

export default ActivityListSelector;
