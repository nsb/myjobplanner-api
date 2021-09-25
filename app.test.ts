import express from 'express';

function uselessMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) { next() }