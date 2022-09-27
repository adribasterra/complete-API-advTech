export interface AuthMiddleware {
  validateRequest(req: any, res: any, next: any): void;
}
