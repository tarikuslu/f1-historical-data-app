import React, { forwardRef, useEffect, useState } from "react";

function Table(props, ref) {
  const [headTitles, setHeadTitles] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [tableTitle, setTableTitle] = useState("");
  useEffect(() => {
    handleDisplayData();
  }, []);

  useEffect(() => {
    handleDisplayData();
  }, [props.clickCount]);

  const displayedBodyData = bodyData.map((bdata) => {
    let keys = Object.keys(bdata);
    return (
      <tr>
        {keys.map((key, index, arr) => {
          return arr[index] === 0 ? (
            <th> {bdata[key]} </th>
          ) : (
            <td> {bdata[key]} </td>
          );
        })}
      </tr>
    );
  });

  function handleDisplayData() {
    console.log(props.data.MRData);
    if (props.dataType === "raceResults") {
      const [...res] = props.data.MRData.RaceTable.Races[0].Results;
      let emptyArray = [];
      for (let i = 0; i < res.length; i++) {
        emptyArray = [
          ...emptyArray,
          {
            position: res[i].position,
            no: res[i].number,
            driver: res[i].Driver.givenName + " " + res[i].Driver.familyName,
            constructor: res[i].Constructor.name,
            laps: res[i].laps,
            grid: res[i].grid,
            time: res[i].Time ? res[i].Time.time : " ",
            status: res[i].status,
            points: res[i].points,
          },
        ];
      }
      setTableTitle(
        `${props.data.MRData.RaceTable.Races[0].raceName} - ${props.data.MRData.RaceTable.Races[0].season} - Round ${props.data.MRData.RaceTable.Races[0].round}`
      );
      setBodyData(emptyArray);
      setHeadTitles([
        "Pos",
        "No",
        "Driver",
        "Constructor",
        "Laps",
        "Grid",
        "Time",
        "Status",
        "Points",
      ]);
    } else if (props.dataType === "qualiResults") {
      if (!props.data.MRData.RaceTable.Races.length) {
        setBodyData([
          {
            position: " ",
            no: " ",
            driver: " ",
            constructor: " ",
            Q1: " ",
            Q2: " ",
            Q3: " ",
          },
        ]);
        return;
      }
      const [...res] = props.data.MRData.RaceTable.Races[0].QualifyingResults;
      let emptyArray = [];
      for (let i = 0; i < res.length; i++) {
        emptyArray = [
          ...emptyArray,
          {
            position: res[i].position,
            no: res[i].number,
            driver: res[i].Driver.givenName + " " + res[i].Driver.familyName,
            constructor: res[i].Constructor.name,
            Q1: res[i].Q1 || " ",
            Q2: res[i].Q2 || " ",
            Q3: res[i].Q3 || " ",
          },
        ];
      }
      setTableTitle(
        `${props.data.MRData.RaceTable.Races[0].raceName} - ${props.data.MRData.RaceTable.Races[0].season} - Round ${props.data.MRData.RaceTable.Races[0].round}`
      );
      setBodyData(emptyArray);
      setHeadTitles(["Pos", "No", "Driver", "Constructor", "Q1", "Q2", "Q3"]);
    } else if (props.dataType === "driverStandings") {
      const [...res] =
        props.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      let emptyArray = [];
      for (let i = 0; i < res.length; i++) {
        emptyArray = [
          ...emptyArray,
          {
            position: res[i].position,
            driver: res[i].Driver.givenName + " " + res[i].Driver.familyName,
            constructor: res[i].Constructors[0].name,
            points: res[i].points,
            wins: res[i].wins,
          },
        ];
      }

      setTableTitle(
        `Season ${props.data.MRData.StandingsTable.season} - Round ${props.data.MRData.StandingsTable.round}`
      );
      setBodyData(emptyArray);
      setHeadTitles(["Pos", "Driver", "Constructor", "Points", "Wins"]);
    } else if (props.dataType === "constructorStandings") {
      if (!props.data.MRData.StandingsTable.StandingsLists.length) {
        setBodyData([
          {
            position: " ",
            constructor: " ",
            nationality: " ",
            points: " ",
            wins: " ",
          },
        ]);
        return;
      }

      const [...res] =
        props.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
      let emptyArray = [];
      for (let i = 0; i < res.length; i++) {
        emptyArray = [
          ...emptyArray,
          {
            position: res[i].position,
            constructor: res[i].Constructor.name,
            nationality: res[i].Constructor.nationality,
            points: res[i].points,
            wins: res[i].wins,
          },
        ];
      }
      setTableTitle(
        `Season ${props.data.MRData.StandingsTable.season} - Round ${props.data.MRData.StandingsTable.round}`
      );
      setBodyData(emptyArray);
      setHeadTitles(["Pos", "Constructor", "Nationality", "Points", "Wins"]);
    } else if (props.dataType === "calendarResults") {
      const [...res] = props.data.MRData.RaceTable.Races;
      let emptyArray = [];
      for (let i = 0; i < res.length; i++) {
        emptyArray = [
          ...emptyArray,
          {
            season: res[i].season,
            round: res[i].round,
            raceName: res[i].raceName,
            date: res[i].date || " ",
            time: res[i].time || " ",
            sprint: res[i].Sprint ? res[i].Sprint.time : "-",
            circuit: res[i].Circuit.circuitName,
          },
        ];
      }
      setTableTitle(
        `Season ${props.data.MRData.RaceTable.season} Race Calendar`
      );
      setBodyData(emptyArray);
      setHeadTitles([
        "Season",
        "Round",
        "Race Name",
        "Date",
        "Time",
        "Sprint",
        "Circuit",
      ]);
    }
  }

  return (
    <div className="overflow-x-auto w-screen">
      <footer className="footer flex justify-center p-4 bg-neutral text-neutral-content">
        <h1
          className="text-3xl max-[390px]:text-xl text-center py-3 font-bold "
          ref={ref}
        >
          {tableTitle}
        </h1>
      </footer>
      <table className="table table-compact w-full">
        <thead>
          <tr>
            {headTitles.map((title) => (
              <th> {title} </th>
            ))}
          </tr>
        </thead>

        <tbody>{displayedBodyData}</tbody>
        <tfoot>
          <tr>
            {headTitles.map((title) => (
              <th> {title} </th>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default forwardRef(Table);
