import { useState } from 'react'
import { TremorShowcase } from './TremorShowcase'
import { RechartsShowcase } from './RechartsShowcase'
import { NivoShowcase } from './NivoShowcase'
import { ApexChartsShowcase } from './ApexChartsShowcase'
import { GoogleChartsShowcase } from './GoogleChartsShowcase'

type TabId = 'tremor' | 'recharts' | 'nivo' | 'apex' | 'google'

export function ChartLibrariesPage() {
  const [activeTab, setActiveTab] = useState<TabId>('tremor')

  const tabs = [
    { id: 'tremor' as TabId, label: 'Tremor', description: 'Tailwind + Recharts' },
    { id: 'recharts' as TabId, label: 'Recharts', description: '24.8K+ ⭐' },
    { id: 'nivo' as TabId, label: 'Nivo', description: 'Mais Bonito' },
    { id: 'apex' as TabId, label: 'ApexCharts', description: '100+ Charts' },
    { id: 'google' as TabId, label: 'Google Charts', description: 'By Google' }
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 min-w-[140px] px-4 py-3 rounded-xl font-medium transition-all
                ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <div className="text-sm font-bold">{tab.label}</div>
              <div className={`text-xs mt-0.5 ${activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'}`}>
                {tab.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-screen">
        {activeTab === 'tremor' && <TremorShowcase />}
        {activeTab === 'recharts' && <RechartsShowcase />}
        {activeTab === 'nivo' && <NivoShowcase />}
        {activeTab === 'apex' && <ApexChartsShowcase />}
        {activeTab === 'google' && <GoogleChartsShowcase />}
      </div>
    </div>
  )
}
