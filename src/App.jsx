import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Map from "./Map";
import Graph from "./Graph";
import "./App.css";
import InfoBox from "./InfoBox";
import Table from "./Table";

import { sortData } from "./utils";
import { Card, CardContent } from "@mui/material";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [conutryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountry = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((respose) => respose.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setCountries(countries);
          const sortedData = sortData(data);

          setTableData(sortedData);
        });
    };
    getCountry();
  }, []);

  const handleChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((respose) => respose.json())
      .then((data) => {
        setCountryInfo(data);
      });
  };

  return (
    <div className="app">
      <div className="left_container">
        <div className="app_header">
          <h1>COVID-19 TRACKER </h1>
          <FormControl className="app_dropdown">
            <Select onChange={handleChange} variant="outlined" value={country}>
              <MenuItem value="worldwide">worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="info__container">
          <InfoBox
            title="Coronavirus Cases"
            cases={conutryInfo.todayCases}
            total={conutryInfo.cases}
          />
          <InfoBox
            title="Recovery"
            cases={conutryInfo.todayRecovered}
            total={conutryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={conutryInfo.todayDeaths}
            total={conutryInfo.deaths}
          />
        </div>
        <div className="map">
          <Map />
        </div>
      </div>
      <div className="right__container">
        <div className="livecaese">
          <Card>
            <CardContent className="cardcontent">
              <h4 className="live">Live Cases by Country</h4>
              <Table countries={tableData} />
              <h4>Worldwide new cases</h4>
              <Graph />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
