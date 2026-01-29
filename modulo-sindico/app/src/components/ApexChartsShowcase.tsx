import { useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'

export function ApexChartsShowcase() {
  // Area Chart
  const [areaOptions] = useState<ApexOptions>({
    chart: {
      type: 'area',
      height: 350,
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#3b82f6', '#10b981'],
    xaxis: {
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return 'R$ ' + val.toLocaleString('pt-BR')
        }
      }
    },
    legend: {
      position: 'top'
    }
  })

  const [areaSeries] = useState([
    {
      name: 'Receita',
      data: [4938, 5201, 4567, 6234, 5789, 6890]
    },
    {
      name: 'Vendas',
      data: [2890, 3200, 2800, 3900, 3500, 4200]
    }
  ])

  // Bar Chart
  const [barOptions] = useState<ApexOptions>({
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    colors: ['#8b5cf6', '#f59e0b', '#10b981'],
    xaxis: {
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
    },
    yaxis: {
      title: {
        text: 'Valores'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return 'R$ ' + val.toLocaleString('pt-BR')
        }
      }
    }
  })

  const [barSeries] = useState([
    {
      name: 'Vendas',
      data: [2890, 3200, 2800, 3900, 3500, 4200]
    },
    {
      name: 'Receita',
      data: [4938, 5201, 4567, 6234, 5789, 6890]
    },
    {
      name: 'Lucro',
      data: [2048, 2001, 1767, 2334, 2289, 2690]
    }
  ])

  // Line Chart
  const [lineOptions] = useState<ApexOptions>({
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#ec4899', '#06b6d4'],
    markers: {
      size: 5,
      hover: {
        size: 7
      }
    },
    xaxis: {
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return 'R$ ' + val.toLocaleString('pt-BR')
        }
      }
    },
    legend: {
      position: 'top'
    }
  })

  const [lineSeries] = useState([
    {
      name: 'Vendas',
      data: [2890, 3200, 2800, 3900, 3500, 4200]
    },
    {
      name: 'Receita',
      data: [4938, 5201, 4567, 6234, 5789, 6890]
    }
  ])

  // Donut Chart
  const [donutOptions] = useState<ApexOptions>({
    chart: {
      type: 'donut'
    },
    colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
    labels: ['Produto A', 'Produto B', 'Produto C', 'Produto D'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    legend: {
      position: 'right'
    }
  })

  const [donutSeries] = useState([3420, 2890, 2150, 1870])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ApexCharts Library
        </h1>
        <p className="text-gray-600">
          Biblioteca mais completa - 100+ tipos de gráficos com features empresariais
        </p>
        <div className="mt-4 flex gap-2">
          <a
            href="https://apexcharts.com/docs/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Documentação
          </a>
          <span className="text-gray-300">•</span>
          <a
            href="https://github.com/apexcharts/apexcharts.js"
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
          <p className="text-sm text-gray-600">Gráfico de área com zoom e tooltips interativos</p>
        </div>
        <ReactApexChart options={areaOptions} series={areaSeries} type="area" height={350} />
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;ReactApexChart options=&#123;options&#125; series=&#123;series&#125; type="area" /&gt;
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Bar Chart</h2>
          <p className="text-sm text-gray-600">Gráfico de barras com múltiplas séries e cantos arredondados</p>
        </div>
        <ReactApexChart options={barOptions} series={barSeries} type="bar" height={350} />
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;ReactApexChart options=&#123;options&#125; series=&#123;series&#125; type="bar" /&gt;
          </p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Line Chart</h2>
          <p className="text-sm text-gray-600">Gráfico de linha com markers e curvas suaves</p>
        </div>
        <ReactApexChart options={lineOptions} series={lineSeries} type="line" height={350} />
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;ReactApexChart options=&#123;options&#125; series=&#123;series&#125; type="line" /&gt;
          </p>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Donut Chart</h2>
          <p className="text-sm text-gray-600">Gráfico de rosquinha responsivo com legendas</p>
        </div>
        <div className="flex justify-center">
          <ReactApexChart options={donutOptions} series={donutSeries} type="donut" height={350} />
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;ReactApexChart options=&#123;options&#125; series=&#123;series&#125; type="donut" /&gt;
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Por que ApexCharts?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">📊 100+ Charts</h3>
            <p className="text-sm text-blue-700">
              Maior variedade de tipos de gráficos do mercado
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <h3 className="font-semibold text-emerald-900 mb-2">🏢 Enterprise</h3>
            <p className="text-sm text-emerald-700">
              Features empresariais - zoom, export, sync, annotations
            </p>
          </div>
          <div className="p-4 bg-violet-50 rounded-lg border border-violet-100">
            <h3 className="font-semibold text-violet-900 mb-2">⚡ Performance</h3>
            <p className="text-sm text-violet-700">
              Otimizado para grandes datasets - milhares de pontos
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <h3 className="font-semibold text-amber-900 mb-2">🎨 Customizável</h3>
            <p className="text-sm text-amber-700">
              Controle total sobre cores, estilos e comportamentos
            </p>
          </div>
          <div className="p-4 bg-rose-50 rounded-lg border border-rose-100">
            <h3 className="font-semibold text-rose-900 mb-2">📱 Responsivo</h3>
            <p className="text-sm text-rose-700">
              Adapta perfeitamente a qualquer tamanho de tela
            </p>
          </div>
          <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-100">
            <h3 className="font-semibold text-cyan-900 mb-2">🔧 Completo</h3>
            <p className="text-sm text-cyan-700">
              Toolbar, legends, tooltips, annotations - tudo incluído
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
