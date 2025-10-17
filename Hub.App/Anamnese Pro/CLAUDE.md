# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Projeto: Anamnese Pro

O **Anamnese Pro** é um módulo especializado do **Hub.App** voltado para profissionais de saúde, psicologia, nutrição e tatuagem que precisam de **controle rigoroso e inteligente de fichas de anamnese**.

## Estrutura do Projeto

```
Anamnese Pro/
├── CLAUDE.md                 # Este arquivo
├── prd_anamnese_pro (1).md   # Documento de Requisitos de Produto
├── docs/                     # Documentação técnica
├── agents/                   # Agentes de IA especializados
└── .plans/                   # Planos de desenvolvimento
```

## Comandos de Desenvolvimento

- **Instalar dependências**: `npm i`
- **Servidor de desenvolvimento**: `npm run dev`
- **Build de produção**: `npm run build`
- **Testes**: `npm test`
- **Lint**: `npm run lint`
- **Typecheck**: `npm run typecheck`

## Stack Tecnológica Principal

- **Framework**: React 18 com TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI com shadcn/ui
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **Validação**: Zod
- **Database**: PostgreSQL com Prisma
- **Autenticação**: JWT

## Características Específicas do Módulo

### Funcionalidade Principal
- **Fichas de Anamnese Inteligentes** com reutilização automática
- **Templates especializados** por área profissional (tatuagem, psicologia, nutrição)
- **Quiz interativo** em vez de formulários tradicionais
- **Versionamento de fichas** com histórico completo
- **Integração com CRM** para sincronização de dados

### Experiência do Usuário
- **Interface gamificada** com progress bar e feedback visual
- **Fluxo condicional** que adapta perguntas baseadas nas respostas
- **Linguagem acolhedora** e elementos educativos
- **Design responsivo** otimizado para mobile

### Integrações
- **CRM (obrigatória)**: Sincronização de dados pessoais
- **MultiFins (opcional)**: Trigger para receitas automáticas
- **Marketing Pro (futuro)**: Analytics de origem dos clientes
- **Galeria Pro (futuro)**: Conexão com portfólio de trabalhos

## Estrutura de Dados Principal

```typescript
interface AnamneseFicha {
  id: string;
  tenantId: string;
  clienteId: string;  // Referência ao CRM
  templateTipo: 'tatuagem' | 'psicologia' | 'nutricao';
  versao: number;
  dataCriacao: Date;
  dataAtualizacao: Date;
  dadosSaude: Record<string, any>;  // Campos flexíveis por template
  origemCliente: string;
  assinaturaDigital: string;
  pdfGeradoUrl: string;
  status: 'ativa' | 'arquivada';
}
```

## Padrões de Desenvolvimento

### Convenções de Código
- Use TypeScript em todos os arquivos
- Componentes em PascalCase
- Hooks customizados com prefixo `use`
- Funções utilitárias em camelCase
- Constantes em SCREAMING_SNAKE_CASE

### Estrutura de Componentes
- Componentes de UI reutilizáveis em `/components/ui/`
- Componentes específicos do módulo em `/components/anamnese/`
- Hooks personalizados em `/hooks/`
- Utilitários em `/lib/`
- Tipos em `/types/`

### Validação e Formulários
- Use Zod para validação de esquemas
- React Hook Form para gerenciamento de estado de formulários
- Validação no frontend e backend
- Mensagens de erro amigáveis e contextuais

### Responsividade
- Mobile-first approach
- Teste em dispositivos móveis (experiência principal)
- Breakpoints do Tailwind CSS
- Componentes adaptativos para diferentes telas

## Objetivos de Performance

- **Tempo de carregamento**: < 2 segundos na primeira visita
- **Tempo de preenchimento**: 80% de redução para clientes recorrentes
- **Taxa de abandono**: < 5% no quiz interativo
- **Precisão dos dados**: > 95% de fichas completas

## Considerações de Segurança

- **Dados sensíveis**: Criptografia de informações de saúde
- **LGPD**: Conformidade com lei de proteção de dados
- **Auditoria**: Log de todas as alterações nas fichas
- **Backup**: Retenção segura de PDFs gerados

## Métricas de Sucesso

- **Adoção**: 25 profissionais ativos em 3 meses
- **Eficiência**: 80% redução no tempo de preenchimento
- **Satisfação**: NPS > 50 específico do módulo
- **Integração**: 80% dos usuários também usam MultiFins

## Notas Importantes

- **Responsabilidade legal**: Fichas têm valor legal para profissionais de saúde
- **Integração obrigatória**: CRM deve estar ativo para funcionamento
- **Experiência mobile**: Priorizar sempre a versão mobile
- **Acessibilidade**: Seguir WCAG 2.1 AA para inclusão