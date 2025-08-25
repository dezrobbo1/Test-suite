
import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { Box, Button, Card, CardContent, Divider, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type Line = { description: string; qty: number; unitRateEx: number; itemType?: string };

export default function Quotes(){
  const [quotes, setQuotes] = useState<any[]>([]);
  const [clientId, setClientId] = useState<string>('');
  const [siteId, setSiteId] = useState<string>('');
  const [lines, setLines] = useState<Line[]>([ { description:'Labour – Fitter L2', qty:6, unitRateEx:95, itemType:'Labour' } ]);
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);

  async function load(){
    const res = await api.get('/quotes');
    setQuotes(res.data);
  }
  useEffect(()=>{ load(); },[]);

  function addLine(){
    setLines([...lines, { description:'', qty:1, unitRateEx:0 }]);
  }
  function updateLine(i:number, patch:Partial<Line>){
    const copy = [...lines];
    copy[i] = { ...copy[i], ...patch };
    setLines(copy);
  }
  function removeLine(i:number){
    const copy = [...lines];
    copy.splice(i,1);
    setLines(copy);
  }

  const subtotal = useMemo(()=> lines.reduce((s,l)=> s + (l.qty * l.unitRateEx), 0), [lines]);
  const gst = subtotal * 0.10;
  const total = subtotal + gst;

  async function createQuote(){
    if(!clientId) return alert('Enter clientId (see Clients page / Swagger for IDs)');
    const payload = {
      clientId, siteId: siteId || null,
      items: lines.map(l => ({ ...l, qty: Number(l.qty), unitRateEx: Number(l.unitRateEx) }))
    };
    const res = await api.post('/quotes', payload);
    setLastCreatedId(res.data.id);
    await load();
  }

  async function pdf(){
    if(!lastCreatedId) return alert('Create a quote first.');
    const res = await fetch(`http://localhost:4000/api/quotes/${lastCreatedId}/pdf`, { method:'POST' });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quote.pdf';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Quotes</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>New Quote</Typography>
              <Stack spacing={2}>
                <TextField label="Client ID" value={clientId} onChange={e=>setClientId(e.target.value)} />
                <TextField label="Site ID (optional)" value={siteId} onChange={e=>setSiteId(e.target.value)} />
                <Divider/>
                {lines.map((l, i) => (
                  <Stack direction="row" spacing={1} key={i}>
                    <TextField label="Description" fullWidth value={l.description} onChange={e=>updateLine(i,{description:e.target.value})}/>
                    <TextField label="Qty" type="number" sx={{width:120}} value={l.qty} onChange={e=>updateLine(i,{qty: Number(e.target.value)})}/>
                    <TextField label="Rate ex" type="number" sx={{width:140}} value={l.unitRateEx} onChange={e=>updateLine(i,{unitRateEx: Number(e.target.value)})}/>
                    <IconButton onClick={()=>removeLine(i)}><DeleteIcon/></IconButton>
                  </Stack>
                ))}
                <Stack direction="row" spacing={1}>
                  <Button onClick={addLine}>Add Line</Button>
                </Stack>
                <Divider/>
                <Typography>Subtotal ex: {subtotal.toFixed(2)}</Typography>
                <Typography>GST (10%): {gst.toFixed(2)}</Typography>
                <Typography>Total inc: {total.toFixed(2)}</Typography>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" onClick={createQuote}>Create Quote</Button>
                  <Button variant="outlined" onClick={pdf}>Download PDF</Button>
                </Stack>
                {lastCreatedId && <Typography variant="caption">Last created ID: {lastCreatedId}</Typography>}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Recent Quotes</Typography>
              <Stack spacing={1}>
                {quotes.map(q => (
                  <Card key={q.id} variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2">{q.number} — {q.status}</Typography>
                      <Typography variant="body2">Total inc: {(Number(q.totalInc)).toFixed(2)}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
