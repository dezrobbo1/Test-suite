
import React, { useEffect, useRef } from 'react';
import SignaturePad from 'signature_pad';

type Props = { onChange: (dataUrl: string) => void };

export default function Signature({ onChange }: Props){
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(()=>{
    if(!ref.current) return;
    const pad = new SignaturePad(ref.current, { minWidth: 1, maxWidth: 2 });
    const handler = () => onChange(pad.toDataURL('image/png'));
    pad.addEventListener('endStroke', handler);
    return () => pad.removeEventListener('endStroke', handler as any);
  },[ref.current]);
  return <canvas ref={ref} width={500} height={180} style={{ border:'1px solid #ccc', borderRadius:8 }} />;
}
