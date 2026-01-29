export type FilterOperator = 'is' | 'is_not' | 'contains' | 'not_contains' | 'set' | 'not_set' | 'before' | 'after' | 'between';
export type FilterField = 'tag' | 'member' | 'priority' | 'dueDate' | string;

export interface FilterCondition {
    id: string;
    field: FilterField;
    operator: FilterOperator;
    value: any;
}
