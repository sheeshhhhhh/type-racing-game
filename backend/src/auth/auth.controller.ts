import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import RegisterDto from './dto/Register.dto';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalStrategy)
    @Post('login')
    async login(@Request() req: any) {
        if(req.user.multiFA) {
            // make a service in the auth that makes a new token and sends gives it to the database for email verification
            return this.authService.generateEmailToken(req.user.user)
        }
        return this.authService.login(req.user.user);
    }
     
    @Post("VerifyMultiFa")
    async verifyEmailToken(@Body() body: any) {
        return this.authService.veryfyEmailToken(body.userId, body.token)
    }

    @Post('register')
    register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('check')
    async checl(@Request() req: any) {
        return this.authService.checkUser(req)
    }

    @Post('refreshtoken')
    async refreshToken(@Body() body: any) {
        return this.authService.refreshToken(body.RefreshToken)
    }
}
