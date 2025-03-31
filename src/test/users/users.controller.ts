import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, BadRequestException, Header, Redirect, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryDto } from 'src/dto/query.dto';

@Controller('/test/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() queryDto: QueryDto) {
    const { offset, limit } = queryDto;

    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (+id < 1) {
      throw new BadRequestException('id 는 0보다 큰 값이어야 합니다.')
    }
    return this.usersService.findOne(+id);
  }

  @Header('Custom', 'Test Header')
  @Get(':id')
  findOneWithHeader(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('redirect/happykoo')
  @Redirect('https://happykoo.net', 302)
  redirect() {
    return {
      url: 'https://happykoo.net'
    };
  }

  @HttpCode(202)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
