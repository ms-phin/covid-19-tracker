import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Map from "./Map";
import Graph from "./Graph";
import "./App.css";
import InfoBox from "./InfoBox";
import Table from "./Table";
import "leaflet/dist/leaflet.css";

import { sortData, prettyPrintStat } from "./utils";
import { Card, CardContent } from "@mui/material";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [conutryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746, 18.4796]);
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  // https://disease.sh/v3/covid-19/countries
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
          console.log(data);
          setMapCountries(data);
        });
    };
    getCountry();
  }, []);

  useEffect(() => {
    if (country === "worldwide") {
      setMapZoom(2);
    } else {
      setMapZoom(4);
    }
  }, [mapCenter, country]);

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

    let centerArray;
    if (countryCode === "worldwide") {
      centerArray = [34.80746, 18.4796];
    } else {
      centerArray = [data.countryInfo.lat, data.countryInfo.long];
    }
    setMapCenter(centerArray);
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
            onClick={(event) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(conutryInfo.todayCases)}
            total={prettyPrintStat(conutryInfo.cases)}
          />
          <InfoBox
            onClick={(event) => setCasesType("recovered")}
            title="Recovery"
            cases={prettyPrintStat(conutryInfo.todayRecovered)}
            total={prettyPrintStat(conutryInfo.recovered)}
          />
          <InfoBox
            onClick={(event) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(conutryInfo.todayDeaths)}
            total={prettyPrintStat(conutryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <div className="right__container">
        <div className="livecaese">
          <Card>
            <CardContent className="cardcontent">
              <h4 className="live">Live Cases by Country</h4>
              <Table className="home__table" countries={tableData} />
              <h4 className="home__table">Worldwide new cases</h4>
              <Graph casesType={casesType} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
