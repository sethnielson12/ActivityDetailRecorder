import { useState, useEffect, useCallback } from "react";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import { openDB, DBSchema } from "idb";

import PdfCreator from "./PdfCreator";
import ActivityListDisplayer from "./ActivityListDisplayer";
import ActivityListSelector from "./ActivityListSelector";

import { ActivitySheet, SingleActivity } from "./types";

interface MyDB extends DBSchema {
  activitySheet: {
    value: ActivitySheet;
    key: string;
    indexes: { "by-date": string };
  };
}

async function openMyDB() {
  const db = await openDB<MyDB>("my-db", 1, {
    upgrade(db) {
      //   db.createObjectStore("favourite-number");
      const productStore = db.createObjectStore("activitySheet", {
        keyPath: "timesheetId",
      });
      productStore.createIndex("by-date", "date");
    },
  });
  return db;
}

async function putEntryInMyDB(tempEntry: ActivitySheet) {
  const db = await openMyDB();

  let timesheetList = [];
  let cursor = await db.transaction("activitySheet").store.openCursor();

  while (cursor) {
    timesheetList.push(cursor.key);
    cursor = await cursor.continue();
  }

  await db.put("activitySheet", tempEntry);
  return timesheetList;
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
    activityListDisplayer: {
      alignContent: "center",
      alignItems: "center",
      width: "100%",
      maxWidth: 300,
    },
    warning: {
      width: "100%",
      maxWidth: 300,
      textAlign: "left",
      paddingTop: 5,
      paddingBottom: 10,
    },
  })
);

function TimesheetForm() {
  const classes = useStyles();

  const tempSingleEntry: SingleActivity = {
    date: "03/19/2021", //mmddyyyy
    timeIn: "15:45am", // hh:mm
    timeOut: "16:30am", // hh:mm
    singleActivityTotalHours: "45 minutes", //
    description:
      "3Bacon ipsum dolor amet pastrami pork loin pancetta landjaeger salami cupim capicola short loin. Kevin swine boudin landjaeger meatball sausage. Landjaeger rump chislic ribeye ham, pig ham hock prosciutto bacon drumstick pork loin tenderloin shank ball tip biltong. Pork chop biltong tri-tip, brisket rump tongue kevin tail t-bone cupim fatback pork belly pancetta. Tongue filet mignon ground round pancetta. Spare ribs rump filet mignon andouille, ham ribeye pork belly.",
  };

  const tempEntry: ActivitySheet = {
    timesheetId: "12345",
    clientName: "clientNameTemp",
    programName: "programNameTemp",
    employeeName: "employeeNameTemp",
    periodEnding: "periodEndingTemp",
    activityList: [tempSingleEntry],
    allTotalHours: "allTotalHours",
  };

  const emptyActivity: ActivitySheet = {
    timesheetId: "",
    clientName: "",
    programName: "",
    employeeName: "",
    periodEnding: "",
    activityList: [],
    allTotalHours: "",
  };

  putEntryInMyDB(tempEntry);
  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const [indexOfActivityBeingEdited, setIndexOfActivityBeingEdited] = useState(
    -1
  );

  const [loading, setLoading] = useState(true);
  const [timesheetList, setTimesheetList] = useState<ActivitySheet[]>([]);

  const getTimesheetList = useCallback(async () => {
    try {
      const db = await openMyDB();

      let timesheetList: ActivitySheet[] = [];
      let cursor = await db.transaction("activitySheet").store.openCursor();

      while (cursor) {
        timesheetList.push(cursor.value);
        cursor = await cursor.continue();
      }

      setTimesheetList(timesheetList);
      return timesheetList;
    } catch {
      console.log("Error: getTimesheetList failed.");
      let timesheetList: ActivitySheet[] = [];
      return timesheetList;
    }
  }, [setTimesheetList]);

  // getTimesheetList().then((tsList) => {
  //   // tempList = tsList;
  //   setTimesheetList(tsList);
  //   setLoading(false);
  // });

  useEffect(() => {
    getTimesheetList().then((tsList) => {
      setTimesheetList(tsList);
      setLoading(false);
    });
  }, [loading, getTimesheetList]);

  const [showSelectBtns, setShowSelectBtns] = useState(false);
  const [showTimesheetSelect, setShowTimesheetSelect] = useState(false);

  const [timesheetTitle, setTimesheetTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [programName, setProgramName] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [periodEnding, setPeriodEnding] = useState("");

  const [activityList, setActivityList] = useState<SingleActivity[]>([]);

  const [allTotalHours, setAllTotalHours] = useState("");

  // individual activities
  const [date, setDate] = useState("");
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [singleActivityTotalHours, setSingleActivityTotalHours] = useState("");
  const [description, setDescription] = useState("");

  const setValues = (timesheet: ActivitySheet) => {
    setTimesheetTitle(timesheet.timesheetId);
    setClientName(timesheet.clientName);
    setProgramName(timesheet.programName);
    setEmployeeName(timesheet.employeeName);
    setPeriodEnding(timesheet.periodEnding);
    setActivityList(timesheet.activityList);
    setDate("");
    setTimeIn("");
    setTimeOut("");
    setSingleActivityTotalHours("");
    setDescription("");
    setAllTotalHours(timesheet.allTotalHours);
  };

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

  const saveActivityChanges = (keep: boolean) => {
    setActivityList((prevState) => {
      const editedActivity: SingleActivity = {
        date: date,
        timeIn: timeIn,
        timeOut: timeOut,
        singleActivityTotalHours: singleActivityTotalHours,
        description: description,
      };

      if (indexOfActivityBeingEdited === 0) {
        const oldListWithFirstRemoved = prevState.slice(1, prevState.length);
        const newList: SingleActivity[] = [editedActivity].concat(
          oldListWithFirstRemoved
        );
        setIndexOfActivityBeingEdited(-1);
        return keep ? newList : oldListWithFirstRemoved;
      } else if (indexOfActivityBeingEdited === prevState.length - 1) {
        const oldListWithLastRemoved = prevState.slice(0, prevState.length - 1);
        const newList: SingleActivity[] = [editedActivity].concat(
          oldListWithLastRemoved
        );
        setIndexOfActivityBeingEdited(-1);
        return keep ? newList : oldListWithLastRemoved;
      } else {
        const firstPart = prevState.slice(0, indexOfActivityBeingEdited);
        const lastPart = prevState.slice(
          indexOfActivityBeingEdited + 1,
          prevState.length
        );

        const newList: SingleActivity[] = keep
          ? firstPart.concat([editedActivity]).concat(lastPart)
          : firstPart.concat(lastPart);
        setIndexOfActivityBeingEdited(-1);
        return newList;
      }
    });
  };

  const setActivityFields = (activity: SingleActivity) => {
    setDate(activity.date);
    setTimeIn(activity.timeIn);
    setTimeOut(activity.timeOut);
    setSingleActivityTotalHours(activity.singleActivityTotalHours);
    setDescription(activity.description);
  };

  const makeEntry = () => {
    const entry: ActivitySheet = {
      timesheetId: timesheetTitle,
      clientName: clientName,
      programName: programName,
      employeeName: employeeName,
      periodEnding: periodEnding,
      activityList: activityList,
      allTotalHours: allTotalHours,
    };
    return entry;
  };

  const saveDataForLater = async () => {
    const entry = makeEntry();
    await putEntryInMyDB(entry);
  };

  const handleSubmit = async () => {
    const entry = makeEntry();
    saveDataForLater().then(() => {
      setLoading(true);
    });
    PdfCreator(entry);
  };

  return (
    <form noValidate autoComplete="off">
      {/* //className={classes.root} */}
      <Grid container className={classes.container}>
        {!showTimesheetSelect && !showSelectBtns && (
          <Grid item xs={12} className={classes.items}>
            <Button
              variant="contained"
              // className={classes.button}
              onClick={() => {
                if (
                  timesheetTitle === "" &&
                  clientName === "" &&
                  programName === "" &&
                  employeeName === "" &&
                  periodEnding === "" &&
                  activityList.length === 0 &&
                  allTotalHours === ""
                ) {
                  setShowTimesheetSelect(true);
                } else {
                  setShowSelectBtns(true);
                }
              }}
            >
              Select Previous Timesheet
            </Button>
          </Grid>
        )}
        {showSelectBtns && (
          <Grid item xs={12} className={classes.items}>
            <Button
              variant="contained"
              // className={classes.button}
              onClick={() => setShowSelectBtns(false)}
            >
              Cancel
            </Button>
          </Grid>
        )}
        {showSelectBtns && (
          <Grid item xs={12} className={classes.items}>
            <Button
              variant="contained"
              // className={classes.button}
              onClick={() => {
                if (timesheetTitle === "") {
                  setShowSaveWarning(true);
                } else {
                  saveDataForLater().then(() => {
                    setLoading(true);
                  });
                  setShowTimesheetSelect(true);
                  setShowSelectBtns(false);
                }
              }}
              disabled={showSaveWarning}
            >
              Save Entry
            </Button>
            <Button
              variant="contained"
              // className={classes.button}
              onClick={() => {
                setShowTimesheetSelect(true);
                setShowSelectBtns(false);
                setShowSaveWarning(false);
              }}
            >
              Don't Save
            </Button>
          </Grid>
        )}
        {showTimesheetSelect && (
          <Grid item xs={12} className={classes.items}>
            {timesheetList.length === 0 ? (
              <div>Loading Timesheets...</div>
            ) : (
              <ActivityListSelector
                timesheetTitle={timesheetTitle}
                setShowTimesheetSelect={setShowTimesheetSelect}
                timesheetList={timesheetList}
                setValues={setValues}
                emptyActivity={emptyActivity}
                loading={loading}
              />
            )}
          </Grid>
        )}
        <Grid item xs={12} className={classes.items}>
          <TextField
            id="timesheetTitle"
            label="Timesheet Title"
            variant="outlined"
            className={classes.custom}
            onChange={(event) => {
              setTimesheetTitle(event.target.value);
              if (event.target.value !== "") {
                setShowSaveWarning(false);
                setShowTimesheetSelect(false);
              }
            }}
            value={timesheetTitle}
            helperText={
              showSaveWarning
                ? "Timesheet must have a title before being saved for later."
                : ""
            }
          />
        </Grid>
        {showSaveWarning && (
          <Grid item xs={12} className={classes.warning}>
            <Grid container style={{ alignItems: "center" }}></Grid>
          </Grid>
        )}
        <Grid item xs={12} className={classes.items}>
          <TextField
            id="clientName"
            label="Client Name"
            variant="outlined"
            className={classes.custom}
            onChange={(event) => {
              setClientName(event.target.value);
            }}
            value={clientName}
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
            value={programName}
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
            value={employeeName}
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
            value={periodEnding}
          />
        </Grid>
        {activityList.length > 0 && (
          <Grid item xs={12} className={classes.items}>
            <ActivityListDisplayer
              activityList={activityList}
              className={classes.custom}
              indexOfActivityBeingEdited={indexOfActivityBeingEdited}
              setIndexOfActivityBeingEdited={setIndexOfActivityBeingEdited}
              setActivityFields={setActivityFields}
              saveActivityChanges={saveActivityChanges}
            />
          </Grid>
        )}

        <Grid item xs={12} className={classes.items}>
          <TextField
            id="date"
            label="Date"
            variant="filled"
            className={classes.custom}
            onChange={(event) => {
              setDate(event.target.value);
            }}
            value={date}
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
            value={timeIn}
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
            value={timeOut}
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
            value={singleActivityTotalHours}
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
            value={description}
          />
        </Grid>
        <Grid item xs={12} className={classes.items}>
          <Button
            variant="contained"
            onClick={() => {
              indexOfActivityBeingEdited === -1
                ? addToActivityList()
                : saveActivityChanges(true);
            }}
          >
            {indexOfActivityBeingEdited === -1
              ? `Add Activity`
              : "Save Activity Changes"}
          </Button>
        </Grid>

        <Grid item xs={12} className={classes.items}>
          <TextField
            id="allTotalHours"
            label="Timesheet Total Hours"
            variant="outlined"
            className={classes.custom}
            onChange={(event) => {
              setAllTotalHours(event.target.value);
            }}
            value={allTotalHours}
          />
        </Grid>
        <Grid item xs={12} className={classes.items}>
          <Button
            style={{ marginRight: 5, marginBottom: 5 }}
            variant="contained"
            // className={classes.button}
            onClick={() => {
              if (timesheetTitle === "") {
                setShowSaveWarning(true);
              } else {
                saveDataForLater().then(() => {
                  setLoading(true);
                });
                // setShowTimesheetSelect(true);
                // setShowSelectBtns(false);
              }
            }}
            disabled={showSaveWarning}
          >
            Save Entry
          </Button>
          <Button
            style={{ marginLeft: 5, marginBottom: 5 }}
            variant="contained"
            onClick={() => {
              if (timesheetTitle === "") {
                setShowSaveWarning(true);
              } else {
                handleSubmit();
              }
            }}
            disabled={showSaveWarning}
          >
            Open PDF
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default TimesheetForm;
