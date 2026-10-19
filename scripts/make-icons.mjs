import sharp from 'sharp';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#c98a00"/>
  <g fill="#fff">
    <rect x="96" y="196" width="40" height="120" rx="10"/>
    <rect x="148" y="166" width="40" height="180" rx="10"/>
    <rect x="200" y="238" width="112" height="36" rx="10"/>
    <rect x="324" y="166" width="40" height="180" rx="10"/>
    <rect x="376" y="196" width="40" height="120" rx="10"/>
  </g>
</svg>`;
const buf = Buffer.from(svg);
await sharp(buf).resize(192, 192).png().toFile('public/icon-192.png');
await sharp(buf).resize(512, 512).png().toFile('public/icon-512.png');
await sharp(buf).resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log('icons written');
