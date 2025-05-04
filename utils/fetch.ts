export const normalFetch = async (
  route: string,
  method: string,
  body?: object
) => {
  const response = await fetch(`${route}`, {
    method: method.toUpperCase(),
    headers: {
      "Content-type": "application/json",
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : null,
  });

  return response;
};
