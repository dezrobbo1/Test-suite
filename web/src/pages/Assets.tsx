
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Box, Card, CardContent, Grid, TextField, Typography, Button, Stack } from '@mui/material';

export default function Assets(){
  const [assets, setAssets] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ clientId:'', siteId:'', assetTag:'', name:'' });

  async function load(){
    const res = await api.get('/assets');
    setAssets(res.data);
  }
  useEffect(()=>{ load(); },[]);

  async function create(){
    if(!form.clientId || !form.siteId || !form.assetTag || !form.name) return alert('Please fill clientId, siteId, assetTag, name');
    await api.post('/assets', form);
    setForm({ clientId:'', siteId:'', assetTag:'', name:'' });
    await load();
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Assets</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>New Asset</Typography>
              <Stack spacing={2}>
                <TextField label="Client ID" value={form.clientId} onChange={e=>setForm({...form, clientId:e.target.value})}/>
                <TextField label="Site ID" value={form.siteId} onChange={e=>setForm({...form, siteId:e.target.value})}/>
                <TextField label="Asset Tag" value={form.assetTag} onChange={e=>setForm({...form, assetTag:e.target.value})}/>
                <TextField label="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
                <Button variant="contained" onClick={create}>Create</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Grid container spacing={2}>
            {assets.map(a => (
              <Grid item xs={12} key={a.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{a.assetTag} — {a.name}</Typography>
                    <Typography variant="body2">Client: {a.clientId} | Site: {a.siteId}</Typography>
                    <Typography variant="body2">{a.assetType || ''} {a.model || ''}</Typography>
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
