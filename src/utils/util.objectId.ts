export const verifyObjectId = (value: string) => {
  return /^[0-9a-fA-F]{24}$/.test(value);
};
