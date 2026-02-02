
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ViewMode = 'owner' | 'sindico';

interface ViewModeContextType {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    isOwnerView: boolean;
    isSindicoView: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: ReactNode }) {
    const [viewMode, setViewMode] = useState<ViewMode>('owner');

    const value = {
        viewMode,
        setViewMode,
        isOwnerView: viewMode === 'owner',
        isSindicoView: viewMode === 'sindico',
    };

    return (
        <ViewModeContext.Provider value={value}>
            {children}
        </ViewModeContext.Provider>
    );
}

export function useViewMode() {
    const context = useContext(ViewModeContext);
    if (context === undefined) {
        throw new Error('useViewMode must be used within a ViewModeProvider');
    }
    return context;
}
