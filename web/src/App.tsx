
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import Clients from './pages/Clients';
import Assets from './pages/Assets';
import Quotes from './pages/Quotes';
import ServiceReport from './pages/ServiceReport';

export function App(){
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Mechanical Services Suite
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" component={Link} to="/">Clients</Button>
            <Button color="inherit" component={Link} to="/assets">Assets</Button>
            <Button color="inherit" component={Link} to="/quotes">Quotes</Button>
            <Button color="inherit" component={Link} to="/service-report">Service Report</Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Routes>
          <Route path="/" element={<Clients/>} />
          <Route path="/assets" element={<Assets/>} />
          <Route path="/quotes" element={<Quotes/>} />
          <Route path="/service-report" element={<ServiceReport/>} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
