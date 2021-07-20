import { SiteClient } from "datocms-client";
export default async function wololo(request, response) {
  if (request.method === "POST") {
    const TOKEN_DATO = "55fd7c7facbb4c0ec288cc84adfe15";
    const ID_TIPO_COMUNIDADE_DATO = "968419";
    const client = SiteClient(TOKEN_DATO);

    const novaComunidade = await client.items.create({
      itemType: ID_TIPO_COMUNIDADE_DATO,
      ...request.body,
      // title: "Teste de criação de comunidade usando a API do dato",
      // imageUrl: "http://placehold.it/300",
      // creatorSlug: "timoteobrasil",
    });

    console.log(novaComunidade);

    response.json({
      novaComunidade: novaComunidade,
    });

    return;
  }

  response.status(405).json({
    message: "Só POST neste endpoint",
  });
}
