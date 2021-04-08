export interface SingleActivity {
  date: string;
  timeIn: string;
  timeOut: string;
  singleActivityTotalHours: string;
  description: string;
}

export interface ActivitySheet {
  timesheetId: string;
  clientName: string;
  programName: string;
  employeeName: string;
  periodEnding: string;
  activityList: SingleActivity[];
  allTotalHours: string;
}
