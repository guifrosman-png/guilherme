# Proposta para Criação de Módulos Independentes

Este documento descreve a arquitetura recomendada para a criação de novos módulos como aplicações independentes que se integram de forma transparente ao Hub.App.

A abordagem se baseia em dois pilares: **Consistência de UI** através de uma biblioteca de componentes compartilhada e **Experiência de Usuário Contínua** através de Single Sign-On (SSO).

---

## Fases de Implementação

### Fase 1: Criação da Biblioteca de Componentes (Design System)

O objetivo desta fase é garantir que todas as aplicações (Hub.App e módulos) tenham a mesma aparência, evitando duplicação de código e inconsistências visuais.

1.  **Extrair a UI:** Os componentes genéricos de UI (localizados em `src/components/ui`), juntamente com as configurações do Tailwind (`tailwind.config.js`) e estilos globais, devem ser movidos para um projeto separado.
2.  **Publicar como Pacote:** Este novo projeto deve ser configurado como um pacote NPM, publicado em um registro privado (como o NPM, GitHub Packages, etc.).
3.  **Consumir o Pacote:** O Hub.App e todos os futuros módulos irão instalar este pacote de UI como uma dependência, garantindo que todos usem os mesmos botões, cards, inputs, etc.

### Fase 2: Desenvolvimento do Módulo como Aplicação Standalone

Cada novo módulo será sua própria aplicação React, com seu próprio ciclo de vida.

1.  **Novo Repositório:** Crie um novo repositório no Git para o módulo.
2.  **Setup do Projeto:** Inicie um novo projeto React (usando Vite, por exemplo).
3.  **Instalar Dependências:** Instale o React, a biblioteca de componentes compartilhada da Fase 1 e quaisquer outras dependências específicas do módulo.
4.  **Desenvolvimento:** Construa a funcionalidade do módulo normalmente, utilizando os componentes da biblioteca compartilhada para a UI.

### Fase 3: Implementação do Fluxo de Autenticação (SSO)

Esta é a fase chave que garante que o usuário não precise fazer login novamente ao navegar para um módulo.

**No Hub.App (Aplicação Principal):**

Quando o usuário clica para abrir um módulo externo, o Hub.App executa os seguintes passos:

```javascript
async function redirectToModule(moduleUrl) {
  // 1. Pega a sessão atual do Supabase
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    // Lida com o caso de não haver sessão
    console.error("Usuário não autenticado.");
    return;
  }

  const accessToken = data.session.access_token;

  // 2. Redireciona para a URL do módulo, passando o token no "hash"
  const destinationUrl = `${moduleUrl}#access_token=${accessToken}`;
  window.location.href = destinationUrl;
}
```

**No Módulo (Aplicação Independente):**

Na inicialização, a aplicação do módulo verifica a URL para completar o fluxo de login.

```javascript
// Em um componente principal, como App.tsx

import { useEffect } from 'react';
import { supabase } from './utils/supabaseClient'; // Cliente supabase do módulo

function App() {
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1)); // Remove o '#' inicial
    const accessToken = params.get('access_token');

    if (accessToken) {
      // 3. Usa o token para iniciar a sessão no Supabase do módulo
      supabase.auth.setSession({ access_token: accessToken, refresh_token: '' })
        .then(() => {
          // 4. Limpa a URL por segurança
          window.history.replaceState(null, '', window.location.pathname);
        });
    }
  }, []);

  // ... resto da sua aplicação
}
```

### Fase 4: Integração Final no Hub.App

Para tornar o sistema dinâmico, a URL de cada módulo deve ser armazenada no banco de dados.

1.  **Alterar a Tabela `modulos`:** Adicione uma nova coluna na tabela `modulos`, como por exemplo `external_url` (TEXT, nullable).
2.  **Atualizar a Lógica de Clique:** No Hub.App, a função que renderiza os cards de módulos deve ser atualizada:
    *   Se o módulo tiver uma `external_url`, o clique deve chamar a função `redirectToModule(module.external_url)`.
    *   Se a `external_url` for nula, o clique deve levar a uma rota interna do Hub.App, como funciona atualmente.

---

## Vantagens desta Abordagem

*   **Autonomia de Times:** Diferentes equipes podem trabalhar em módulos diferentes sem interferir umas nas outras.
*   **Deployments Independentes:** Um novo módulo pode ser publicado ou atualizado sem a necessidade de um novo deploy da aplicação principal.
*   **Escalabilidade:** A tecnologia de cada módulo pode, teoricamente, ser diferente (embora não seja recomendado para manter a consistência).
*   **Resiliência:** Uma falha em um módulo tem menos chance de derrubar a aplicação inteira.

## Desafios

*   **Configuração Inicial:** A criação da biblioteca de componentes e do fluxo de SSO exige um esforço inicial de arquitetura.
*   **Gerenciamento de Pacote:** A biblioteca de UI precisa ser versionada e publicada, adicionando um passo ao processo de desenvolvimento.