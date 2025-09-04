// Simple Next.js development server (no Socket.IO)
import next from 'next';
import { createServer } from 'http';

const dev = process.env.NODE_ENV !== 'production';
const port = 3000;
const hostname = '0.0.0.0';

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handler(req, res);
  });

  server.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });
});
