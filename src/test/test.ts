import { IsEmail, MaxLength, IsString, Matches, validate } from "class-validator";

class UserDto {
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @IsString()
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)
  readonly password: string;
}

const userDto = new UserDto("test@test.com", "Password123");
console.log(userDto);

// 유효성 검사
validate(userDto).then((errors) => {
  console.log(errors[0]);
});

function first(message: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first: ", message);
  };
}

function second(message: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second: ", message);
    return descriptor;
  }
}

class TestClass {
  @first('Hello')
  @second('Hello2')
  test() {
    console.log("test 메서드 호출");
  }
}

const t = new TestClass();
t.test();
