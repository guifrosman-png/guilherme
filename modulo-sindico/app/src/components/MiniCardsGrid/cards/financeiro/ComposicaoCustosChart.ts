import { ChartConfig } from '../../types';

export const composicaoCustosChart: ChartConfig = {
    id: 'composicao-custos',
    title: 'Composição de Custos',
    type: 'donut',
    data: [
        { name: 'CMV', value: 40 },
        { name: 'Impostos', value: 15 },
        { name: 'Desp. Fixas', value: 25 },
        { name: 'Desp. Var.', value: 10 },
        { name: 'Lucro', value: 10 }
    ],
    showLegend: true,
    height: 250,
    size: 'half'
};
