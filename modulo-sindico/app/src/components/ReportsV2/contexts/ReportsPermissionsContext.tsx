
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ==================== TIPOS DE PERMISSÃO ====================

export interface ReportsPermissions {
    // 1. INBOX (Sidebar)
    inbox: {
        showSidebarMaster: boolean; // Flag mestre para esconder TODA a sidebar
        showCurrentExtract: boolean;
        showHistoryButton: boolean;
        years: Record<number, { // Ano (ex: 2026) -> Config
            visible: boolean;
            months: Record<number, boolean>; // Mês (1-12) -> Visível/Oculto
        }>;
    };

    // 2. FECHAMENTOS (Detalhe do Mês)
    statement: {
        kpis: {
            grossSales: boolean;
            contractRate: boolean;
            netValue: boolean;
        };
        calculation: {
            totalSales: boolean;
            details: boolean; // Crédito/Débito/Pix
            cancellations: boolean;
            baseCalculation: boolean;
            contractRateLine: boolean; // Linha da alíquota na lista
            finalRepasse: boolean;
        };
        docs: {
            reportPdf: boolean;
            proof: boolean;
        };
    };

    // 3. HISTÓRICO COMPLETO (Colunas da Tabela)
    history: {
        columns: {
            titleMonth: boolean;
            owner: boolean;
            status: boolean;
            updatedAt: boolean;
            createdAt: boolean;
        };
    };
}

// ==================== VALORES PADRÃO ====================

const DEFAULT_PERMISSIONS: ReportsPermissions = {
    inbox: {
        showSidebarMaster: true,
        showCurrentExtract: true,
        showHistoryButton: true,
        years: {
            // Inicializa alguns anos padrão, mas a UI vai gerar dinamicamente
            2026: { visible: true, months: {} },
            2025: { visible: true, months: {} },
            2024: { visible: true, months: {} },
        }
    },
    statement: {
        kpis: {
            grossSales: true,
            contractRate: true,
            netValue: true
        },
        calculation: {
            totalSales: true,
            details: true,
            cancellations: true,
            baseCalculation: true,
            contractRateLine: true,
            finalRepasse: true
        },
        docs: {
            reportPdf: true,
            proof: true
        }
    },
    history: {
        columns: {
            titleMonth: true,
            owner: true,
            status: true,
            updatedAt: true,
            createdAt: true
        }
    }
};

// ==================== CONTEXTO ====================

interface ReportsPermissionsContextType {
    permissions: ReportsPermissions;
    updatePermission: (path: string, value: any) => void;
    toggleYearVisibility: (year: number) => void;
    toggleMonthVisibility: (year: number, month: number) => void;
    resetPermissions: () => void;
}

const ReportsPermissionsContext = createContext<ReportsPermissionsContextType | undefined>(undefined);

export function ReportsPermissionsProvider({ children }: { children: ReactNode }) {
    // Tenta ler do localStorage ou usa padrão
    const [permissions, setPermissions] = useState<ReportsPermissions>(() => {
        const stored = localStorage.getItem('reports_permissions_v1');
        return stored ? JSON.parse(stored) : DEFAULT_PERMISSIONS;
    });

    // Salva no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem('reports_permissions_v1', JSON.stringify(permissions));
    }, [permissions]);

    // Função genérica para atualizar deep objects
    const updatePermission = (path: string, value: any) => {
        setPermissions(prev => {
            const newPerms = JSON.parse(JSON.stringify(prev)); // Deep clone

            // Navega até a propriedade certa ex: "statement.kpis.grossSales"
            const keys = path.split('.');
            let current = newPerms;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {}; // Garante estrutura
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;

            return newPerms;
        });
    };

    const toggleYearVisibility = (year: number) => {
        setPermissions(prev => {
            const newPerms = { ...prev };
            const currentYearConfig = newPerms.inbox.years[year] || { visible: true, months: {} };

            newPerms.inbox.years[year] = {
                ...currentYearConfig,
                visible: !currentYearConfig.visible
            };
            return newPerms;
        });
    };

    const toggleMonthVisibility = (year: number, month: number) => {
        setPermissions(prev => {
            const newPerms = JSON.parse(JSON.stringify(prev));

            // Garante que o ano existe
            if (!newPerms.inbox.years[year]) {
                newPerms.inbox.years[year] = { visible: true, months: {} };
            }

            // Toggle do mês (se undefined, assume true -> vira false)
            const currentVal = newPerms.inbox.years[year].months[month] ?? true;
            newPerms.inbox.years[year].months[month] = !currentVal;

            return newPerms;
        });
    };

    const resetPermissions = () => setPermissions(DEFAULT_PERMISSIONS);

    return (
        <ReportsPermissionsContext.Provider value={{
            permissions,
            updatePermission,
            toggleYearVisibility,
            toggleMonthVisibility,
            resetPermissions
        }}>
            {children}
        </ReportsPermissionsContext.Provider>
    );
}

export const useReportsPermissions = () => {
    const context = useContext(ReportsPermissionsContext);
    if (!context) throw new Error('useReportsPermissions must be used within a ReportsPermissionsProvider');
    return context;
};
