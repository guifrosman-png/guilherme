# Kanban Board Component

## Visão Geral
O componente `KanbanBoard` é uma implementação de quadro Kanban com suporte a drag-and-drop, gerenciamento de colunas e cards, e um sistema robusto de filtros.

## Sistema de Filtros
O Kanban utiliza o componente compartilhado `UniversalFilterMenu` (`src/components/Filters/UniversalFilterMenu.tsx`) para oferecer uma experiência de filtragem consistente e poderosa.

### Funcionalidades de Filtro
- **Etiquetas (Tags):** Filtragem por múltiplas tags (Design, Dev, etc.).
- **Membros:** Filtragem por responsáveis atribuídos.
- **Prioridade:** Filtragem por nível de urgência.
- **Data de Vencimento (Due Date):** Suporte avançado a datas:
  - **Operadores Básicos:** "É Hoje", "Atrasado", "Esta Semana", "Sem Data".
  - **Operadores Avançados:** 
    - **Antes de:** Selecione uma data limite.
    - **Depois de:** Selecione uma data de início.
    - **Entre:** Selecione um intervalo de datas (Início e Fim).

### Integração
O estado dos filtros é gerenciado localmente no `KanbanBoard` usando o hook `useState<FilterCondition[]>`. As condições de filtro são aplicadas em tempo real sobre a lista de cards usando a função `filteredColumns`.

```typescript
// Exemplo de estrutura de filtro
interface FilterCondition {
    id: string;
    field: 'tag' | 'member' | 'priority' | 'dueDate';
    operator: 'is' | 'is_not' | 'before' | 'after' | 'between' | ...;
    value: any;
}
```
