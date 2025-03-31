import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { NotIn } from "src/validation/not-in";

export class CreateUserDto {
  @NotIn('password', { message: 'password는 name과 같은 문자열을 포함할 수 없습니다.'})
  @Transform(params => params.value.trim())
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  // @Transform(({ value, obj }) => {
  //   if (obj.password.includes(obj.name.trim())) {
  //     throw new BadRequestException('password 는 name 과 같은 문자열이 포함될 수 없습니다.')
  //   }
  //   return value;
  // })
  @IsString()
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    {
      message: '비밀번호는 최소 8자 이상이며, 영문 대/소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.',
    },
  )
  readonly password: string;
}