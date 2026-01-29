import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import { ResponsivePie } from '@nivo/pie'

export function NivoShowcase() {
  const barData = [
    { month: 'Jan', vendas: 2890, receita: 4938, lucro: 2048 },
    { month: 'Fev', vendas: 3200, receita: 5201, lucro: 2001 },
    { month: 'Mar', vendas: 2800, receita: 4567, lucro: 1767 },
    { month: 'Abr', vendas: 3900, receita: 6234, lucro: 2334 },
    { month: 'Mai', vendas: 3500, receita: 5789, lucro: 2289 },
    { month: 'Jun', vendas: 4200, receita: 6890, lucro: 2690 }
  ]

  const lineData = [
    {
      id: 'vendas',
      data: [
        { x: 'Jan', y: 2890 },
        { x: 'Fev', y: 3200 },
        { x: 'Mar', y: 2800 },
        { x: 'Abr', y: 3900 },
        { x: 'Mai', y: 3500 },
        { x: 'Jun', y: 4200 }
      ]
    },
    {
      id: 'receita',
      data: [
        { x: 'Jan', y: 4938 },
        { x: 'Fev', y: 5201 },
        { x: 'Mar', y: 4567 },
        { x: 'Abr', y: 6234 },
        { x: 'Mai', y: 5789 },
        { x: 'Jun', y: 6890 }
      ]
    }
  ]

  const pieData = [
    { id: 'Produto A', label: 'Produto A', value: 3420, color: '#3b82f6' },
    { id: 'Produto B', label: 'Produto B', value: 2890, color: '#8b5cf6' },
    { id: 'Produto C', label: 'Produto C', value: 2150, color: '#10b981' },
    { id: 'Produto D', label: 'Produto D', value: 1870, color: '#f59e0b' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Nivo Library
        </h1>
        <p className="text-gray-600">
          Gráficos modernos e visualmente impressionantes - SVG, Canvas e HTML rendering
        </p>
        <div className="mt-4 flex gap-2">
          <a
            href="https://nivo.rocks/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Documentação
          </a>
          <span className="text-gray-300">•</span>
          <a
            href="https://github.com/plouc/nivo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Bar Chart</h2>
          <p className="text-sm text-gray-600">Gráfico de barras com animações suaves e temas modernos</p>
        </div>
        <div className="h-[400px]">
          <ResponsiveBar
            data={barData}
            keys={['vendas', 'receita', 'lucro']}
            indexBy="month"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={['#3b82f6', '#8b5cf6', '#10b981']}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 1.6]]
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Mês',
              legendPosition: 'middle',
              legendOffset: 32
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Valor',
              legendPosition: 'middle',
              legendOffset: -40
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: 'color',
              modifiers: [['darker', 1.6]]
            }}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
            role="application"
            ariaLabel="Nivo bar chart demo"
          />
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;ResponsiveBar data=&#123;data&#125; keys=&#123;['key1', 'key2']&#125; indexBy="month" /&gt;
          </p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Line Chart</h2>
          <p className="text-sm text-gray-600">Gráfico de linha com curvas suaves e interatividade</p>
        </div>
        <div className="h-[400px]">
          <ResponsiveLine
            data={lineData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false
            }}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Mês',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Valor',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            enableGridX={false}
            colors={['#ec4899', '#06b6d4']}
            lineWidth={3}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;ResponsiveLine data=&#123;data&#125; curve="catmullRom" enableGridX=&#123;false&#125; /&gt;
          </p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Pie Chart</h2>
          <p className="text-sm text-gray-600">Gráfico de pizza com animações e interações elegantes</p>
        </div>
        <div className="h-[500px]">
          <ResponsivePie
            data={pieData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 0.2]]
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: 'color',
              modifiers: [['darker', 2]]
            }}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#000'
                    }
                  }
                ]
              }
            ]}
          />
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;ResponsivePie data=&#123;data&#125; innerRadius=&#123;0.5&#125; padAngle=&#123;0.7&#125; /&gt;
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Por que Nivo?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">🎨 Beleza</h3>
            <p className="text-sm text-blue-700">
              Design moderno e profissional - gráficos visualmente impressionantes
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <h3 className="font-semibold text-emerald-900 mb-2">⚡ Performance</h3>
            <p className="text-sm text-emerald-700">
              SVG, Canvas ou HTML - escolha o melhor para seu caso
            </p>
          </div>
          <div className="p-4 bg-violet-50 rounded-lg border border-violet-100">
            <h3 className="font-semibold text-violet-900 mb-2">🎭 Animações</h3>
            <p className="text-sm text-violet-700">
              Transições suaves e naturais - UX de primeira classe
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <h3 className="font-semibold text-amber-900 mb-2">🎯 Temas</h3>
            <p className="text-sm text-amber-700">
              Sistema de temas built-in - customize cores e estilos
            </p>
          </div>
          <div className="p-4 bg-rose-50 rounded-lg border border-rose-100">
            <h3 className="font-semibold text-rose-900 mb-2">📦 Completo</h3>
            <p className="text-sm text-rose-700">
              Mais de 20 tipos de gráficos - tudo que você precisa
            </p>
          </div>
          <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-100">
            <h3 className="font-semibold text-cyan-900 mb-2">🔧 Flexível</h3>
            <p className="text-sm text-cyan-700">
              Altamente customizável - adapte a qualquer design
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
