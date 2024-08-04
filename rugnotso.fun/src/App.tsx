import { useEffect, useRef, useState } from 'react';
import '@mantine/core/styles.css';
import { Button } from '@mantine/core';

import { MantineProvider } from '@mantine/core';
import './App.css';

function Rug() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  const [running, setRunning] = useState(false);

  // Rug display constants
  const width = 512;
  const height = 512;
  const pixelSize = 10;
  const rugWidth = 13;
  const rugHeight = 20;
  const rugXMid = width / 2 - pixelSize / 2;
  const rugYMid = height / 2 - pixelSize / 2;

  useEffect(() => {
    const canvas = ref.current;

    if (canvas) {
      canvas.width = width;
      canvas.height = height;
      generateBatch();
    }
  }, []);

  // Simulates a generate animation that cycles through `number`
  // types of rugs
  function generateBatch(cycles: number = 300) {
    if (!ref.current) return;

    if (!running) {
      setRunning(true);

      const ctx = ref.current.getContext('2d');
      if (ctx) {
        for (let i = 0; i < cycles; i++) {
          const hash = generateRandomHex();
          setTimeout(() => { generatePixelArt(ctx, hash) }, i);
        }
      }
    }

    setRunning(false);
  }

  // Function to draw a pixel at given coordinates with specified color
  function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, pixelSize, pixelSize);
  }

  // Function to generate the pixel art pattern based on a SHA-256 hash
  function generatePixelArt(ctx: CanvasRenderingContext2D, hash: string) {
    const data = new Uint8Array(hash.match(/.{2}/g)!.map((byte) => parseInt(byte, 16)));

    let colors = hash.match(/.{6}/g)!.map((m) => '#' + m);
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let x = 0; x < rugWidth; x++) {
      for (let y = 0; y < rugHeight; y++) {
        const color = x == rugWidth - 1 ? colors[0] : colors[(x * y * data[x]) % colors.length];
        const baseX = x * pixelSize;
        const baseY = y * pixelSize;

        drawPixel(ctx, rugXMid - baseX, rugYMid - baseY, color);
        drawPixel(ctx, rugXMid + baseX, rugYMid + baseY, color);
        drawPixel(ctx, rugXMid - baseX, rugYMid + baseY, color);
        drawPixel(ctx, rugXMid + baseX, rugYMid - baseY, color);
      }

      const trimColor = colors[x % 2];

      if (x % 2 == 0) {
        drawPixel(ctx, rugXMid - x * pixelSize, rugYMid - (rugHeight + 1) * pixelSize, trimColor);
        drawPixel(ctx, rugXMid + x * pixelSize, rugYMid - (rugHeight + 1) * pixelSize, trimColor);
        drawPixel(ctx, rugXMid - x * pixelSize, rugYMid + (rugHeight + 1) * pixelSize, trimColor);
        drawPixel(ctx, rugXMid + x * pixelSize, rugYMid + (rugHeight + 1) * pixelSize, trimColor);
      }

      drawPixel(ctx, rugXMid + x * pixelSize, rugYMid - (rugHeight - 1) * pixelSize, colors[0]);
      drawPixel(ctx, rugXMid - x * pixelSize, rugYMid - (rugHeight - 1) * pixelSize, colors[0]);
      drawPixel(ctx, rugXMid + x * pixelSize, rugYMid + (rugHeight - 1) * pixelSize, colors[0]);
      drawPixel(ctx, rugXMid - x * pixelSize, rugYMid + (rugHeight - 1) * pixelSize, colors[0]);
      drawPixel(ctx, rugXMid + x * pixelSize, rugYMid - rugHeight * pixelSize, trimColor);
      drawPixel(ctx, rugXMid - x * pixelSize, rugYMid - rugHeight * pixelSize, trimColor);
      drawPixel(ctx, rugXMid + x * pixelSize, rugYMid + rugHeight * pixelSize, trimColor);
      drawPixel(ctx, rugXMid - x * pixelSize, rugYMid + rugHeight * pixelSize, trimColor);
    }
  }

  function generateRandomHex() {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);

    let hexString = '';
    for (let i = 0; i < randomBytes.length; i++) {
      const hex = randomBytes[i].toString(16).padStart(2, '0');
      hexString += hex;
    }

    return hexString;
  }

  return (
    <div>
      <div className='card'>
        <canvas id='rug' ref={ref}></canvas>
      </div>
      <Button variant='filled' onClick={() => generateBatch()}>Generate rug</Button>
    </div>
  )
}

function App() {
  return (
    <MantineProvider>
      <h1>rugnotso.fun</h1>
      <h2>Launch a rug NFT on the Solana devnet with a single click</h2>
      <Rug />
    </MantineProvider>
  );
}

export default App;
