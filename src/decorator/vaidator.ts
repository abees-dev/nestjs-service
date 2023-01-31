import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => {
          return /^[0-9a-fA-F]{24}$/.test(value);
        },
        defaultMessage(): string {
          return `${propertyName} must be a valid ObjectId`;
        },
      },
    });
  };
}
