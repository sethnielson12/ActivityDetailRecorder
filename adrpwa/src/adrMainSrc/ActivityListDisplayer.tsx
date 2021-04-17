import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { SingleActivity } from "./types";

interface ActivityListDisplayerProps {
  activityList: SingleActivity[];
  className?: string;
  setActivityFields: (activity: SingleActivity) => void;
  indexOfActivityBeingEdited: number;
  setIndexOfActivityBeingEdited: React.Dispatch<React.SetStateAction<number>>;
  saveActivityChanges: (keep: boolean) => void;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    items: {
      paddingTop: theme.spacing(1),
      paddingRight: theme.spacing(1),
      lineHeight: "100%",
    },
    descriptionItem: {
      textAlign: "left",
      paddingTop: 5,
      paddingBottom: 10,
    },
  })
);

const ActivityListDisplayer = ({
  activityList,
  className,
  setActivityFields,
  indexOfActivityBeingEdited,
  setIndexOfActivityBeingEdited,
  saveActivityChanges,
}: ActivityListDisplayerProps) => {
  const classes = useStyles();
  const [showConfirmBtns, setShowConfirmBtns] = useState(false);

  const list = activityList.map((activity, index) => {
    return (
      <Grid key={index.toString()} item xs={12} className={className}>
        <Grid container>
          <Grid
            item
            key={`date-${index.toString()}`}
            xs
            className={classes.items}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {activity.date}
            </div>
          </Grid>
          <Grid
            item
            key={`timeIn-${index.toString()}`}
            xs
            className={classes.items}
          >
            {activity.timeIn}
          </Grid>
          <Grid
            item
            key={`timeOut-${index.toString()}`}
            xs
            className={classes.items}
          >
            {activity.timeOut}
          </Grid>
          <Grid
            item
            key={`singleActivityTotalHours-${index.toString()}`}
            xs
            className={classes.items}
          >
            {activity.singleActivityTotalHours}
          </Grid>
          <Grid
            item
            key={`description-${index.toString()}`}
            xs={12}
            className={classes.descriptionItem}
          >
            {activity.description}
          </Grid>
          <Grid
            item
            key={`edit-buttons${index.toString()}`}
            xs={12}
            className={classes.descriptionItem}
          >
            {(!showConfirmBtns || indexOfActivityBeingEdited !== index) && (
              <Button
                variant="contained"
                // className={classes.button}
                onClick={() => {
                  setActivityFields(activity);
                  setIndexOfActivityBeingEdited(index);
                }}
                style={{ marginRight: 5 }}
                disabled={showConfirmBtns}
              >
                Edit
              </Button>
            )}
            {(!showConfirmBtns || indexOfActivityBeingEdited !== index) && (
              <Button
                variant="contained"
                // className={classes.button}
                onClick={() => {
                  setIndexOfActivityBeingEdited(index);
                  setShowConfirmBtns(true);
                }}
                disabled={showConfirmBtns}
              >
                Delete
              </Button>
            )}

            {showConfirmBtns && indexOfActivityBeingEdited === index && (
              <Button
                variant="contained"
                // className={classes.button}
                onClick={() => {
                  setShowConfirmBtns(false);
                }}
              >
                Cancel
              </Button>
            )}
            {showConfirmBtns && indexOfActivityBeingEdited === index && (
              <Button
                variant="contained"
                // className={classes.button}
                onClick={() => {
                  setIndexOfActivityBeingEdited(index);
                  saveActivityChanges(false);
                  setShowConfirmBtns(false);
                }}
              >
                Confirm
              </Button>
            )}
          </Grid>
        </Grid>
        <hr />
      </Grid>
    );
  });
  return (
    <Grid container direction="column" style={{ alignItems: "center" }}>
      {list}
    </Grid>
  );
};

export default ActivityListDisplayer;
