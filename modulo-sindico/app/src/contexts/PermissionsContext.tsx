
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Tipos para as permissões
export interface PermissionState {
    // Estrutura flexível: chave -> booleano ou objeto aninhado
    [key: string]: boolean | PermissionState;
}

interface PermissionsContextType {
    permissions: PermissionState;
    setPermission: (path: string, value: boolean) => void;
    getPermission: (path: string) => boolean;
    togglePermission: (path: string) => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

// Estado inicial padrão (tudo visível por padrão, depois podemos carregar do banco)
const DEFAULT_PERMISSIONS: PermissionState = {
    // Dashboard
    'dashboard': true,
    'dashboard.kpis': true,
    'dashboard.kpis.add': true, // Botão de adicionar KPI
    'dashboard.kpis.edit': true, // Botão de editar KPI

    // Vendas
    'sales': true,
    'sales.list': true,

    // Fechamento
    'reports': true,

    // Suporte - Por padrão visível
    'support': true,
    'support.create_ticket': true,
};

export function PermissionsProvider({ children }: { children: ReactNode }) {
    // Por enquanto, estado local. Futuramente, carregar do Supabase/API
    const [permissions, setPermissions] = useState<PermissionState>(() => {
        // Tenta carregar do localStorage para persistência local durante dev
        const saved = localStorage.getItem('sindico_permissions_v1');
        return saved ? JSON.parse(saved) : DEFAULT_PERMISSIONS;
    });

    // Salvar no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem('sindico_permissions_v1', JSON.stringify(permissions));
    }, [permissions]);

    // Função auxiliar para acessar propriedades aninhadas por string path (ex: 'dashboard.kpis.add')
    const getPermission = (path: string): boolean => {
        // Se não existir a chave exata, assume true (permissivo por padrão) ou busca na hierarquia
        // Aqui vamos implementar uma busca simples plana por enquanto, já que as chaves no state são planas 'a.b.c'
        // Se quisermos objetos aninhados reais, a lógica muda. 
        // Para simplificar e ser robusto, vamos usar chaves 'dot notation' planas no objeto principal por enquanto.
        return (permissions[path] as boolean) !== false; // Default true se undefined
    };

    const setPermission = (path: string, value: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [path]: value
        }));
    };

    const togglePermission = (path: string) => {
        setPermissions(prev => ({
            ...prev,
            [path]: !(prev[path] as boolean ?? true) // Inverte o valor atual (com default true)
        }));
    };

    const value = {
        permissions,
        setPermission,
        getPermission,
        togglePermission
    };

    return (
        <PermissionsContext.Provider value={value}>
            {children}
        </PermissionsContext.Provider>
    );
}

export function usePermissions() {
    const context = useContext(PermissionsContext);
    if (context === undefined) {
        throw new Error('usePermissions must be used within a PermissionsProvider');
    }
    return context;
}
