import React, { useState } from "react"
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Home from "../src/components/Home"
import Analyses from "../src/components/Analyses"
import EntriesList from "../src/components/EntriesList";
import { Row } from "../src/types";

export default function App() {
  const [rows, setRows] = useState<Row[]>([]);

  return (
    <>
      <Router>
        <Home rows={rows} setRows={setRows} />
        <NavLink to="/">Home</NavLink>
        <ul></ul>
        <NavLink to="/Entries">Entries</NavLink>
        <ul></ul>
        <NavLink to="/Analyses">Analyses</NavLink>
        <Routes>
          <Route path="/" element={<div>Home</div> } />
          <Route path="/Entries" element={<EntriesList rows={rows}/>} />
          <Route path="/Analyses" element={<Analyses rows={rows}/>} />
        </Routes>
      </Router>
    </>
  )
}