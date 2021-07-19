import { SiteClient } from 'datocms-client'
export default async function wololo(request, response) {

    if(request.method === 'POST') {

        const TOKEN = '55fd7c7facbb4c0ec288cc84adfe15'
        const client = SiteClient(TOKEN)
        
        const novaComunidade = await client.items.create({
            itemType: "968419",
            ...request.body,
            // title: "Teste de criação de comunidade usando a API do dato",
            // imageUrl: "http://placehold.it/300",
            // creatorSlug: "timoteobrasil",
        })

        console.log(novaComunidade)
        
        response.json({
            novaComunidade: novaComunidade
        })

        return
    }

    response.status(404).json({
        message: 'Nada ainda'
    })
}