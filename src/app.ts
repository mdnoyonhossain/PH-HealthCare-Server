import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { UserRoutes } from './app/modules/User/user.routes';
import { AdminRoutes } from './app/modules/Admin/admin.routes';

const app: Application = express();

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: 'Ph Health Care Server'
    });
});

// Application Routes
app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/admin', AdminRoutes);

export default app;