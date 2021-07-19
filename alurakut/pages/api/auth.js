import jwt from "jsonwebtoken";

export default async function githubAuth(req, res) {
  const urlApiGithub = "https://api.github.com/users";
  const { authorization } = req.headers;
  let isAuthenticated = false;

  const tokenDecoded = jwt.decode(authorization);

  if (tokenDecoded) {
    isAuthenticated = await fetch(
      `${urlApiGithub}/${tokenDecoded.githubUser}`
    ).then((response) => response.ok);
  }
  res.send({
    isAuthenticated,
  });
}
