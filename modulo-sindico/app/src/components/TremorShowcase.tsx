import {
  AreaChart,
  BarChart,
  DonutChart,
  LineChart,
  BarList
} from '@tremor/react'

export function TremorShowcase() {
  // Sample data for different chart types
  const timeSeriesData = [
    { month: 'Jan', sales: 2890, revenue: 4938 },
    { month: 'Fev', sales: 3200, revenue: 5201 },
    { month: 'Mar', sales: 2800, revenue: 4567 },
    { month: 'Abr', sales: 3900, revenue: 6234 },
    { month: 'Mai', sales: 3500, revenue: 5789 },
    { month: 'Jun', sales: 4200, revenue: 6890 }
  ]

  const categoryData = [
    { name: 'Produto A', value: 3420 },
    { name: 'Produto B', value: 2890 },
    { name: 'Produto C', value: 2150 },
    { name: 'Produto D', value: 1870 },
    { name: 'Produto E', value: 1650 }
  ]

  const barListData = [
    { name: 'Top Cliente 1', value: 456 },
    { name: 'Top Cliente 2', value: 351 },
    { name: 'Top Cliente 3', value: 271 },
    { name: 'Top Cliente 4', value: 191 }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tremor Charts Library
        </h1>
        <p className="text-gray-600">
          Biblioteca de gráficos profissionais baseada em Recharts com suporte a Tailwind CSS
        </p>
        <div className="mt-4 flex gap-2">
          <a
            href="https://tremor.so/docs/getting-started/installation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Documentação
          </a>
          <span className="text-gray-300">•</span>
          <a
            href="https://github.com/tremorlabs/tremor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* Area Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Area Chart</h2>
          <p className="text-sm text-gray-600">Gráfico de área ideal para mostrar tendências ao longo do tempo</p>
        </div>
        <AreaChart
          className="h-72"
          data={timeSeriesData}
          index="month"
          categories={['sales', 'revenue']}
          colors={['blue', 'emerald']}
          valueFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
          showLegend={true}
          showGridLines={true}
          showXAxis={true}
          showYAxis={true}
        />
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;AreaChart data=&#123;data&#125; index="month" categories=&#123;['sales', 'revenue']&#125; /&gt;
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Bar Chart</h2>
          <p className="text-sm text-gray-600">Gráfico de barras vertical para comparação entre categorias</p>
        </div>
        <BarChart
          className="h-72"
          data={timeSeriesData}
          index="month"
          categories={['sales', 'revenue']}
          colors={['violet', 'amber']}
          valueFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
          showLegend={true}
          showGridLines={true}
          showXAxis={true}
          showYAxis={true}
        />
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;BarChart data=&#123;data&#125; index="month" categories=&#123;['sales', 'revenue']&#125; /&gt;
          </p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Line Chart</h2>
          <p className="text-sm text-gray-600">Gráfico de linha para visualizar mudanças contínuas</p>
        </div>
        <LineChart
          className="h-72"
          data={timeSeriesData}
          index="month"
          categories={['sales', 'revenue']}
          colors={['rose', 'cyan']}
          valueFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
          showLegend={true}
          showGridLines={true}
          showXAxis={true}
          showYAxis={true}
        />
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;LineChart data=&#123;data&#125; index="month" categories=&#123;['sales', 'revenue']&#125; /&gt;
          </p>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Donut Chart</h2>
          <p className="text-sm text-gray-600">Gráfico de rosquinha para mostrar proporções e distribuição</p>
        </div>
        <div className="flex items-center justify-center">
          <DonutChart
            className="h-72 w-full max-w-md"
            data={categoryData}
            category="value"
            index="name"
            valueFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
            colors={['blue', 'violet', 'emerald', 'amber', 'rose']}
            showLabel={true}
            showTooltip={true}
          />
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;DonutChart data=&#123;data&#125; category="value" index="name" /&gt;
          </p>
        </div>
      </div>

      {/* BarList */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Bar List</h2>
          <p className="text-sm text-gray-600">Lista de barras horizontais para rankings e comparações</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <BarList
            data={barListData}
            valueFormatter={(value) => `${value} vendas`}
            color="blue"
            showAnimation={true}
          />
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;BarList data=&#123;data&#125; valueFormatter=&#123;(v) =&gt; `$&#123;v&#125;`&#125; /&gt;
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recursos Principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">🎨 Customizável</h3>
            <p className="text-sm text-blue-700">
              Cores Tailwind, formatadores personalizados e opções de visualização
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <h3 className="font-semibold text-emerald-900 mb-2">📱 Responsivo</h3>
            <p className="text-sm text-emerald-700">
              Funciona perfeitamente em desktop, tablet e mobile
            </p>
          </div>
          <div className="p-4 bg-violet-50 rounded-lg border border-violet-100">
            <h3 className="font-semibold text-violet-900 mb-2">⚡ Performance</h3>
            <p className="text-sm text-violet-700">
              Baseado em Recharts com otimizações para grandes datasets
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <h3 className="font-semibold text-amber-900 mb-2">🔧 TypeScript</h3>
            <p className="text-sm text-amber-700">
              Totalmente tipado com excelente suporte para IntelliSense
            </p>
          </div>
          <div className="p-4 bg-rose-50 rounded-lg border border-rose-100">
            <h3 className="font-semibold text-rose-900 mb-2">🎯 Acessível</h3>
            <p className="text-sm text-rose-700">
              Componentes acessíveis seguindo as melhores práticas
            </p>
          </div>
          <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-100">
            <h3 className="font-semibold text-cyan-900 mb-2">📊 Interativo</h3>
            <p className="text-sm text-cyan-700">
              Tooltips, legends e animações suaves por padrão
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
