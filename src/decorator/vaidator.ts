import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { verifyObjectId } from '../utils/util.objectId';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => {
          return verifyObjectId(value);
        },
        defaultMessage(): string {
          return `${propertyName} must be a valid ObjectId`;
        },
      },
    });
  };
}

export function IsObjectIdOptional(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => {
          if (!value) return true;

          return verifyObjectId(value);
        },
        defaultMessage(): string {
          return `${propertyName} must be a valid ObjectId`;
        },
      },
    });
  };
}
