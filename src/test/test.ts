import { BadRequestException } from "@nestjs/common";
import { IsEmail, MaxLength, IsString, Matches, validate, Validate } from "class-validator";

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

function firstDeco(message: string) {
  console.log("first evaluated!");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first call: ", message);
  };
}

function secondDeco(message: string) {
  console.log("second evaluate!");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second call: ", message);
  }
}

class MethodDecoTestClass {
  @firstDeco('Hello')
  @secondDeco('Hello2')
  test() {
    console.log("test 메서드 호출");
  }
}

const t = new MethodDecoTestClass();
t.test();

function reportableClassDeco<T extends { new (...args: any[]): {} }> (constructor: T) {
  return class extends constructor {
    reportingURL = "http://happykoo.net";
  }
}


@reportableClassDeco
class ClassDecoTestClass {
  type = "report";
  title: string;

  constructor(title: string) {
    this.title = title;
  }
}

const t2 = new ClassDecoTestClass("happy");
console.log(t2);

function CustomMinLength(min: number) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    target.validators = {
      ...target.validators,
      minLength(args: string[]) {
        return args[parameterIndex].length >= min;
      }
    }
  }
}


function CustomValidate(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = function(...args) {
    Object.keys(target.validators).forEach(key => {
      if (!target.validators[key] (args)) {
        throw new BadRequestException();
      }
    })
    method.apply(this, args);
  }
}

class ParamDecoTestClass {
  private name: string;

  @CustomValidate
  setName(@CustomMinLength(3) name: string) {
    this.name = name;
  }
}


const t3 = new ParamDecoTestClass();
// t3.setName('de');
t3.setName('DeHE');