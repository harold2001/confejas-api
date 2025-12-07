import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from '../users/repositories/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is a Participant (not allowed to login)
    const isParticipant = user.roles?.some(
      (role) => role.name === 'Participant',
    );
    if (isParticipant && user.roles?.length === 1) {
      throw new UnauthorizedException('Participants are not allowed to login');
    }

    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = user;

    // Generate both access and refresh tokens
    const tokens = this.generateTokens(userWithoutPassword);

    return {
      message: 'Login successful',
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('app.jwtSecret'),
      });

      // Get fresh user data
      const user = await this.userService.findOne({ id: payload.id });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { password: _, ...userWithoutPassword } = user;

      // Generate new access token
      const accessToken = this.jwtService.sign(
        { ...userWithoutPassword },
        {
          secret: this.configService.get<string>('app.jwtSecret'),
          expiresIn: this.configService.get<string>('app.jwtBearerExpiration'),
        },
      );

      return {
        accessToken,
        user: userWithoutPassword,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(user: any) {
    const payload = { ...user };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('app.jwtSecret'),
      expiresIn: this.configService.get<string>('app.jwtBearerExpiration'),
    });

    const refreshToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      {
        secret: this.configService.get<string>('app.jwtSecret'),
        expiresIn: this.configService.get<string>('app.jwtRefreshExpiration'),
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
