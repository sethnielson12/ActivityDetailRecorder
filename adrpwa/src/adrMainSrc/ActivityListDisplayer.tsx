import React from "react";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { SingleActivity } from "./types";

interface ActivityListDisplayerProps {
  activityList: SingleActivity[];
  className?: string;
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
}: ActivityListDisplayerProps) => {
  const classes = useStyles();

  const list = activityList.map((activity) => {
    return (
      <Grid item xs={12} className={className}>
        <Grid container>
          <Grid item xs className={classes.items}>
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
          <Grid item xs className={classes.items}>
            {activity.timeIn}
          </Grid>
          <Grid item xs className={classes.items}>
            {activity.timeOut}
          </Grid>
          <Grid item xs className={classes.items}>
            {activity.singleActivityTotalHours}
          </Grid>
          <Grid item xs={12} className={classes.descriptionItem}>
            {activity.description}
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
