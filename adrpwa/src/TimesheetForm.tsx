import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import { openDB, DBSchema } from "idb";

interface SingleActivity {
  date: string;
  timeIn: string;
  timeOut: string;
  singleActivityTotalHours: string;
  description: string;
}

interface ActivitySheet {
  timesheetId: string;
  clientName: string;
  program: string;
  employeeName: string;
  periodEndingDate: string;
  activityList: SingleActivity[];
  allTotalHours: string;
}

interface MyDB extends DBSchema {
  activitySheet: {
    value: {
      timesheetId: string;
      clientName: string;
      program: string;
      employeeName: string;
      periodEndingDate: string;
      activityList: {
        date: string;
        timeIn: string;
        timeOut: string;
        singleActivityTotalHours: string;
        description: string;
      }[];
      allTotalHours: string;
    };
    key: string;
    indexes: { "by-date": number };
  };
}

async function demo(tempEntry: ActivitySheet) {
  const db = await openDB<MyDB>("my-db", 1, {
    upgrade(db) {
      //   db.createObjectStore("favourite-number");
      const productStore = db.createObjectStore("activitySheet", {
        keyPath: "timesheetId",
      });
      productStore.createIndex("by-date", "price");
    },
  });

  // This works
  await db.put("activitySheet", tempEntry);
}

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

  const tempSingleEntry: SingleActivity = {
    date: "03192021", //mmddyyyy
    timeIn: "15:45", // hh:mm
    timeOut: "16:30", // hh:mm
    singleActivityTotalHours: "45 mins", //
    description: "A walk in the park",
  };

  const tempEntry: ActivitySheet = {
    timesheetId: "bbb",
    clientName: "bbb",
    program: "bbb",
    employeeName: "bbb",
    periodEndingDate: "bbb",
    activityList: [tempSingleEntry],
    allTotalHours: "bbb",
  };

  demo(tempEntry);

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
