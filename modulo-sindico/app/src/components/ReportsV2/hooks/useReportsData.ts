// ============================================
// USE REPORTS DATA - Custom Hook
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { Report, ReportCategory, ReportsTabId } from '../types/report.types';
import * as reportsService from '../services/reportsService';

interface CategoryCounts {
    shared: number;
    user: number;
    system: number;
}

interface UseReportsDataReturn {
    // Data
    reports: Report[];
    loading: boolean;
    error: string | null;

    // Actions
    createReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Report>;
    updateReport: (id: string, updates: Partial<Report>) => Promise<Report>;
    deleteReport: (id: string) => Promise<void>;
    shareReport: (id: string, userId: string, userName: string, permission: 'view' | 'edit') => Promise<Report>;
    toggleFavorite: (id: string) => Promise<void>;
    refreshReports: () => Promise<void>;

    // Filters
    getReportsByCategory: (category: ReportsTabId) => Report[];
    getFavoriteReports: () => Report[];
    getCounts: () => CategoryCounts;
}

/**
 * Hook para gerenciar dados de relatórios
 */
export function useReportsData(): UseReportsDataReturn {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ============================================
    // LOAD INITIAL DATA
    // ============================================

    const loadReports = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Simular delay de rede (remover em produção)
            await new Promise(resolve => setTimeout(resolve, 300));

            // Carregar lista vazia conforme solicitação
            // const data = reportsService.loadReports();
            setReports([]);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao carregar relatórios';
            setError(message);
            console.error('Error loading reports:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    // ============================================
    // ACTIONS
    // ============================================

    const createReport = useCallback(async (
        report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<Report> => {
        try {
            setError(null);

            const newReport = reportsService.saveReport(report);
            setReports(prev => [...prev, newReport]);

            return newReport;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao criar relatório';
            setError(message);
            throw err;
        }
    }, []);

    const updateReport = useCallback(async (
        id: string,
        updates: Partial<Report>
    ): Promise<Report> => {
        try {
            setError(null);

            const updatedReport = reportsService.updateReport(id, updates);
            setReports(prev => prev.map(r => r.id === id ? updatedReport : r));

            return updatedReport;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao atualizar relatório';
            setError(message);
            throw err;
        }
    }, []);

    const deleteReport = useCallback(async (id: string): Promise<void> => {
        try {
            setError(null);

            reportsService.deleteReport(id);
            setReports(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao deletar relatório';
            setError(message);
            throw err;
        }
    }, []);

    const shareReport = useCallback(async (
        id: string,
        userId: string,
        userName: string,
        permission: 'view' | 'edit'
    ): Promise<Report> => {
        try {
            setError(null);

            const sharedReport = reportsService.shareReport(id, userId, userName, permission);
            setReports(prev => [...prev, sharedReport]);

            return sharedReport;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao compartilhar relatório';
            setError(message);
            throw err;
        }
    }, []);

    const toggleFavorite = useCallback(async (id: string): Promise<void> => {
        try {
            setError(null);

            const updatedReport = reportsService.toggleFavorite(id);
            setReports(prev => prev.map(r => r.id === id ? updatedReport : r));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao favoritar relatório';
            setError(message);
            throw err;
        }
    }, []);

    const refreshReports = useCallback(async (): Promise<void> => {
        await loadReports();
    }, [loadReports]);

    // ============================================
    // FILTERS
    // ============================================

    const getFavoriteReports = useCallback((): Report[] => {
        return reportsService.getFavoriteReports(reports);
    }, [reports]);

    const getReportsByCategory = useCallback((category: ReportsTabId): Report[] => {
        if (category === 'favorites') {
            return getFavoriteReports();
        }

        const categoryMap: Record<Exclude<ReportsTabId, 'favorites'>, ReportCategory> = {
            'shared': 'shared',
            'user': 'user',
            'system': 'system'
        };

        return reportsService.filterByCategory(reports, categoryMap[category]);
    }, [reports, getFavoriteReports]);

    const getCounts = useCallback((): CategoryCounts => {
        return reportsService.getCategoryCounts(reports);
    }, [reports]);

    // ============================================
    // RETURN
    // ============================================

    return {
        // Data
        reports,
        loading,
        error,

        // Actions
        createReport,
        updateReport,
        deleteReport,
        shareReport,
        toggleFavorite,
        refreshReports,

        // Filters
        getReportsByCategory,
        getFavoriteReports,
        getCounts
    };
}
