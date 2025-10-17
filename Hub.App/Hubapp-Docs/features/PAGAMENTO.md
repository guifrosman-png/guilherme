# Proposta de Implementação de Pagamentos com Stripe

Este documento detalha a arquitetura e o plano de ação para implementar o sistema de assinaturas de módulos na plataforma Hub.App utilizando o Stripe como gateway de pagamento.

## 1. Estratégia Geral (MVP)

Para a primeira versão do sistema de monetização (MVP), a estratégia é focada na simplicidade e rapidez de implementação, alinhada ao princípio de "Simplicidade Radical" do produto.

- **Gateway de Pagamento:** **Stripe** será o único provedor de pagamentos.
- **Método de Pagamento:** O foco exclusivo será em **assinaturas (pagamentos recorrentes) via Cartão de Crédito**.
- **Pix:** A opção de pagamento com Pix, embora suportada pelo Stripe para pagamentos únicos, **não será implementada para assinaturas neste momento**. Esta decisão deve-se à incerteza sobre o suporte do Stripe ao "Pix Automático" para pagamentos recorrentes. A funcionalidade poderá ser adicionada no futuro sem grandes alterações na arquitetura base.

## 2. Fluxo do Utilizador

1.  O **Administrador da Empresa** navega até a "App Store" dentro da plataforma.
2.  Módulos pagos são exibidos com o seu preço mensal (ex: "9,90€/mês") e um botão "Subscrever".
3.  Ao clicar em "Subscrever", o utilizador é redirecionado para uma página de checkout segura, hospedada pelo Stripe.
4.  O utilizador insere os dados do seu cartão de crédito e confirma a assinatura.
5.  Após o sucesso do pagamento, é redirecionado de volta para a plataforma, onde vê uma mensagem de confirmação e o novo módulo ativado na sua tela inicial.
6.  A qualquer momento, o utilizador pode ir a "Configurações > Faturação" e clicar em "Gerir Assinaturas" para ser redirecionado ao Portal do Cliente do Stripe, onde pode atualizar o seu cartão, ver faturas ou cancelar a assinatura.

## 3. Alterações na Base de Dados

As seguintes alterações no schema do Supabase são necessárias para suportar a integração.

```sql
-- 1. Adicionar coluna para o ID de cliente do Stripe na tabela de tenants
ALTER TABLE public.tenants
ADD COLUMN stripe_customer_id TEXT;

-- 2. Adicionar colunas relacionadas a preço nos módulos
ALTER TABLE public.modulos
ADD COLUMN stripe_price_id TEXT, -- ID do preço definido no Stripe
ADD COLUMN price NUMERIC,
ADD COLUMN currency TEXT DEFAULT 'BRL';

-- 3. Criar uma nova tabela para gerir as assinaturas
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  module_id UUID NOT NULL REFERENCES public.modulos(id),
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL, -- ex: 'active', 'canceled', 'past_due'
  current_period_ends_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_module FOREIGN KEY (module_id) REFERENCES modulos(id)
);

-- Ativar RLS na nova tabela
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Criar política de segurança para que tenants só vejam as suas próprias assinaturas
CREATE POLICY "Tenants can only see their own subscriptions" 
ON public.subscriptions
FOR ALL USING (tenant_id = get_my_tenant_id());
```

## 4. Lógica de Backend (Supabase Functions)

Três funções serverless serão necessárias para lidar com a lógica de negócio de forma segura.

1.  **`create-checkout-session`**
    - **O que faz:** Gera uma sessão de checkout no Stripe.
    - **Como:** Recebe o `module_id`, encontra o `stripe_price_id` correspondente, e cria uma sessão de checkout no Stripe, passando o `tenant_id` do utilizador nos metadados para rastreamento. Retorna a URL de checkout para o frontend.

2.  **`stripe-webhook-handler`**
    - **O que faz:** Ouve eventos enviados pelo Stripe para manter a nossa base de dados sincronizada.
    - **Como:** É um endpoint que recebe notificações do Stripe. O evento principal é o `checkout.session.completed`, que dispara a criação do registo na nossa tabela `subscriptions`. Outros eventos, como `customer.subscription.deleted`, irão atualizar o status da assinatura.

3.  **`create-customer-portal-session`**
    - **O que faz:** Permite que o cliente gira a sua própria assinatura.
    - **Como:** Pega o `stripe_customer_id` do tenant e gera um link para o Portal do Cliente do Stripe, onde o utilizador pode gerir os seus dados de pagamento e assinaturas de forma segura.

## 5. Alterações no Frontend

- **Componente da App Store:** Deve ser atualizado para mostrar o preço dos módulos premium e o botão "Subscrever".
- **Lógica de Subscrição:** Criar a função que chama o backend (`create-checkout-session`) e redireciona o utilizador para o Stripe.
- **Páginas de Status:** Criar páginas de sucesso e cancelamento para onde o utilizador é redirecionado após o checkout.
- **Secção de Faturação:** Adicionar uma nova área em "Configurações" com um botão para chamar a função `create-customer-portal-session` e redirecionar para o portal do Stripe.

## 6. Próximos Passos

1.  **Configuração no Stripe:** Criar os produtos e preços no painel do Stripe.
2.  **Base de Dados:** Aplicar o script SQL de alterações ao banco de dados.
3.  **Backend:** Desenvolver e fazer o deploy das três Supabase Functions.
4.  **Frontend:** Implementar as alterações de UI/UX.
