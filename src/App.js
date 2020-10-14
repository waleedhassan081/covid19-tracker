import React,{useState,useEffect} from 'react';
import axios from './axios';
import './App.css';
import {FormControl,Select,MenuItem, Card, CardContent} from '@material-ui/core';
import Infoboxes from './Infoboxes'
import Map from './Map'
function App() {
    const [countries,setCountries]=useState([]);
    const [country,setCountry]=useState("Worldwide");
    const [url,setUrl]=useState('all');
    useEffect(()=>{
        async function fetchCountries(){
            const request= await axios.get('countries');
            setCountries(request.data);
        }
        fetchCountries();
    },[]);
    const countryChange=async (event)=>{
        const countryCode=event.target.value;
        setCountry(countryCode);
        setUrl( countryCode === 'Worldwide' ? 'all': 'countries/'+countryCode);
        
    }
    useEffect(() => {
        async function fetchStat(){
            const request=await axios.get(url);
            console.table(request.data);
        }
        fetchStat();
    }, [url])
   
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
                        {
                            countries.map((country)=>
                            {
                            return (
                            <MenuItem key={country.country} value={country.countryInfo.iso2}>{country.country}</MenuItem>
                            )
                            })
                        }
                    </Select>
                </FormControl>
            </div>
            <div className="app__stats">
                    <Infoboxes title="Cronovirus Cases" cases={200} total={890000} />
                    <Infoboxes title="Cases" cases={100} total={390000} />
                    <Infoboxes title="Death" cases={200} total={490000} />
            </div>
            <Map />
        </div>
        <Card className="app__right">
            <CardContent>
                <h3>Live Cases by Country</h3>
                <h3>WorldWide new cases</h3>
            </CardContent>
        </Card>
    </div>
  );
}

export default App;
