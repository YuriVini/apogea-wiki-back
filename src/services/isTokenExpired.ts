export const isTokenExpired = (createdAt: string): boolean => {
  const tokenDate = new Date(createdAt);

  const now = new Date();

  const differenceInMs = now.getTime() - tokenDate.getTime();

  const differenceInHours = differenceInMs / (1000 * 60 * 60);

  return differenceInHours > 1;
};
