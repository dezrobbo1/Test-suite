
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Box, Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';

export default function Clients(){
  const [clients, setClients] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ name:'', abn:'', billingEmail:'', billingAddress:'', phone:'' });

  async function load(){
    const res = await api.get('/clients');
    setClients(res.data);
  }
  useEffect(()=>{ load(); },[]);

  async function create(){
    await api.post('/clients', form);
    setForm({ name:'', abn:'', billingEmail:'', billingAddress:'', phone:'' });
    await load();
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Clients</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>New Client</Typography>
              <Stack spacing={2}>
                <TextField label="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
                <TextField label="ABN" value={form.abn} onChange={e=>setForm({...form, abn:e.target.value})}/>
                <TextField label="Billing Email" value={form.billingEmail} onChange={e=>setForm({...form, billingEmail:e.target.value})}/>
                <TextField label="Billing Address" value={form.billingAddress} onChange={e=>setForm({...form, billingAddress:e.target.value})}/>
                <TextField label="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
                <Button variant="contained" onClick={create}>Create</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Grid container spacing={2}>
            {clients.map(c => (
              <Grid item xs={12} key={c.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{c.name}</Typography>
                    <Typography variant="body2">ABN: {c.abn || '-'}</Typography>
                    <Typography variant="body2">{c.billingEmail || ''}</Typography>
                    <Typography variant="body2">{c.billingAddress || ''}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
