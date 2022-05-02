export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  graphql: GraphqlConfig;
  security: SecurityConfig;
}

//TODO: Use type from lib
export interface NestConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

//TODO: Use type from lib
export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}

//TODO: Use type from lib
export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}
