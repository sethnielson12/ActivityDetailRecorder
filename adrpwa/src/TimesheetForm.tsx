import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
    custom: {
      //   height: 200,
      //   width: 400,
    },
  })
);

function TimesheetForm() {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField
        id="clientName"
        label="Client Name"
        variant="outlined"
        className={classes.custom}
      />
      <TextField
        id="programName"
        label="Program"
        variant="outlined"
        className={classes.custom}
      />
      <TextField
        id="employeeName"
        label="Employee Name"
        variant="outlined"
        className={classes.custom}
      />
      <TextField
        id="periodEnding"
        label="Period Ending"
        variant="outlined"
        className={classes.custom}
      />
      <TextField
        id="activity Description"
        label="Description of Activity"
        variant="outlined"
        multiline
        className={classes.custom}
      />
    </form>
  );
}

export default TimesheetForm;
