import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

export function NotIn(property: string, validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'NotIn', //데커레이터 이름
            target: object.constructor, //이 데커레이터는 객체가 생성될 때 적용
            propertyName,
            options: validationOptions,
            constraints: [ property ], //속성에 적용
            validator: {
                validate(value: any, args: ValidationArguments): Promise<boolean> | boolean {
                    const [ relatedPropertyName ] = args.constraints;
                    const relatedValue = (args.object as any) [relatedPropertyName];

                    return typeof value === 'string' 
                        && typeof relatedValue === 'string'
                        && !relatedValue.includes(value);
                }
            }
        })
    }
}