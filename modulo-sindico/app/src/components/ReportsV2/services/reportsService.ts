
// ============================================
// REPORTS SERVICE - Camada de Persistência
// ============================================

import { Report, ReportCategory } from '../types/report.types';
// import { systemReports as defaultSystemReports } from './reportsData'; // REPORTSDATA NÃO EXISTE AINDA
const defaultSystemReports: Report[] = []; // Array vazia pois estamos copiando agora

const STORAGE_KEY = 'helpdesk_reports';
const STORAGE_VERSION = '1.0.6';

interface StoredReportsData {
    version: string;
    currentUser: {
        id: string;
        name: string;
        email: string;
    };
    reports: Report[];
    lastSync: string; // ISO string
}

interface SharedUser {
    userId: string;
    userName: string;
    email: string;
    permission: 'view' | 'edit';
    sharedAt: string; // ISO string
}

// ============================================
// MOCK USER (Simulação de usuário logado)
// ============================================

const MOCK_CURRENT_USER = {
    id: 'user-001',
    name: 'Usuário Atual',
    email: 'usuario@helpdesk.com'
};

// ============================================
// STORAGE HELPERS
// ============================================

/**
 * Carrega dados do localStorage
 */
function loadFromStorage(): StoredReportsData | null {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return null;

        const parsed = JSON.parse(data);

        // Validar versão
        if (parsed.version !== STORAGE_VERSION) {
            console.warn('Storage version mismatch, resetting...');
            return null;
        }

        // Converter strings de data para Date objects
        parsed.reports = parsed.reports.map((report: any) => ({
            ...report,
            createdAt: new Date(report.createdAt),
            updatedAt: new Date(report.updatedAt)
        }));

        return parsed;
    } catch (error) {
        console.error('Error loading from storage:', error);
        return null;
    }
}

/**
 * Salva dados no localStorage
 */
function saveToStorage(data: StoredReportsData): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to storage:', error);
        throw new Error('Falha ao salvar dados');
    }
}

/**
 * Inicializa storage com dados padrão (incluindo 12 relatórios do sistema)
 */
function initializeStorage(): StoredReportsData {
    // Use the imported reports from reportsData.ts
    const systemReports: Report[] = [...defaultSystemReports];

    const initialData: StoredReportsData = {
        version: STORAGE_VERSION,
        currentUser: MOCK_CURRENT_USER,
        reports: systemReports,
        lastSync: new Date().toISOString()
    };

    saveToStorage(initialData);
    return initialData;
}

/**
 * Obtém dados do storage (ou inicializa se não existir)
 * Garante que os relatórios do sistema sempre estejam presentes
 */
function getStorageData(): StoredReportsData {
    let data = loadFromStorage();

    if (!data) {
        // Primeira vez - inicializa com relatórios do sistema
        return initializeStorage();
    }

    // SYNC: Always update system reports from code to reflect file system changes/deletions
    // Filter out old system reports stored in localStorage
    const storedUserReports = data.reports.filter(r => r.category !== 'system');
    const storedSystemReports = data.reports.filter(r => r.category === 'system');

    // Create a map of stored favorite states by report ID
    const storedFavorites = new Map<string, boolean>();
    storedSystemReports.forEach(r => storedFavorites.set(r.id, r.isFavorite));

    // Merge fresh system reports with stored favorite states
    const mergedSystemReports = defaultSystemReports.map(report => ({
        ...report,
        isFavorite: storedFavorites.get(report.id) ?? report.isFavorite
    }));

    // Combine user reports with merged system reports
    const freshReports = [...storedUserReports, ...mergedSystemReports];

    // Update data object
    data.reports = freshReports;

    // Check if we need to save changes (if count mismatch or id mismatch)
    // For performance, we could add a hash check, but for now we just save if different
    saveToStorage(data);
    return data;
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Carrega todos os relatórios
 */
export function loadReports(): Report[] {
    const data = getStorageData();
    return data.reports;
}

/**
 * Salva um novo relatório
 */
export function saveReport(report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Report {
    const data = getStorageData();

    const newReport: Report = {
        ...report,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: MOCK_CURRENT_USER.id,
        owner: MOCK_CURRENT_USER.name
    };

    data.reports.push(newReport);
    data.lastSync = new Date().toISOString();
    saveToStorage(data);

    return newReport;
}

/**
 * Atualiza um relatório existente
 */
export function updateReport(id: string, updates: Partial<Report>): Report {
    const data = getStorageData();

    const index = data.reports.findIndex(r => r.id === id);
    if (index === -1) {
        throw new Error(`Relatório ${id} não encontrado`);
    }

    // Validar permissões (apenas owner pode editar relatórios 'user')
    const report = data.reports[index];
    if (report.category === 'user' && report.ownerId !== MOCK_CURRENT_USER.id) {
        throw new Error('Você não tem permissão para editar este relatório');
    }

    // Não permitir editar relatórios do sistema
    if (report.category === 'system') {
        throw new Error('Relatórios do sistema não podem ser editados');
    }

    const updatedReport: Report = {
        ...report,
        ...updates,
        id: report.id, // Garantir que ID não mude
        updatedAt: new Date(),
        updatedBy: MOCK_CURRENT_USER.name
    };

    data.reports[index] = updatedReport;
    data.lastSync = new Date().toISOString();
    saveToStorage(data);

    return updatedReport;
}

/**
 * Deleta um relatório
 */
export function deleteReport(id: string): void {
    const data = getStorageData();

    const index = data.reports.findIndex(r => r.id === id);
    if (index === -1) {
        throw new Error(`Relatório ${id} não encontrado`);
    }

    const report = data.reports[index];

    // Validar permissões
    if (report.category === 'system') {
        throw new Error('Relatórios do sistema não podem ser deletados');
    }

    if (report.category === 'user' && report.ownerId !== MOCK_CURRENT_USER.id) {
        throw new Error('Você não tem permissão para deletar este relatório');
    }

    data.reports.splice(index, 1);
    data.lastSync = new Date().toISOString();
    saveToStorage(data);
}

/**
 * Compartilha um relatório com outro usuário
 */
export function shareReport(
    id: string,
    userId: string,
    userName: string,
    permission: 'view' | 'edit'
): Report {
    const data = getStorageData();

    const report = data.reports.find(r => r.id === id);
    if (!report) {
        throw new Error(`Relatório ${id} não encontrado`);
    }

    // Validar permissões (apenas owner pode compartilhar)
    if (report.ownerId !== MOCK_CURRENT_USER.id) {
        throw new Error('Você não tem permissão para compartilhar este relatório');
    }

    // Criar cópia compartilhada
    const sharedReport: Report = {
        ...report,
        id: generateId(),
        category: 'shared',
        ownerId: userId,
        owner: userName,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    data.reports.push(sharedReport);
    data.lastSync = new Date().toISOString();
    saveToStorage(data);

    return sharedReport;
}

/**
 * Alterna favorito de um relatório
 */
export function toggleFavorite(id: string): Report {
    const data = getStorageData();

    const index = data.reports.findIndex(r => r.id === id);
    if (index === -1) {
        throw new Error(`Relatório ${id} não encontrado`);
    }

    const report = data.reports[index];
    const updatedReport: Report = {
        ...report,
        isFavorite: !report.isFavorite,
        updatedAt: new Date()
    };

    data.reports[index] = updatedReport;
    data.lastSync = new Date().toISOString();
    saveToStorage(data);

    return updatedReport;
}

/**
 * Filtra relatórios por categoria
 */
export function filterByCategory(reports: Report[], category: ReportCategory): Report[] {
    const currentUserId = MOCK_CURRENT_USER.id;

    switch (category) {
        case 'system':
            return reports.filter(r => r.category === 'system');

        case 'user':
            return reports.filter(r => r.category === 'user' && r.ownerId === currentUserId);

        case 'shared':
            return reports.filter(r => r.category === 'shared' && r.ownerId === currentUserId);

        default:
            return reports;
    }
}

/**
 * Obtém relatórios favoritos
 */
export function getFavoriteReports(reports: Report[]): Report[] {
    return reports.filter(r => r.isFavorite);
}

/**
 * Conta relatórios por categoria
 */
export function getCategoryCounts(reports: Report[]): Record<ReportCategory, number> {
    const currentUserId = MOCK_CURRENT_USER.id;

    return {
        system: reports.filter(r => r.category === 'system').length,
        user: reports.filter(r => r.category === 'user' && r.ownerId === currentUserId).length,
        shared: reports.filter(r => r.category === 'shared' && r.ownerId === currentUserId).length
    };
}

/**
 * Obtém usuário atual
 */
export function getCurrentUser() {
    return MOCK_CURRENT_USER;
}
/**
 * Gera ID único
 */
function generateId(): string {
    return `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Limpa todos os dados (útil para testes)
 */
export function clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Reseta o storage e reinicializa com relatórios do sistema
 * Útil para forçar a adição dos relatórios do sistema
 */
export function resetStorage(): void {
    localStorage.removeItem(STORAGE_KEY);
    initializeStorage();
    console.log('✅ Storage resetado (sem relatórios padrão)');
}
