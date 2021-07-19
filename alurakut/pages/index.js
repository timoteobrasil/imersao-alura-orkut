import React from 'react';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(props) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>

        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
      {/* <ul>
        {props.items.map((itemAtual) => {
          return (
            <li key={itemAtual}>
              <a href={`/users/${itemAtual}`}>
                <img src={`https://github.com/${itemAtual}.png`} />
                <span>{itemAtual}</span>
              </a>
            </li>
          )
        })}
      </ul> */}
    </ProfileRelationsBoxWrapper>
  )
}
export default function Home() {
  const pessoaAleatoria = 'timoteobrasil'
  const [comunidades, setComunidades] = React.useState([])
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]
  const [seguidores, setSeguidores] = React.useState([])
  React.useEffect(function () {
    fetch(`https://api.github.com/users/${pessoaAleatoria}/followers`)
      .then(function (response) {
        return response.json()
      })
      .then(function (json) {
        setSeguidores(json)
      })

    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '82d2d9bd984fa665a72c05bce82ebb',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "query": `query {
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
          }
          _allCommunitiesMeta {
            count
          }
        }
        `})
    })
    .then(response => response.json())
    .then((respostaJson) => {
      const comunidadesBackend = respostaJson.data.allCommunities
      setComunidades(comunidadesBackend)
    })
  }, [])
  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={pessoaAleatoria} />
        </div>
        <div style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo
            </h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault()
              const dadosDoForm = new FormData(e.target)
              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: pessoaAleatoria,
              }

              fetch('/api/comunidades/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(comunidade),
              })
              .then(async(response) => {
                const dados = await response.json()
                console.log(dados.novaComunidade)
                const comunidadeCriada = dados.novaComunidade
                const comunidadesAtualizadas = [...comunidades, comunidadeCriada]
                setComunidades(comunidadesAtualizadas)
              }) 

              //setComunidades([...comunidades, comunidade])
            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="URL da capa"
                  name="image"
                  aria-label="URL da capa"
                />
              </div>
              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((item) => {
                  return (
                    <li key={item.id}>
                      <a href={`/communities/${item.id}`}>
                        <img src={item.imageUrl} />
                        <span>{item.title}</span>
                      </a>
                    </li>
                  )
                })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade ({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.map((pessoa) => {
                return (
                  <li key={pessoa}>
                    <a href={`/users/${pessoa}`}>
                      <img src={`https://github.com/${pessoa}.png`} />
                      <span>{pessoa}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
