import jwt from "jsonwebtoken";

export default async function Loginzinho(req, res) {
  //sistema simples de autenticação baseado em um que postaram no discord
  const urlApiGithub = "https://api.github.com/users";

  if (req.method === "POST") {
    const {githubUser} = req.body

    const responseGit = await fetch(`${urlApiGithub}/${githubUser}`)
      .then(response => {
        //console.log(response)
        if(response.ok) {
          return response.json()
        } else {
          throw new Error(`Código de retorno inesperado: ${response.status} (${response.statusText}).`)
        }
      })
      .then(data => {
        if(data.node_id && data.login) {
          return {
            isSuccessful: true,
            node_id: data.node_id,
            login: data.login,
          }
        } else {
          throw new Error('Dados inválidos retornados pela api.')
        }
      })
      .catch(err => {
        console.log(err)
        return {
          isSuccessful: false,
          message: err
        }
      })

    if(responseGit.isSuccessful) {
      const usuario = {
        date: new Date().toISOString(),
        githubUser: responseGit.login,
        node_id: responseGit.node_id,
      }
      const token = jwt.sign(usuario, responseGit.node_id, { expiresIn: '1d'})
      res.status(200).json({
        token,
      })
    } else {
      res.status(401).json({
        message: responseGit.message
      })
    }
    return
  }

  res.status(405).json({
    message: "Só POST neste endpoint",
  });
}
