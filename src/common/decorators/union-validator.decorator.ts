import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsUnion', async: false })
class IsUnionConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const allowedValues = args.constraints[0];
    return allowedValues.includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `Value must be one of the following: ${args.constraints[0].join(', ')}`;
  }
}
/**
 * union type validator
 * @summary Use `@IsUnion(['foo', 'bar'])` like class validator
 * @param types ( value array )
 * @param? validationOptions
 * @returns boolean | string
 */
export function IsUnion(types: readonly string[], validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [types],
      options: validationOptions,
      validator: IsUnionConstraint,
    });
  };
}
