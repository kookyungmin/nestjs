import { Body, Controller, Get, Param, Post, Query, Headers, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UsersService } from './users.service';
import { UserInfo } from './user-info';
import { CustomValidationPipe } from 'src/validation/custom-validation-pipe';
import { AuthGuard } from 'src/guard/auth.guard';
import { LoginUser } from './decorator/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body(CustomValidationPipe) dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }

  @Post('/email-verify')
  async verfiyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  @Get('/login-user')
  @UseGuards(AuthGuard)
  async getUserInfo(@LoginUser() loginUser): Promise<UserInfo> {
    return loginUser;
  }
}
