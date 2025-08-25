
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

import clientsRouter from './routes/clients.js';
import sitesRouter from './routes/sites.js';
import suppliersRouter from './routes/suppliers.js';
import partsRouter from './routes/parts.js';
import assetsRouter from './routes/assets.js';
import quotesRouter from './routes/quotes.js';
import serviceReportsRouter from './routes/serviceReports.js';

const app = express();
app.use(cors());
app.use(express.json({limit: '10mb'}));
app.use(morgan('dev'));

const swaggerDocument = YAML.load(new URL('./openapi.yml', import.meta.url));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/clients', clientsRouter);
app.use('/api/sites', sitesRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/parts', partsRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/service-reports', serviceReportsRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
  console.log('Swagger docs at /docs');
});
