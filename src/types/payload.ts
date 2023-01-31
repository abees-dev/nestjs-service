export interface IJwtPayload {
  id: string;
  lat: number;
  lng: number;
  iat?: number;
  exp?: number;
}
