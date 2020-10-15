import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./App.css";
import {
    FormControl,
    Select,
    MenuItem,
    Card,
    CardContent,
} from "@material-ui/core";
import Infoboxes from "./Infoboxes";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState("Worldwide");
    const [url, setUrl] = useState("all");
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] = useState({
        lat: 34.80746,
        lng: -40.4796,
    });
    const [mapZoom, setMapZoom] = useState(3);
    const [casesType, setCasesType] = useState("cases");
    useEffect(() => {
        async function fetchCountries() {
            const request = await axios.get("countries");
            const data = request.data;
            setCountries(data);
            const sortedData = sortData(data);
            setTableData(sortedData);
        }
        fetchCountries();
    }, []);
    const countryChange = async (event) => {
        const countryCode = event.target.value;
        setCountry(countryCode);
        setUrl(
            countryCode === "Worldwide" ? "all" : "countries/" + countryCode
        );
    };
    useEffect(() => {
        async function fetchStat() {
            const request = await axios.get(url);
            const responseData = request.data;
            setCountryInfo(responseData);

            //responseData?.countryInfo && console.log(responseData.countryInfo);
            if (url !== "all") {
                setMapCenter({
                    lat: responseData.countryInfo.lat,
                    lng: responseData.countryInfo.long,
                });
                setMapZoom(4);
            } else {
                setMapZoom({
                    lat: 34.80746,
                    lng: -40.4796,
                });
                setMapZoom(3);
            }
        }
        fetchStat();
    }, [url]);

    return (
        <div className="app">
            <div className="app__left">
                <div className="app__header">
                    <h1>Covid-19 Tracker</h1>
                    <FormControl className="app__dropdown">
                        <Select
                            variant="outlined"
                            value={country}
                            onChange={countryChange}
                        >
                            <MenuItem value="Worldwide">Worldwide</MenuItem>
                            {countries.map((country) => {
                                return (
                                    <MenuItem
                                        key={country.country}
                                        value={country.countryInfo.iso2}
                                    >
                                        {country.country}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </div>
                <div className="app__stats">
                    <Infoboxes
                        isRed
                        active={casesType === "cases"}
                        onClick={(e) => setCasesType("cases")}
                        title="Cronovirus Cases"
                        cases={prettyPrintStat(countryInfo.todayCases)}
                        total={prettyPrintStat(countryInfo.cases)}
                    />
                    <Infoboxes
                        active={casesType === "recovered"}
                        onClick={(e) => setCasesType("recovered")}
                        title="Recovered"
                        cases={prettyPrintStat(countryInfo.todayRecovered)}
                        total={prettyPrintStat(countryInfo.recovered)}
                    />
                    <Infoboxes
                        isRed
                        active={casesType === "deaths"}
                        onClick={(e) => setCasesType("deaths")}
                        title="Death"
                        cases={prettyPrintStat(countryInfo.todayDeaths)}
                        total={prettyPrintStat(countryInfo.deaths)}
                    />
                </div>
                <Map
                    casesType={casesType}
                    countries={countries}
                    center={mapCenter}
                    zoom={mapZoom}
                />
            </div>
            <Card className="app__right">
                <CardContent>
                    <h3>Live Cases by Country</h3>
                    <Table countries={tableData} />
                    <h3 className="app__graphTitle">
                        WorldWide new {casesType}
                    </h3>
                    <LineGraph className="app__graph" casesType={casesType} />
                </CardContent>
            </Card>
        </div>
    );
}

export default App;
