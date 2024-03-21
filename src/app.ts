import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';

const app: Application = express();

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: 'Ph Health Care Server'
    });
});

// Application Routes
app.use('/api/v1', router);

// Global Error Handler
app.use(globalErrorHandler);

// Not Found Routes
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your request path is not found!"
        }
    })
})

export default app;