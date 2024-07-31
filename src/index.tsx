import { createRoot } from 'react-dom/client';
import {useEffect, useRef, useState} from 'react';
import * as esbuild from 'esbuild-wasm';
import {unpkgPathPlugin} from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const serviceRef = useRef<any>();

  const startService = async () => {
    serviceRef.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    })
  }

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!serviceRef.current) return;

    const result = await serviceRef.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [
        unpkgPathPlugin(),
        fetchPlugin(input)
      ],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      }
    })

    setCode(result.outputFiles[0].text);
  }

  return (
    <div>
      <textarea value={input} onChange={e => setInput(e.target.value)}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
      <iframe src="/test.html" />
    </div>
  )
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
