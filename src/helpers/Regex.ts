export const getAddressFromMessage = (str: string): string | undefined => {
  const regex = /0x[a-fA-F0-9]{40}/;
  const matches = str.match(regex);
  if (matches?.length! > 0) {
    const address = matches![0];
    return address;
  }
  return undefined;
};
