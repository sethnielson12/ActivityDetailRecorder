// Import pdfmake-wrapper and the fonts to use
import { PdfMakeWrapper } from "pdfmake-wrapper";
import { ActivitySheet } from "./types";
import pdfFonts from "pdfmake/build/vfs_fonts"; // fonts provided for pdfmake
import { Table, Cell, Txt, Canvas, Line } from "pdfmake-wrapper";

const PdfCreator = (entry: ActivitySheet) => {
  // Set the fonts to use
  PdfMakeWrapper.setFonts(pdfFonts);

  const pdf = new PdfMakeWrapper();
  pdf.styles({
    formTitle: {
      fontSize: 20,
      bold: true,
      alignment: "center",
      margin: [0, 40, 0, 5],
    },
  });

  pdf.add(
    new Txt("Northstar Advocates & Services")
      .alignment("center")
      .bold()
      .fontSize(26).end
  );
  pdf.add(
    new Txt("Time and Support Sheet")
      .alignment("center")
      .bold()
      .fontSize(18)
      .margin([0, 0, 0, 5]).end
  );

  const table = new Table([
    [
      new Cell(new Txt(`Name: ${entry.clientName}`).fontSize(14).end).margin([
        0,
        5,
      ]).end,
      new Cell(
        new Txt(`Program: ${entry.programName}`).fontSize(14).end
      ).margin([0, 5]).end,
    ],
    [
      new Cell(
        new Txt(`Employee Name: ${entry.employeeName}`).fontSize(14).end
      ).margin([0, 5]).end,
      new Cell(
        new Txt(`Period Ending: ${entry.periodEnding}`).fontSize(14).end
      ).margin([0, 5]).end,
    ],
  ]).widths(["*", "*"]).end;
  pdf.add(table);

  const table2HeaderRow = [
    [
      new Cell(new Txt("Date").alignment("center").end).margin([0, 2]).end,
      new Cell(new Txt("Time In").alignment("center").end).margin([0, 2]).end,
      new Cell(new Txt("Time Out").alignment("center").end).margin([0, 2]).end,
      new Cell(new Txt("Total").alignment("center").end).margin([0, 2]).end,
      new Cell(
        new Txt("Description of Activity").alignment("center").end
      ).margin([0, 2]).end,
    ],
  ];

  const table2Rows = entry.activityList.map((activity) => {
    return [
      new Cell(new Txt(activity.date).end).end,
      new Cell(new Txt(activity.timeIn).end).end,
      new Cell(new Txt(activity.timeOut).end).end,
      new Cell(new Txt(activity.singleActivityTotalHours).end).end,
      new Cell(new Txt(activity.description).end).end,
    ];
  });

  const table2AllRows = table2HeaderRow.concat(table2Rows);

  const table2 = new Table(table2AllRows).widths([
    "auto",
    "auto",
    "auto",
    "auto",
    "*",
  ]).end;
  pdf.add(table2);

  pdf.add(
    new Txt("Total Hours: _____________")
      .bold()
      .margin([0, 10, 0, 0])
      .fontSize(12).end
  );
  pdf.add(new Canvas([new Line([0, 10], [515, 10]).end]).end);
  pdf.add(
    new Txt("Submit on the 1st and 16th of each month")
      .bold()
      .margin([0, 10, 0, 0])
      .fontSize(12).end
  );
  pdf.add(
    new Txt(
      "By signing this form I certify that the hours and activities are accurate for this pay period"
    )
      .italics()
      .margin([0, 5, 0, 0])
      .fontSize(12).end
  );
  pdf.add(
    new Canvas([
      new Line([25, 30], [245, 30]).end,
      new Line([283, 30], [490, 30]).end,
    ]).end
  );
  pdf.add(
    new Txt(
      "Employee Signature                                                   Provider Signature "
    )
      .bold()
      .margin([80, 2, 0, 0])
      .fontSize(12).end
  );

  const createdPDF = pdf.create();
  createdPDF.open();
};

export default PdfCreator;
