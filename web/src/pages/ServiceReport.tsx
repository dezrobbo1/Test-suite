
import React, { useState } from 'react';
import { api } from '../api';
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import SignaturePad from '../components/SignaturePad';

export default function ServiceReport(){
  const [assetId, setAssetId] = useState('');
  const [summary, setSummary] = useState('');
  const [serviceReportId, setServiceReportId] = useState<string | null>(null);
  const [sigData, setSigData] = useState<string>('');

  async function create(){
    if(!assetId || !summary) return alert('Enter assetId and summary');
    const res = await api.post('/service-reports', { assetId, summary });
    setServiceReportId(res.data.id);
  }
  async function sign(){
    if(!serviceReportId || !sigData) return;
    await api.post(`/service-reports/${serviceReportId}/signature`, {
      signedByName: 'Client Rep',
      role: 'Client',
      method: 'touch',
      imageData: sigData
    });
    alert('Signature saved');
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Service Report (Demo)</Typography>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField label="Asset ID" value={assetId} onChange={e=>setAssetId(e.target.value)} />
            <TextField label="Summary" value={summary} onChange={e=>setSummary(e.target.value)} />
            <Button variant="contained" onClick={create}>Create Report</Button>
            <Typography variant="body2">Report ID: {serviceReportId || '-'}</Typography>
            <Typography variant="subtitle2">Signature</Typography>
            <SignaturePad onChange={setSigData} />
            <Button variant="outlined" onClick={sign} disabled={!serviceReportId || !sigData}>Save Signature</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
