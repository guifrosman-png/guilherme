
import { FINANCEIRO_DEFAULT_LAYOUT, PROFITABILITY_REPORT_LAYOUT, CASHFLOW_REPORT_LAYOUT, SUPPLIERS_REPORT_LAYOUT, FINANCE_V2_LAYOUT } from './financeiro'
import { HOME_DEFAULT_LAYOUT } from './home'
import { CRM_DEFAULT_LAYOUT, CONVERSAS_REPORT_LAYOUT } from './crm'
import { MetricaAtiva } from '../types'

// Registry of Default Dashboard Layouts
export const DASHBOARD_LAYOUTS: Record<string, MetricaAtiva[]> = {
    home: HOME_DEFAULT_LAYOUT,
    financeiro: FINANCEIRO_DEFAULT_LAYOUT,
    vendas: [], // To be implemented
    crm: CRM_DEFAULT_LAYOUT
}

// Registry of Specific Report Layouts (Templates)
export const REPORT_LAYOUTS: Record<string, MetricaAtiva[]> = {
    'report-lucratividade-auto': PROFITABILITY_REPORT_LAYOUT,
    'report-pago-recebido': CASHFLOW_REPORT_LAYOUT,
    'report-conversas': CONVERSAS_REPORT_LAYOUT,
    'report-top-fornecedores': SUPPLIERS_REPORT_LAYOUT,
    'report-financeiro-v2': FINANCE_V2_LAYOUT,
    // ... future reports
}
