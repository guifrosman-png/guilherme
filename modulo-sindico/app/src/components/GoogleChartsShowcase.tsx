import { Chart } from 'react-google-charts'

export function GoogleChartsShowcase() {
  // Area Chart Data
  const areaChartData = [
    ['Mês', 'Vendas', 'Receita'],
    ['Jan', 2890, 4938],
    ['Fev', 3200, 5201],
    ['Mar', 2800, 4567],
    ['Abr', 3900, 6234],
    ['Mai', 3500, 5789],
    ['Jun', 4200, 6890]
  ]

  const areaChartOptions = {
    title: 'Vendas e Receita Mensal',
    hAxis: { title: 'Mês', titleTextStyle: { color: '#333' } },
    vAxis: { minValue: 0 },
    colors: ['#3b82f6', '#10b981'],
    chartArea: { width: '80%', height: '70%' }
  }

  // Column Chart Data
  const columnChartData = [
    ['Mês', 'Vendas', 'Receita', 'Lucro'],
    ['Jan', 2890, 4938, 2048],
    ['Fev', 3200, 5201, 2001],
    ['Mar', 2800, 4567, 1767],
    ['Abr', 3900, 6234, 2334],
    ['Mai', 3500, 5789, 2289],
    ['Jun', 4200, 6890, 2690]
  ]

  const columnChartOptions = {
    title: 'Comparação Mensal',
    colors: ['#8b5cf6', '#f59e0b', '#10b981'],
    chartArea: { width: '80%', height: '70%' },
    legend: { position: 'top' }
  }

  // Line Chart Data
  const lineChartData = [
    ['Mês', 'Vendas', 'Receita'],
    ['Jan', 2890, 4938],
    ['Fev', 3200, 5201],
    ['Mar', 2800, 4567],
    ['Abr', 3900, 6234],
    ['Mai', 3500, 5789],
    ['Jun', 4200, 6890]
  ]

  const lineChartOptions = {
    title: 'Tendência de Crescimento',
    curveType: 'function',
    colors: ['#ec4899', '#06b6d4'],
    chartArea: { width: '80%', height: '70%' },
    legend: { position: 'top' }
  }

  // Pie Chart Data
  const pieChartData = [
    ['Produto', 'Vendas'],
    ['Produto A', 3420],
    ['Produto B', 2890],
    ['Produto C', 2150],
    ['Produto D', 1870]
  ]

  const pieChartOptions = {
    title: 'Distribuição de Vendas por Produto',
    colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
    is3D: false,
    pieSliceText: 'percentage',
    chartArea: { width: '90%', height: '80%' }
  }

  // Geo Chart Data
  const geoChartData = [
    ['País', 'Vendas'],
    ['Brazil', 8500],
    ['United States', 12300],
    ['Germany', 6200],
    ['France', 5400],
    ['Japan', 7800]
  ]

  const geoChartOptions = {
    colorAxis: { colors: ['#e3f2fd', '#1976d2'] },
    backgroundColor: '#f5f5f5',
    datalessRegionColor: '#f8bbd0',
    defaultColor: '#f5f5f5'
  }

  // Combo Chart Data
  const comboChartData = [
    ['Mês', 'Vendas', 'Receita', 'Taxa'],
    ['Jan', 2890, 4938, 58.5],
    ['Fev', 3200, 5201, 61.5],
    ['Mar', 2800, 4567, 61.3],
    ['Abr', 3900, 6234, 62.6],
    ['Mai', 3500, 5789, 60.5],
    ['Jun', 4200, 6890, 61.0]
  ]

  const comboChartOptions = {
    title: 'Vendas, Receita e Taxa de Conversão',
    vAxis: { title: 'Valores' },
    hAxis: { title: 'Mês' },
    seriesType: 'bars',
    series: { 2: { type: 'line' } },
    colors: ['#3b82f6', '#10b981', '#f59e0b'],
    chartArea: { width: '80%', height: '70%' }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Google Charts Library
        </h1>
        <p className="text-gray-600">
          25+ tipos de gráficos - desenvolvido e mantido pelo Google, grátis e confiável
        </p>
        <div className="mt-4 flex gap-2">
          <a
            href="https://www.react-google-charts.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Documentação React
          </a>
          <span className="text-gray-300">•</span>
          <a
            href="https://developers.google.com/chart"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Google Charts Docs
          </a>
          <span className="text-gray-300">•</span>
          <a
            href="https://github.com/rakannimer/react-google-charts"
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
          <p className="text-sm text-gray-600">Gráfico de área com preenchimento suave</p>
        </div>
        <Chart
          chartType="AreaChart"
          width="100%"
          height="400px"
          data={areaChartData}
          options={areaChartOptions}
        />
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;Chart chartType="AreaChart" data=&#123;data&#125; options=&#123;options&#125; /&gt;
          </p>
        </div>
      </div>

      {/* Column Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Column Chart</h2>
          <p className="text-sm text-gray-600">Gráfico de colunas verticais para comparação</p>
        </div>
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          data={columnChartData}
          options={columnChartOptions}
        />
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;Chart chartType="ColumnChart" data=&#123;data&#125; options=&#123;options&#125; /&gt;
          </p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Line Chart</h2>
          <p className="text-sm text-gray-600">Gráfico de linha com curvas suaves</p>
        </div>
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={lineChartData}
          options={lineChartOptions}
        />
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;Chart chartType="LineChart" data=&#123;data&#125; options=&#123;&#123;curveType: 'function'&#125;&#125; /&gt;
          </p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Pie Chart</h2>
          <p className="text-sm text-gray-600">Gráfico de pizza com percentuais</p>
        </div>
        <div className="flex justify-center">
          <Chart
            chartType="PieChart"
            width="100%"
            height="400px"
            data={pieChartData}
            options={pieChartOptions}
          />
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;Chart chartType="PieChart" data=&#123;data&#125; options=&#123;&#123;is3D: true&#125;&#125; /&gt;
          </p>
        </div>
      </div>

      {/* Geo Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Geo Chart</h2>
          <p className="text-sm text-gray-600">Mapa mundial com dados geográficos</p>
        </div>
        <Chart
          chartType="GeoChart"
          width="100%"
          height="400px"
          data={geoChartData}
          options={geoChartOptions}
        />
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;Chart chartType="GeoChart" data=&#123;geoData&#125; /&gt;
          </p>
        </div>
      </div>

      {/* Combo Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Combo Chart</h2>
          <p className="text-sm text-gray-600">Combinação de barras e linha no mesmo gráfico</p>
        </div>
        <Chart
          chartType="ComboChart"
          width="100%"
          height="400px"
          data={comboChartData}
          options={comboChartOptions}
        />
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;Chart chartType="ComboChart" options=&#123;&#123;seriesType: 'bars', series: &#123;2: &#123;type: 'line'&#125;&#125;&#125;&#125; /&gt;
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Por que Google Charts?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">🌐 Google Power</h3>
            <p className="text-sm text-blue-700">
              Desenvolvido e mantido pelo Google - estável e confiável
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <h3 className="font-semibold text-emerald-900 mb-2">💰 Grátis</h3>
            <p className="text-sm text-emerald-700">
              100% gratuito - sem limites, sem custos ocultos
            </p>
          </div>
          <div className="p-4 bg-violet-50 rounded-lg border border-violet-100">
            <h3 className="font-semibold text-violet-900 mb-2">📊 25+ Charts</h3>
            <p className="text-sm text-violet-700">
              Mais de 25 tipos - incluindo GeoChart, Gantt, Timeline
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <h3 className="font-semibold text-amber-900 mb-2">⚡ Simples</h3>
            <p className="text-sm text-amber-700">
              API fácil - data em arrays simples, options em objeto
            </p>
          </div>
          <div className="p-4 bg-rose-50 rounded-lg border border-rose-100">
            <h3 className="font-semibold text-rose-900 mb-2">🌍 Cross-Browser</h3>
            <p className="text-sm text-rose-700">
              Compatível com todos os navegadores modernos
            </p>
          </div>
          <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-100">
            <h3 className="font-semibold text-cyan-900 mb-2">📱 Responsivo</h3>
            <p className="text-sm text-cyan-700">
              Adapta automaticamente ao tamanho da tela
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
