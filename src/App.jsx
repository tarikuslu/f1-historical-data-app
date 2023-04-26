import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { themeChange } from "theme-change";
import "./App.css";
import Table from "./Table";
function App() {
  const [years, setYears] = useState([]);
  const [typeSelector, setTypeSelector] = useState(null);
  const [seasonSelector, setSeasonSelector] = useState(null);
  const [raceRound, setRaceRound] = useState([]);
  const [fetchData, setFetchData] = useState(null);
  const [selectedRaceCount, setSelectedRaceCount] = useState(null);
  const [close, setClose] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [calendarToggle, setCalendarToggle] = useState(false);
  const [themeToggle, setThemeToggle] = useState(true);
  useEffect(() => {
    const yearsCopy = handleYears();
    setYears(yearsCopy);
    themeChange(false);
  }, []);

  function handleYears() {
    let yearArr = [];
    for (let i = 1950; i <= new Date().getFullYear(); i++) {
      yearArr = [...yearArr, i];
    }
    return yearArr;
  }

  async function handleSeasonChange(event) {
    setSeasonSelector(event.target.value);
    await fetch(
      `https://ergast.com/api/f1/${event.target.value}/results.json?limit=500`
    )
      .then((response) => response.json())
      .then((data) => {
        const raceCount = data.MRData.RaceTable.Races.length;
        let countArr = [];
        for (let i = 1; i <= raceCount; i++) {
          countArr = [...countArr, i];
        }
        setRaceRound(countArr);
      })
      .catch((err) => console.log(err));
  }

  function handleTypeChange(event) {
    event.target.value === "calendarResults"
      ? setCalendarToggle(true)
      : setCalendarToggle(false);
    setTypeSelector(event.target.value);
  }

  function handleSelectedRaceCount(event) {
    setSelectedRaceCount(event.target.value);
  }

  function handleSearch(event) {
    event.preventDefault();
    if (
      typeSelector &&
      seasonSelector &&
      (selectedRaceCount || typeSelector === "calendarResults")
    ) {
      let fetchUri = "";
      switch (typeSelector) {
        case "raceResults":
          fetchUri = `https://ergast.com/api/f1/${seasonSelector}/${selectedRaceCount}/results.json?limit=500`;
          break;
        case "qualiResults":
          fetchUri = `https://ergast.com/api/f1/${seasonSelector}/${selectedRaceCount}/qualifying.json?limit=500`;
          break;
        case "calendarResults":
          fetchUri = `https://ergast.com/api/f1/${seasonSelector}.json?limit=500`;
          break;
        case "driverStandings":
          fetchUri = `https://ergast.com/api/f1/${seasonSelector}/${selectedRaceCount}/driverStandings.json?limit=500`;
          break;
        case "constructorStandings":
          fetchUri = `https://ergast.com/api/f1/${seasonSelector}/${selectedRaceCount}/constructorStandings.json?limit=500`;
          break;
      }

      fetch(fetchUri)
        .then((response) => response.json())
        .then((data) => {
          setFetchData(data);
          setClickCount((prev) => prev + 1);
        })
        .catch((err) => console.log(err));

      setTimeout(() => {
        handleScroll();
      }, 750);
    } else {
      if (!calendarToggle) {
        setClose(false);
        setTimeout(() => {
          setClose(true);
        }, 3500);
      }
    }
  }

  function closeError() {
    setClose(true);
  }

  const ref = useRef(null);
  const topRef = useRef(null);
  function handleScroll() {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }

  function scrollToTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function toggleTheme() {
    setThemeToggle((prev) => (prev ? false : true));
  }

  return (
    <div
      className="bg-[url('https://wallup.net/wp-content/uploads/2019/09/97350-formula-one-formula-1-race-racing-f-1.jpg')] bg-no-repeat bg-cover bg-center min-h-screen max-w-screen "
      ref={topRef}
    >
      <div className="fixed top-5 right-5">
        <a
          href="https://github.com/tarikuslu/f1-historical-data-app"
          target="_blank"
        >
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/github-1521500-1288242.png"
            alt="github icon"
            className="w-12"
          />
        </a>
      </div>
      <div className="hero min-h-screen bg-base-200 bg-opacity-80">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <div
              className={`alert alert-error shadow-lg mb-8 ${
                close ? "invisible" : "visible"
              }`}
            >
              <div onClick={closeError}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Error! One of your inputs not valid.</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold ">
              F1 Grand Prix Data Search App
            </h1>
            <p className="py-6 text-lg ">
              You can search many detailed data up to 1950!
            </p>
            <div className="flex flex-col gap-4 items-center">
              <select
                value={typeSelector}
                onChange={handleTypeChange}
                className="select select-bordered w-full max-w-xs "
              >
                <option disabled selected>
                  What data are you searching?
                </option>
                <option value={"raceResults"}>Race Results</option>
                <option value={"qualiResults"}>Qualifying Results</option>
                <option value={"calendarResults"}>Race Calendar</option>
                <option value={"driverStandings"}>Driver Standings</option>
                <option value={"constructorStandings"}>
                  Constructor Standings
                </option>
              </select>
              <select
                value={seasonSelector}
                onChange={handleSeasonChange}
                className="select select-bordered w-full max-w-xs"
              >
                <option disabled selected>
                  Which season?
                </option>
                {years.map((year) => {
                  return (
                    <option key={year} value={year}>
                      {" "}
                      {year}{" "}
                    </option>
                  );
                })}
              </select>
              <select
                value={selectedRaceCount}
                onChange={handleSelectedRaceCount}
                className="select select-bordered w-full max-w-xs"
                disabled={calendarToggle}
              >
                <option disabled selected>
                  Which round?
                </option>
                {raceRound.map((round) => {
                  return (
                    <option key={round} value={round}>
                      Round {round}
                    </option>
                  );
                })}
              </select>
              <button className="btn btn-wide" onClick={handleSearch}>
                Search
              </button>

              <div className="flex items-center gap-3 ">
                <span className="text-2xl">🌚</span>

                <input
                  type="checkbox"
                  className="toggle toggle-lg"
                  data-toggle-theme="light,dark"
                  data-act-class="ACTIVECLASS"
                />

                <span className="text-2xl">🌝</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white">
        {fetchData && (
          <Table
            data={fetchData}
            dataType={typeSelector}
            clickCount={clickCount}
            ref={ref}
          />
        )}

        {fetchData && (
          <button className="btn btn-block" onClick={scrollToTop}>
            Scroll To Top
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
