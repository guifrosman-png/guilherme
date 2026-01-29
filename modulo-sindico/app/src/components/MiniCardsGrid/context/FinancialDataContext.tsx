import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DateRange } from '../../types'
import {
    FinancialRecord,
    FinancialAggregates,
    fetchFinancialData,
    filterDataByPeriod,
    filterDataByConditions,
    calculateAggregates
} from '../services/FinancialDataService'
import { FilterCondition } from '../../Filters/types'

interface FinancialDataContextProps {
    rawData: FinancialRecord[]
    filteredData: FinancialRecord[]
    aggregates: FinancialAggregates
    isLoading: boolean
    error: string | null
    period?: DateRange
    filters?: FilterCondition[]
}

const FinancialDataContext = createContext<FinancialDataContextProps | undefined>(undefined)

export const useFinancialData = () => {
    const context = useContext(FinancialDataContext)
    if (!context) {
        throw new Error('useFinancialData must be used within a FinancialDataProvider')
    }
    return context
}

interface FinancialDataProviderProps {
    children: React.ReactNode
    period?: DateRange
    filters?: FilterCondition[]
}

export const FinancialDataProvider: React.FC<FinancialDataProviderProps> = ({
    children,
    period,
    filters = []
}) => {
    const [rawData, setRawData] = useState<FinancialRecord[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // 1. Carregamento Único dos Dados (Mount)
    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true)
                const data = await fetchFinancialData()
                setRawData(data)
                setIsLoading(false)
            } catch (err) {
                console.error('Failed to load financial data', err)
                setError('Falha ao carregar dados financeiros.')
                setIsLoading(false)
            }
        }

        loadData()
    }, []) // Empty dependency array = run once

    // 2. Filtragem Reativa (Sempre que period, filters ou rawData mudar)
    const filteredData = useMemo(() => {
        let data = rawData;

        // Aplica filtro de período (se houver)
        if (period) {
            data = filterDataByPeriod(data, period)
        }

        // Aplica filtros universais (se houver)
        if (filters && filters.length > 0) {
            data = filterDataByConditions(data, filters)
        }

        return data
    }, [rawData, period, filters])

    // 3. Cálculo de Agregados Reativo
    const aggregates = useMemo(() => {
        return calculateAggregates(filteredData)
    }, [filteredData])

    const value = {
        rawData,
        filteredData,
        aggregates,
        isLoading,
        error,
        period,
        filters
    }

    return (
        <FinancialDataContext.Provider value={value}>
            {children}
        </FinancialDataContext.Provider>
    )
}
