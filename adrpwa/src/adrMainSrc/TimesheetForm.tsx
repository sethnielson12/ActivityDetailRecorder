import React, { useState } from "react";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import { openDB, DBSchema } from "idb";

import PdfCreator from "./PdfCreator";

import { ActivitySheet, SingleActivity } from "./types";

interface MyDB extends DBSchema {
  activitySheet: {
    value: ActivitySheet;
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
    // root: {
    //   "& > *": {
    //     margin: theme.spacing(1),
    //     width: "25ch",
    //   },
    // },
    custom: {
      width: "100%",
      maxWidth: 300,
    },
    container: {
      marginTop: theme.spacing(1),
      width: "100%",
    },
    items: {
      paddingTop: theme.spacing(1),
    },
  })
);

function TimesheetForm() {
  const classes = useStyles();

  const tempSingleEntry: SingleActivity = {
    date: "03/19/2021", //mmddyyyy
    timeIn: "15:45am", // hh:mm
    timeOut: "16:30am", // hh:mm
    singleActivityTotalHours: "45 mins", //
    description:
      "Bacon ipsum dolor amet pastrami pork loin pancetta landjaeger salami cupim capicola short loin. Kevin swine boudin landjaeger meatball sausage. Landjaeger rump chislic ribeye ham, pig ham hock prosciutto bacon drumstick pork loin tenderloin shank ball tip biltong. Pork chop biltong tri-tip, brisket rump tongue kevin tail t-bone cupim fatback pork belly pancetta. Tongue filet mignon ground round pancetta. Spare ribs rump filet mignon andouille, ham ribeye pork belly.",
  };

  const tempEntry: ActivitySheet = {
    timesheetId: "1234",
    clientName: "clientNameTemp",
    programName: "programNameTemp",
    employeeName: "employeeNameTemp",
    periodEnding: "periodEndingTemp",
    activityList: [tempSingleEntry],
    allTotalHours: "allTotalHours",
  };

  demo(tempEntry);

  const [clientName, setClientName] = useState("clientNameTemp");
  const [programName, setProgramName] = useState("programNameTemp");
  const [employeeName, setEmployeeName] = useState("employeeNameTemp");
  const [periodEnding, setPeriodEnding] = useState("periodEndingTemp");
  const [activityList, setActivityList] = useState<SingleActivity[]>([
    tempSingleEntry,
  ]);
  const [allTotalHours, setAllTotalHours] = useState("allTotalHours");

  // individual activities
  const [date, setDate] = useState("03192021");
  const [timeIn, setTimeIn] = useState("15:45am");
  const [timeOut, setTimeOut] = useState("16:30am");
  const [singleActivityTotalHours, setSingleActivityTotalHours] = useState(
    "45 mins"
  );
  const [description, setDescription] = useState(
    "Bacon ipsum dolor amet pastrami pork loin pancetta landjaeger salami cupim capicola short loin. Kevin swine boudin landjaeger meatball sausage. Landjaeger rump chislic ribeye ham, pig ham hock prosciutto bacon drumstick pork loin tenderloin shank ball tip biltong. Pork chop biltong tri-tip, brisket rump tongue kevin tail t-bone cupim fatback pork belly pancetta. Tongue filet mignon ground round pancetta. Spare ribs rump filet mignon andouille, ham ribeye pork belly."
  );

  const addToActivityList = () => {
    setActivityList((prevState) => {
      const newActivity: SingleActivity = {
        date: date,
        timeIn: timeIn,
        timeOut: timeOut,
        singleActivityTotalHours: singleActivityTotalHours,
        description: description,
      };
      const newList: SingleActivity[] = prevState.concat(newActivity);
      return newList;
    });
  };

  const handleSubmit = () => {
    PdfCreator({
      timesheetId: "12345",
      clientName: clientName,
      programName: programName,
      employeeName: employeeName,
      periodEnding: periodEnding,
      activityList: activityList,
      allTotalHours: allTotalHours,
    });
  };

  return (
    <form noValidate autoComplete="off">
      {/* //className={classes.root} */}
      <Grid container className={classes.container}>
        <Grid item xs={12} className={classes.items}>
          <TextField
            id="clientName"
            label="Client Name"
            variant="outlined"
            className={classes.custom}
            onChange={(event) => {
              setClientName(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.items}>
          <TextField
            id="programName"
            label="Program"
            variant="outlined"
            className={classes.custom}
            onChange={(event) => {
              setProgramName(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.items}>
          <TextField
            id="employeeName"
            label="Employee Name"
            variant="outlined"
            className={classes.custom}
            onChange={(event) => {
              setEmployeeName(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.items}>
          <TextField
            id="periodEnding"
            label="Period Ending"
            variant="outlined"
            className={classes.custom}
            onChange={(event) => {
              setPeriodEnding(event.target.value);
            }}
          />
        </Grid>

        <Grid item xs={12} className={classes.items}>
          <TextField
            id="date"
            label="Date"
            variant="filled"
            className={classes.custom}
            onChange={(event) => {
              setDate(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.items}>
          <TextField
            id="timeIn"
            label="Time In"
            variant="filled"
            className={classes.custom}
            onChange={(event) => {
              setTimeIn(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.items}>
          <TextField
            id="timeOut"
            label="Time Out"
            variant="filled"
            className={classes.custom}
            onChange={(event) => {
              setTimeOut(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.items}>
          <TextField
            id="singleActivityTotalHours"
            label="Activity Total Hours"
            variant="filled"
            className={classes.custom}
            onChange={(event) => {
              setSingleActivityTotalHours(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.items}>
          <TextField
            id="activity Description"
            label="Description of Activity"
            variant="filled"
            multiline
            className={classes.custom}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.items}>
          <Button variant="contained" onClick={() => addToActivityList()}>
            Add Activity
          </Button>
        </Grid>

        <Grid item xs={12} className={classes.items}>
          <TextField
            id="totalHours"
            label="Timesheet Total Hours"
            variant="outlined"
            className={classes.custom}
            onChange={(event) => {
              setAllTotalHours(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.items}>
          <Button variant="contained" onClick={() => handleSubmit()}>
            Open PDF
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default TimesheetForm;
