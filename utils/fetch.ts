export const normalFetch = async (
  route: string,
  method: string,
  body?: object
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}${route}`, {
    method: method.toUpperCase(),
    headers: {
      "Content-type": "application/json",
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : null,
  });

  return response;
};
