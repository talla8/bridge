import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SUPER_SECRET_JWT_KEY', // لازم يطابق الmodule
    });
  }

  async validate(payload: any) {
    // اللي برجع من هون ينحط في req.user
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}
