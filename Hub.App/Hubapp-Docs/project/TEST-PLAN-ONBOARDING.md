# Plano de Testes: Onboarding de Novo Administrador

**Autor:** Gemini (QA Tester Agent)
**Data:** 10 de Setembro de 2025
**Versão:** 1.0

---

## 1. Visão Geral e Escopo

### Objetivo
Validar de ponta a ponta o fluxo de registro de um novo administrador, a criação de um novo tenant (empresa) e o primeiro login bem-sucedido. Este é o fluxo mais crítico para a aquisição de novos clientes.

### Em Escopo
- Formulário de registro de duas etapas (Nome da Empresa, Dados do Utilizador).
- Criação do registo na tabela `tenants`.
- Criação do registo na tabela `perfis` e associação com `auth.users`.
- Atribuição automática da `role` de 'admin' ao utilizador criador.
- Redirecionamento e login automático para a tela principal (App Grid) após o registro.
- Validação de erros no formulário.

### Fora do Escopo
- Fluxo de "Esqueci minha senha".
- Login de utilizadores já existentes.
- Edição de dados da empresa ou do perfil após o registro.
- Convidar outros utilizadores para o tenant.

## 2. Critérios de Aceitação

- Um novo utilizador deve conseguir criar uma conta e uma empresa em menos de 2 minutos.
- O novo tenant deve ser criado e seus dados devem ser 100% isolados de outros tenants.
- O utilizador que cria a empresa deve ter a `role` de 'admin' e permissões associadas.
- Após o registro, o utilizador deve ser autenticado e redirecionado para a sua tela inicial, já funcional.
- Mensagens de erro claras devem ser exibidas para entradas inválidas (ex: email já em uso, senha fraca).

## 3. Dados de Teste

Para cada execução de teste de registro, será necessário um endereço de email que ainda não exista na base de dados.

- **Empresa de Teste:** `Padaria QA`
- **Email de Teste:** `padaria-qa-[timestamp]@example.com`
- **Senha Padrão:** `SenhaForte@2025`

## 4. Casos de Teste Manuais

No formato padrão de Bug Report.

---

**ID do Teste:** TC-ONBOARD-001
**Título:** Caminho Feliz - Registro bem-sucedido

**Passos:**
1. Navegar para a página de registro (`/cadastro`).
2. Inserir um nome de empresa válido (ex: "Padaria QA").
3. Clicar em "Avançar".
4. Inserir um nome de utilizador válido, um email **novo** e uma senha forte.
5. Clicar em "Criar Conta".

**Resultado Esperado:**
- O utilizador é redirecionado para a tela principal (App Grid).
- O nome da empresa ("Padaria QA") é visível em algum lugar da UI.
- O utilizador está autenticado.
- Na base de dados, um novo `tenant` e um novo `perfil` com `role='admin'` foram criados.

---

**ID do Teste:** TC-ONBOARD-002
**Título:** Falha - Tentativa de registro com email existente

**Passos:**
1. Executar TC-ONBOARD-001 primeiro para garantir que um email esteja registrado.
2. Navegar para a página de registro.
3. Inserir qualquer nome de empresa.
4. Clicar em "Avançar".
5. Inserir o **mesmo email** usado no passo 1.
6. Clicar em "Criar Conta".

**Resultado Esperado:**
- O formulário não é submetido.
- Uma mensagem de erro clara é exibida, informando "Este email já está em uso".

---

**ID do Teste:** TC-ONBOARD-003
**Título:** Falha - Validação de campos do formulário

**Passos:**
1. Navegar para a página de registro.
2. Tentar submeter o formulário com um nome de empresa com menos de 2 caracteres.
3. Tentar submeter com um formato de email inválido (ex: "teste@exemplo").
4. Tentar submeter com uma senha fraca (ex: "123456").

**Resultado Esperado:**
- Para cada passo, uma mensagem de erro específica ao campo deve ser exibida abaixo do campo correspondente.
- O formulário não deve ser submetido em nenhuma das tentativas.

---

## 5. Esboço do Teste Automatizado (Playwright)

O seguinte script (`onboarding.spec.ts`) deve ser criado no diretório de testes para automatizar o fluxo principal.

```typescript
import { test, expect } from '@playwright/test';

// Gera um email único para cada execução de teste
const generateTestEmail = () => {
  const timestamp = Date.now();
  return `padaria-qa-${timestamp}@example.com`;
};

test.describe('Onboarding Flow', () => {

  test('[TC-ONBOARD-001] should allow a new user to register and create a company', async ({ page }) => {
    const userEmail = generateTestEmail();
    const companyName = 'Padaria Playwright';

    // Navega para a página de registro
    await page.goto('/cadastro');

    // Etapa 1: Nome da empresa
    await page.fill('input[name="companyName"]', companyName);
    await page.click('button:has-text("Avançar")');

    // Etapa 2: Dados do utilizador
    await page.fill('input[name="fullName"]', 'Utilizador de Teste');
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', 'SenhaForte@2025');
    await page.click('button:has-text("Criar Conta")');

    // Verificação Pós-Login
    // Espera que a URL seja a da tela principal
    await expect(page).toHaveURL('/'); // ou '/dashboard'

    // Verifica se o nome da empresa ou do utilizador aparece na tela
    const welcomeMessage = page.locator('h1'); // Exemplo, o seletor precisa ser ajustado
    await expect(welcomeMessage).toContainText('Bem-vindo');

    // Opcional: verificar se o nome da empresa está visível
    const companyNameElement = page.locator('.tenant-display-name'); // Exemplo
    await expect(companyNameElement).toHaveText(companyName);
  });

  test('[TC-ONBOARD-002] should show an error if the email is already in use', async ({ page }) => {
    // Primeiro, precisa de um utilizador existente. Pode ser criado via API ou um teste anterior.
    const existingEmail = 'admin@empresa-existente.com';

    await page.goto('/cadastro');
    await page.fill('input[name="companyName"]', 'Empresa Fantasma');
    await page.click('button:has-text("Avançar")');

    await page.fill('input[name="email"]', existingEmail);
    await page.fill('input[name="password"]', 'SenhaForte@2025');
    await page.click('button:has-text("Criar Conta")');

    // Verifica a mensagem de erro
    const errorMessage = page.locator('.error-message'); // Exemplo
    await expect(errorMessage).toContainText('Este email já está em uso');
    await expect(page).toHaveURL('/cadastro'); // Garante que não navegou para outra página
  });

});
```
