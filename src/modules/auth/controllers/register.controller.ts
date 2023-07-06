import {
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Controller,
  Get,
  Res,
  Query
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services';
import { DataResponse } from 'src/kernel';
import { UserCreatePayload } from 'src/modules/user/payloads';
import { SettingService } from 'src/modules/settings';
import { STATUS_PENDING_EMAIL_CONFIRMATION, STATUS_ACTIVE, ROLE_USER } from 'src/modules/user/constants';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Response } from 'express';
import { AuthCreateDto } from '../dtos';
import { UserRegisterPayload } from '../payloads';
import { AuthService } from '../services';

@Controller('auth')
export class RegisterController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('users/register')
  @HttpCode(HttpStatus.OK)
  async userRegister(
    @Body() req: UserRegisterPayload
  ): Promise<DataResponse<{ message: string }>> {
    const requireEmailVerification = SettingService.getValueByKey(
      'requireEmailVerification'
    );

    const user = await this.userService.create(new UserCreatePayload(req), {
      status: requireEmailVerification
        ? STATUS_PENDING_EMAIL_CONFIRMATION
        : STATUS_ACTIVE,
      roles: ROLE_USER
    });

    await Promise.all([
      req.email && this.authService.create(new AuthCreateDto({
        source: 'user',
        sourceId: user._id,
        type: 'email',
        value: req.password,
        key: req.email
      })),
      req.username && this.authService.create(new AuthCreateDto({
        source: 'user',
        sourceId: user._id,
        type: 'username',
        value: req.password,
        key: req.username
      }))
    ]);
    // if require for email verification, we will send verification email
    requireEmailVerification && user.email && await this.authService.sendVerificationEmail({
      _id: user._id,
      email: user.email
    });
    return DataResponse.ok({
      message: requireEmailVerification ? 'Please verify your account using the verification email sent to you.' : 'You have successfully registered.'
    });
  }

  @Get('email-verification')
  public async verifyEmail(
    @Res() res: Response,
    @Query('token') token: string
  ) {
    if (!token) {
      return res.render('404.html');
    }
    await this.authService.verifyEmail(token);
    if (process.env.EMAIL_VERIFIED_SUCCESS_URL) {
      return res.redirect(process.env.EMAIL_VERIFIED_SUCCESS_URL);
    }

    return res.redirect(`${process.env.BASE_URL}/auth/login`);
  }
}
