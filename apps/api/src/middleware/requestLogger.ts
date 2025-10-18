import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // Store original end function
  const originalEnd = res.end;

  // Override end function to log response time
  res.end = function(this: Response, ...args: any[]) {
    const duration = Date.now() - start;

    console.log('📝 API Request:', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress,
      userId: (req as any).user?.id,
    });

    // Call original end function
    originalEnd.apply(this, args);
  };

  next();
};