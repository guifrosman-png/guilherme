import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export function RechartsShowcase() {
  const timeSeriesData = [
    { month: 'Jan', sales: 2890, revenue: 4938, profit: 2048 },
    { month: 'Fev', sales: 3200, revenue: 5201, profit: 2001 },
    { month: 'Mar', sales: 2800, revenue: 4567, profit: 1767 },
    { month: 'Abr', sales: 3900, revenue: 6234, profit: 2334 },
    { month: 'Mai', sales: 3500, revenue: 5789, profit: 2289 },
    { month: 'Jun', sales: 4200, revenue: 6890, profit: 2690 }
  ]

  const categoryData = [
    { name: 'Produto A', value: 3420 },
    { name: 'Produto B', value: 2890 },
    { name: 'Produto C', value: 2150 },
    { name: 'Produto D', value: 1870 }
  ]

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Recharts Library
        </h1>
        <p className="text-gray-600">
          24.8K+ stars - Built with D3 and React, renderização SVG limpa e API intuitiva
        </p>
        <div className="mt-4 flex gap-2">
          <a
            href="https://recharts.org/en-US/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Documentação
          </a>
          <span className="text-gray-300">•</span>
          <a
            href="https://github.com/recharts/recharts"
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
          <p className="text-sm text-gray-600">Gráfico de área com múltiplas séries</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="Receita"
            />
            <Area
              type="monotone"
              dataKey="sales"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Vendas"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;AreaChart data=&#123;data&#125;&gt;&lt;Area dataKey="value" /&gt;&lt;/AreaChart&gt;
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Bar Chart</h2>
          <p className="text-sm text-gray-600">Gráfico de barras com comparação múltipla</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="sales" fill="#8b5cf6" name="Vendas" />
            <Bar dataKey="revenue" fill="#f59e0b" name="Receita" />
            <Bar dataKey="profit" fill="#10b981" name="Lucro" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;BarChart data=&#123;data&#125;&gt;&lt;Bar dataKey="value" fill="#color" /&gt;&lt;/BarChart&gt;
          </p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Line Chart</h2>
          <p className="text-sm text-gray-600">Gráfico de linha para tendências</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#ec4899"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Vendas"
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Receita"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;LineChart data=&#123;data&#125;&gt;&lt;Line dataKey="value" stroke="#color" /&gt;&lt;/LineChart&gt;
          </p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Pie Chart</h2>
          <p className="text-sm text-gray-600">Gráfico de pizza com labels e cores customizadas</p>
        </div>
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-mono text-gray-600">
            &lt;PieChart&gt;&lt;Pie data=&#123;data&#125; dataKey="value" label /&gt;&lt;/PieChart&gt;
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Por que Recharts?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">⚡ Simples</h3>
            <p className="text-sm text-blue-700">
              API declarativa e intuitiva - perfeito para começar rápido
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <h3 className="font-semibold text-emerald-900 mb-2">🎯 D3 + React</h3>
            <p className="text-sm text-emerald-700">
              Poder do D3 com sintaxe React - melhor dos dois mundos
            </p>
          </div>
          <div className="p-4 bg-violet-50 rounded-lg border border-violet-100">
            <h3 className="font-semibold text-violet-900 mb-2">📦 SVG Puro</h3>
            <p className="text-sm text-violet-700">
              Renderização SVG limpa - estilize com CSS e Tailwind
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <h3 className="font-semibold text-amber-900 mb-2">🔧 Composável</h3>
            <p className="text-sm text-amber-700">
              Componentes modulares - combine como quiser
            </p>
          </div>
          <div className="p-4 bg-rose-50 rounded-lg border border-rose-100">
            <h3 className="font-semibold text-rose-900 mb-2">📱 Responsivo</h3>
            <p className="text-sm text-rose-700">
              ResponsiveContainer - adapta a qualquer tela
            </p>
          </div>
          <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-100">
            <h3 className="font-semibold text-cyan-900 mb-2">⭐ Popular</h3>
            <p className="text-sm text-cyan-700">
              24.8K+ stars - comunidade ativa e bem documentado
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
