import { AppConfig } from './config/AppConfig';
import { createApp } from './app';

const config = AppConfig.getInstance();
const app = createApp();
const port = config.port;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port} [${config.nodeEnv}]`);
});
