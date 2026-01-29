
import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useSindicoDashboard, DashboardMetrics } from '../../../hooks/useSindicoDashboard';

interface SindicoDataContextProps {
    data: DashboardMetrics;
    refresh: () => void;
}

const SindicoDataContext = createContext<SindicoDataContextProps | undefined>(undefined);

export const useSindicoData = () => {
    const context = useContext(SindicoDataContext);
    if (!context) {
        throw new Error('useSindicoData must be used within a SindicoDataProvider');
    }
    return context;
};

// Props do provider com suporte a filtros de data
interface SindicoDataProviderProps {
    children: ReactNode;
    dataInicial?: Date | string;
    dataFinal?: Date | string;
}

export const SindicoDataProvider = ({ children, dataInicial, dataFinal }: SindicoDataProviderProps) => {
    // Unidade 12 fixa por enquanto, com suporte a filtros de data
    const metrics = useSindicoDashboard({
        unidadeId: 12,
        dataInicial,
        dataFinal
    });

    const refresh = useCallback(() => {
        // TODO: Implementar refresh forçado (recarregar dados)
    }, []);

    return (
        <SindicoDataContext.Provider value={{ data: metrics, refresh }}>
            {children}
        </SindicoDataContext.Provider>
    );
};
