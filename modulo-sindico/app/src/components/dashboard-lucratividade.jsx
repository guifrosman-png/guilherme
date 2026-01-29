import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, Legend, AreaChart, Area } from 'recharts';

// Dados processados do CSV
const rawData = [
  { produto: "BOMBOM LACTA OURO BRANCO 20G", qtd: 1, cmv: 0.9, vlVenda: 2.5, lucro: 1.6, margem: 57.95, oferta: false },
  { produto: "GOMA MASCAR MENTOS PURE FRESH 56G", qtd: 1, cmv: 8.49, vlVenda: 14.99, lucro: 6.5, margem: 31.52, oferta: false },
  { produto: "GRAPE COOL ORIGINAL 350ML", qtd: 1, cmv: 6.89, vlVenda: 11.98, lucro: 5.09, margem: 38.58, oferta: false },
  { produto: "CREME LEITE ITALAC 200G", qtd: 3, cmv: 7.23, vlVenda: 14.97, lucro: 7.74, margem: 46.86, oferta: false },
  { produto: "LEITE UHT SEMIDESNATADO 1L ITALAC", qtd: 2, cmv: 8.58, vlVenda: 17.98, lucro: 9.4, margem: 52.28, oferta: false },
  { produto: "BOLO AMERICANO NOZES DAMASCO 350G", qtd: 1, cmv: 12.76, vlVenda: 22.98, lucro: 10.22, margem: 40.36, oferta: false },
  { produto: "FEIJOADA COMPLETA FRUTIFICA 300G", qtd: 1, cmv: 14.38, vlVenda: 24.99, lucro: 10.61, margem: 38.53, oferta: false },
  { produto: "COCA COLA PET 600ML ZERO", qtd: 2, cmv: 9.52, vlVenda: 19.98, lucro: 10.46, margem: 52.35, oferta: false },
  { produto: "SPRITE PET 510ML LEMON FRSH", qtd: 1, cmv: 2.91, vlVenda: 7.99, lucro: 5.08, margem: 63.58, oferta: false },
  { produto: "COCA COLA PET 600ML", qtd: 1, cmv: 4.76, vlVenda: 9.99, lucro: 5.23, margem: 52.35, oferta: false },
  { produto: "MONSTER ENERGY 473ML", qtd: 1, cmv: 7.11, vlVenda: 13.59, lucro: 6.48, margem: 47.68, oferta: true },
  { produto: "COCA COLA 1,5L ZERO", qtd: 2, cmv: 17.76, vlVenda: 29.98, lucro: 12.22, margem: 40.76, oferta: false },
  { produto: "WAFER AMANDITA CHOCOLATE 200G", qtd: 1, cmv: 11.56, vlVenda: 24.98, lucro: 13.42, margem: 48.76, oferta: false },
  { produto: "CHEETOS ONDA 75G REQUEIJÃO", qtd: 1, cmv: 5.04, vlVenda: 9.99, lucro: 4.95, margem: 45, oferta: false },
  { produto: "MONSTER ENERGY ZERO 473ML", qtd: 1, cmv: 7.11, vlVenda: 13.59, lucro: 6.48, margem: 47.68, oferta: true },
  { produto: "SPRITE PET 1,5L LEMON FRSH", qtd: 1, cmv: 6.02, vlVenda: 14.99, lucro: 8.97, margem: 59.84, oferta: false },
  { produto: "GATORADE LIMAO 500ML", qtd: 1, cmv: 4.59, vlVenda: 7.98, lucro: 3.39, margem: 42.48, oferta: false },
  { produto: "AGUA CRYSTAL S/ GAS 500ML", qtd: 1, cmv: 1.4, vlVenda: 4.99, lucro: 3.59, margem: 71.94, oferta: false },
  { produto: "CHOCOTRIO BISCOITO CHOCOLATE 90G", qtd: 1, cmv: 6.49, vlVenda: 12.99, lucro: 6.5, margem: 45.41, oferta: false },
  { produto: "AGUA CRYSTAL C/ GAS 500ML", qtd: 3, cmv: 4.71, vlVenda: 14.97, lucro: 10.26, margem: 68.54, oferta: false },
  { produto: "KIT KAT BRANCO 41,5G", qtd: 1, cmv: 3.1, vlVenda: 5.98, lucro: 2.88, margem: 43.76, oferta: false },
  { produto: "CERVEJA HEINEKEN LATA 350ML", qtd: 2, cmv: 10.04, vlVenda: 11.98, lucro: 1.94, margem: 16.19, oferta: true },
  { produto: "BISC OREO ORIGINAL 90G", qtd: 1, cmv: 2.5, vlVenda: 5.98, lucro: 3.48, margem: 52.79, oferta: false },
  { produto: "FILTRO PAPEL MELITTA 103", qtd: 1, cmv: 3.1, vlVenda: 5.99, lucro: 2.89, margem: 43.84, oferta: false },
  { produto: "PAO HAMBURGUER BAUDUCCO 200G", qtd: 1, cmv: 6.83, vlVenda: 10.98, lucro: 4.15, margem: 34.28, oferta: false },
  { produto: "CERVEJA BECK'S 350ML", qtd: 3, cmv: 14.25, vlVenda: 17.97, lucro: 3.72, margem: 20.7, oferta: true },
  { produto: "TALENTO CASTANHA DO PARA 25G", qtd: 1, cmv: 2.52, vlVenda: 4.99, lucro: 2.47, margem: 44.86, oferta: false },
  { produto: "GUARANA ANTARTICA 1,5L ZERO", qtd: 1, cmv: 6.44, vlVenda: 14.98, lucro: 8.54, margem: 57.01, oferta: false },
  { produto: "MACARRAO TURMA MONICA 85G", qtd: 1, cmv: 2.34, vlVenda: 4.99, lucro: 2.65, margem: 53.11, oferta: false },
  { produto: "PAO LEITE PADERRI 280G", qtd: 1, cmv: 7.84, vlVenda: 15.99, lucro: 8.15, margem: 46.28, oferta: false },
  { produto: "DORITOS 75G QJ NACHO", qtd: 1, cmv: 7.21, vlVenda: 12.98, lucro: 5.77, margem: 40.37, oferta: false },
  { produto: "MOSTARDA HEINZ 255G", qtd: 1, cmv: 11.89, vlVenda: 18.99, lucro: 7.1, margem: 33.93, oferta: false },
  { produto: "SORVETE MAGNUM AVELÃ 90ML", qtd: 1, cmv: 13.91, vlVenda: 24.98, lucro: 11.07, margem: 40.23, oferta: false },
  { produto: "KETCHUP HEINZ 397G", qtd: 1, cmv: 10.02, vlVenda: 17.98, lucro: 7.96, margem: 40.19, oferta: false },
  { produto: "CHOC LACTA AO LEITE 28G", qtd: 1, cmv: 2.49, vlVenda: 4.99, lucro: 2.5, margem: 45.46, oferta: false },
  { produto: "SORVETE KIBON TABLITO 59G", qtd: 1, cmv: 7.75, vlVenda: 11.97, lucro: 4.22, margem: 32.02, oferta: false },
  { produto: "PAO ARTESANO 500G PULLMAN", qtd: 1, cmv: 10.31, vlVenda: 13.98, lucro: 3.67, margem: 23.8, oferta: false },
  { produto: "SORVETE KIBON CHICABON 62G", qtd: 1, cmv: 6.97, vlVenda: 11.97, lucro: 5, margem: 37.87, oferta: false },
  { produto: "BISC PIRAQUE MALTADO BLACK 80G", qtd: 4, cmv: 13.16, vlVenda: 23.96, lucro: 10.8, margem: 40.83, oferta: false },
  { produto: "AMENDOIM JAPONES 80G", qtd: 1, cmv: 1.87, vlVenda: 3.99, lucro: 2.12, margem: 48.14, oferta: false },
  { produto: "BOLD CRUNCH BRIGADEIRO 60G", qtd: 1, cmv: 9.81, vlVenda: 16.98, lucro: 7.17, margem: 30.7, oferta: false },
  { produto: "SALAME SADIA ITALIANO 100G", qtd: 1, cmv: 11.81, vlVenda: 20.99, lucro: 9.18, margem: 39.68, oferta: false },
  { produto: "SORVETE TABLITO AVELA", qtd: 1, cmv: 7.74, vlVenda: 12.98, lucro: 5.24, margem: 36.67, oferta: false },
  { produto: "BALA FINI AMORAS 90G", qtd: 1, cmv: 3.95, vlVenda: 9.98, lucro: 6.03, margem: 43.99, oferta: false },
  { produto: "WHISKAS SALMAO 85G", qtd: 1, cmv: 2.58, vlVenda: 4.99, lucro: 2.41, margem: 43.86, oferta: false },
  { produto: "SKITTLES ORIGINAL 38G", qtd: 1, cmv: 2.55, vlVenda: 5.49, lucro: 2.94, margem: 38.87, oferta: false },
  { produto: "BISC NEGRESCO 90G", qtd: 1, cmv: 2.02, vlVenda: 4.98, lucro: 2.96, margem: 54, oferta: false },
  { produto: "SUCO NATURAL ONE LARANJA 300ML", qtd: 1, cmv: 4.31, vlVenda: 7.99, lucro: 3.68, margem: 41.81, oferta: false },
  { produto: "PAO COM CREME UNID", qtd: 1, cmv: 0, vlVenda: 7.99, lucro: 7.99, margem: 78.75, oferta: false },
  { produto: "BATATA PALHA YOKI 105G", qtd: 2, cmv: 13.74, vlVenda: 23.98, lucro: 10.24, margem: 38.79, oferta: false },
  { produto: "CHOC LACTA BRANCO OURO BCO 98G", qtd: 1, cmv: 5.72, vlVenda: 12.99, lucro: 7.27, margem: 40.73, oferta: false },
  { produto: "AGUA CRYSTAL C/ GAS 1,5L", qtd: 1, cmv: 2.98, vlVenda: 6.99, lucro: 4.01, margem: 57.37, oferta: false },
  { produto: "WAFER BAUDUCCO MAXI CHOCOLATE 104G", qtd: 1, cmv: 3, vlVenda: 4.99, lucro: 1.99, margem: 36.24, oferta: false },
  { produto: "CERVEJA SPATEN 350ML", qtd: 6, cmv: 24.54, vlVenda: 29.94, lucro: 5.4, margem: 18.04, oferta: true },
  { produto: "BOLD TRUFA CHOCOLATE 60G", qtd: 3, cmv: 29.43, vlVenda: 50.94, lucro: 21.51, margem: 30.7, oferta: false },
  { produto: "LEITE ITALAC INTEGRAL 1L", qtd: 1, cmv: 3.99, vlVenda: 7.19, lucro: 3.2, margem: 44.51, oferta: true },
  { produto: "CHOCOTRIO AO LEITE 90G", qtd: 1, cmv: 6.49, vlVenda: 12.99, lucro: 6.5, margem: 45.41, oferta: false },
  { produto: "BALA MENTOS MINT 37,5G", qtd: 1, cmv: 1.7, vlVenda: 3.99, lucro: 2.29, margem: 41.67, oferta: false },
  { produto: "ESCONDIDINHO FRANGO SADIA 600G", qtd: 1, cmv: 15.45, vlVenda: 29.99, lucro: 14.54, margem: 48.48, oferta: false },
  { produto: "GUARANA ANTARTICA 350ML ZERO", qtd: 1, cmv: 2.92, vlVenda: 5.99, lucro: 3.07, margem: 51.25, oferta: false },
  { produto: "SADIA HOT BOWLS ALMONDEGAS 300G", qtd: 1, cmv: 8.42, vlVenda: 15.98, lucro: 7.56, margem: 47.31, oferta: false },
  { produto: "CERVEJA ESTRELLA GALICIA 350ML", qtd: 2, cmv: 8.12, vlVenda: 11.98, lucro: 3.86, margem: 32.22, oferta: true },
  { produto: "FANDANGOS 35G PRESUNTO", qtd: 1, cmv: 2.4, vlVenda: 6.99, lucro: 4.59, margem: 59.56, oferta: false },
  { produto: "TORCIDA 100G PIM MEXIC", qtd: 1, cmv: 2.64, vlVenda: 5.99, lucro: 3.35, margem: 50.68, oferta: false },
  { produto: "BROA DE MILHO UNI", qtd: 2, cmv: 0, vlVenda: 13.58, lucro: 13.58, margem: 78.75, oferta: false },
  { produto: "CREME RICOTA TIROLEZ 200G", qtd: 1, cmv: 5.89, vlVenda: 9.99, lucro: 4.1, margem: 33.65, oferta: false },
  { produto: "CERVEJA BLUE MOON 350ML", qtd: 1, cmv: 6.39, vlVenda: 9.99, lucro: 3.6, margem: 36.04, oferta: true },
  { produto: "CHOCO WHEYFER MAIS MU 25G", qtd: 1, cmv: 4.24, vlVenda: 7.99, lucro: 3.75, margem: 42.56, oferta: false },
  { produto: "CHOC TRENTO CHO BRC 29G", qtd: 1, cmv: 1.95, vlVenda: 4.98, lucro: 3.03, margem: 55.21, oferta: false },
  { produto: "SNICKERS PE DE MOLEQUE 42G", qtd: 1, cmv: 2.64, vlVenda: 5.99, lucro: 3.35, margem: 50.68, oferta: false },
  { produto: "MOLHO TOMATE HEINZ 240G", qtd: 1, cmv: 2.1, vlVenda: 4.99, lucro: 2.89, margem: 52.47, oferta: false },
  { produto: "BISC PIRAQUE GOIABINHA 75G", qtd: 1, cmv: 3.58, vlVenda: 7.99, lucro: 4.41, margem: 50.07, oferta: false },
  { produto: "SORVETE KIBON TABLITO 3 CHOC 61G", qtd: 1, cmv: 7.7, vlVenda: 12.49, lucro: 4.79, margem: 34.79, oferta: false },
  { produto: "PAO DE QUEIJO GOURMET KG", qtd: 3, cmv: 0, vlVenda: 38.14, lucro: 38.14, margem: 78.75, oferta: false },
  { produto: "ANA MARIA COBERTA AVELA 42G", qtd: 1, cmv: 2.19, vlVenda: 3.98, lucro: 1.79, margem: 40.75, oferta: false },
  { produto: "PAO FRANCES INTEGRAL KG", qtd: 1, cmv: 0, vlVenda: 5.58, lucro: 5.58, margem: 88, oferta: false },
  { produto: "RED BULL AMORA SUGAR FREE 250ML", qtd: 1, cmv: 6.49, vlVenda: 12.99, lucro: 6.5, margem: 50.04, oferta: false },
  { produto: "PAO FRANCES KG", qtd: 2, cmv: 0, vlVenda: 9.62, lucro: 9.62, margem: 88, oferta: false },
  { produto: "BOLD TUBE PISTACHE 40G", qtd: 2, cmv: 12.58, vlVenda: 19.96, lucro: 7.38, margem: 26.86, oferta: true },
  { produto: "PAO COM PARMESÃO KG", qtd: 2, cmv: 0, vlVenda: 14.56, lucro: 14.56, margem: 78.75, oferta: false },
  { produto: "BOLD BOMBOM CROCANTE 40G", qtd: 1, cmv: 6.6, vlVenda: 11.98, lucro: 5.38, margem: 32.68, oferta: false },
  { produto: "AGUA TONICA ANTARTICA 350ML DIET", qtd: 1, cmv: 2.92, vlVenda: 5.98, lucro: 3.06, margem: 51.17, oferta: false },
  { produto: "MOLHO SHOYU LIGHT SAKURA 150ML", qtd: 2, cmv: 7.78, vlVenda: 13.96, lucro: 6.18, margem: 40.18, oferta: false },
  { produto: "BEB. LACTEA NESTON 280ML", qtd: 1, cmv: 5.88, vlVenda: 9.98, lucro: 4.1, margem: 29.86, oferta: false },
];

// Cores do tema
const COLORS = {
  primary: '#10B981',
  secondary: '#3B82F6',
  accent: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  cyan: '#06B6D4',
  lime: '#84CC16',
};

const CHART_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#14B8A6'];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Cálculos agregados
  const totalVendas = rawData.reduce((sum, item) => sum + item.vlVenda, 0);
  const totalLucro = rawData.reduce((sum, item) => sum + item.lucro, 0);
  const totalItens = rawData.reduce((sum, item) => sum + item.qtd, 0);
  const margemMedia = rawData.reduce((sum, item) => sum + item.margem, 0) / rawData.length;

  // Top 10 por Lucro Bruto
  const topLucro = [...rawData].sort((a, b) => b.lucro - a.lucro).slice(0, 10).map(item => ({
    nome: item.produto.length > 25 ? item.produto.substring(0, 25) + '...' : item.produto,
    lucro: item.lucro,
    venda: item.vlVenda
  }));

  // Top 10 por Margem Líquida
  const topMargem = [...rawData].sort((a, b) => b.margem - a.margem).slice(0, 10).map(item => ({
    nome: item.produto.length > 25 ? item.produto.substring(0, 25) + '...' : item.produto,
    margem: item.margem
  }));

  // Top 10 mais vendidos por quantidade
  const topQtd = [...rawData].sort((a, b) => b.qtd - a.qtd).slice(0, 10).map(item => ({
    nome: item.produto.length > 25 ? item.produto.substring(0, 25) + '...' : item.produto,
    qtd: item.qtd
  }));

  // Distribuição de margens (histograma)
  const margemRanges = [
    { range: '0-20%', count: rawData.filter(d => d.margem >= 0 && d.margem < 20).length },
    { range: '20-40%', count: rawData.filter(d => d.margem >= 20 && d.margem < 40).length },
    { range: '40-60%', count: rawData.filter(d => d.margem >= 40 && d.margem < 60).length },
    { range: '60-80%', count: rawData.filter(d => d.margem >= 60 && d.margem < 80).length },
    { range: '80-100%', count: rawData.filter(d => d.margem >= 80).length },
  ];

  // Produtos em oferta vs preço cheio
  const ofertaData = [
    { name: 'Em Oferta', value: rawData.filter(d => d.oferta).length, lucro: rawData.filter(d => d.oferta).reduce((s, d) => s + d.lucro, 0) },
    { name: 'Preço Cheio', value: rawData.filter(d => !d.oferta).length, lucro: rawData.filter(d => !d.oferta).reduce((s, d) => s + d.lucro, 0) },
  ];

  // Scatter data para Venda x Lucro
  const scatterData = rawData.map(item => ({
    x: item.vlVenda,
    y: item.lucro,
    z: item.qtd,
    nome: item.produto,
    margem: item.margem
  }));

  // Categorias por tipo de produto
  const categorias = [
    { categoria: 'Bebidas', valor: rawData.filter(d => d.produto.includes('AGUA') || d.produto.includes('REF.') || d.produto.includes('CERVEJA') || d.produto.includes('GUARANA') || d.produto.includes('ENERG') || d.produto.includes('SUCO') || d.produto.includes('GATORADE') || d.produto.includes('RED BULL') || d.produto.includes('COCA') || d.produto.includes('SPRITE')).reduce((s, d) => s + d.vlVenda, 0) },
    { categoria: 'Chocolates', valor: rawData.filter(d => d.produto.includes('CHOC') || d.produto.includes('BOMBOM') || d.produto.includes('KIT KAT') || d.produto.includes('TALENTO') || d.produto.includes('SNICKERS') || d.produto.includes('TRENTO')).reduce((s, d) => s + d.vlVenda, 0) },
    { categoria: 'Biscoitos', valor: rawData.filter(d => d.produto.includes('BISC') || d.produto.includes('WAFER') || d.produto.includes('OREO')).reduce((s, d) => s + d.vlVenda, 0) },
    { categoria: 'Padaria', valor: rawData.filter(d => d.produto.includes('PAO') || d.produto.includes('BOLO') || d.produto.includes('BROA')).reduce((s, d) => s + d.vlVenda, 0) },
    { categoria: 'Salgadinhos', valor: rawData.filter(d => d.produto.includes('CHEETOS') || d.produto.includes('DORITOS') || d.produto.includes('FANDANGOS') || d.produto.includes('TORCIDA') || d.produto.includes('BATATA')).reduce((s, d) => s + d.vlVenda, 0) },
    { categoria: 'Sorvetes', valor: rawData.filter(d => d.produto.includes('SORVETE') || d.produto.includes('MAGNUM') || d.produto.includes('KIBON') || d.produto.includes('TABLITO')).reduce((s, d) => s + d.vlVenda, 0) },
    { categoria: 'Proteínas/Fitness', valor: rawData.filter(d => d.produto.includes('BOLD') || d.produto.includes('WHEYFER')).reduce((s, d) => s + d.vlVenda, 0) },
    { categoria: 'Outros', valor: rawData.filter(d => !d.produto.match(/AGUA|REF\.|CERVEJA|GUARANA|ENERG|SUCO|GATORADE|RED BULL|COCA|SPRITE|CHOC|BOMBOM|KIT KAT|TALENTO|SNICKERS|TRENTO|BISC|WAFER|OREO|PAO|BOLO|BROA|CHEETOS|DORITOS|FANDANGOS|TORCIDA|BATATA|SORVETE|MAGNUM|KIBON|TABLITO|BOLD|WHEYFER/)).reduce((s, d) => s + d.vlVenda, 0) },
  ].sort((a, b) => b.valor - a.valor);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'rgba(15, 23, 42, 0.95)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '4px' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, fontSize: '14px', fontWeight: '600' }}>
              {entry.name}: {typeof entry.value === 'number' ? (entry.dataKey === 'margem' ? `${entry.value.toFixed(1)}%` : `R$ ${entry.value.toFixed(2)}`) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: 'rgba(15, 23, 42, 0.95)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '250px' }}>
          <p style={{ color: '#fff', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>{data.nome}</p>
          <p style={{ color: '#10B981', fontSize: '12px' }}>Venda: R$ {data.x.toFixed(2)}</p>
          <p style={{ color: '#3B82F6', fontSize: '12px' }}>Lucro: R$ {data.y.toFixed(2)}</p>
          <p style={{ color: '#F59E0B', fontSize: '12px' }}>Margem: {data.margem.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      fontFamily: "'Outfit', sans-serif",
      color: '#E2E8F0',
      padding: '24px'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        
        .card {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .card:hover {
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .stat-card {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8));
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--accent-color);
        }
        
        .tab {
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          font-size: 14px;
        }
        
        .tab:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .tab.active {
          background: linear-gradient(135deg, #10B981, #059669);
          color: white;
        }
        
        .glow-green { box-shadow: 0 0 30px rgba(16, 185, 129, 0.2); }
        .glow-blue { box-shadow: 0 0 30px rgba(59, 130, 246, 0.2); }
        .glow-amber { box-shadow: 0 0 30px rgba(245, 158, 11, 0.2); }
        .glow-purple { box-shadow: 0 0 30px rgba(139, 92, 246, 0.2); }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #10B981, #3B82F6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📊 Dashboard de Lucratividade
        </h1>
        <p style={{ color: '#64748B', fontSize: '14px' }}>
          Higienópolis Cosmopolitan • {rawData.length} produtos analisados
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div className="stat-card glow-green" style={{ '--accent-color': '#10B981' }}>
          <p style={{ color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Faturamento Total</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#10B981' }}>R$ {totalVendas.toFixed(2)}</p>
        </div>
        <div className="stat-card glow-blue" style={{ '--accent-color': '#3B82F6' }}>
          <p style={{ color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Lucro Bruto Total</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#3B82F6' }}>R$ {totalLucro.toFixed(2)}</p>
        </div>
        <div className="stat-card glow-amber" style={{ '--accent-color': '#F59E0B' }}>
          <p style={{ color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Itens Vendidos</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#F59E0B' }}>{totalItens}</p>
        </div>
        <div className="stat-card glow-purple" style={{ '--accent-color': '#8B5CF6' }}>
          <p style={{ color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Margem Média</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#8B5CF6' }}>{margemMedia.toFixed(1)}%</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'rgba(15, 23, 42, 0.5)', padding: '8px', borderRadius: '12px', width: 'fit-content' }}>
        <div className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Visão Geral</div>
        <div className={`tab ${activeTab === 'produtos' ? 'active' : ''}`} onClick={() => setActiveTab('produtos')}>Produtos</div>
        <div className={`tab ${activeTab === 'margens' ? 'active' : ''}`} onClick={() => setActiveTab('margens')}>Margens</div>
        <div className={`tab ${activeTab === 'promocoes' ? 'active' : ''}`} onClick={() => setActiveTab('promocoes')}>Promoções</div>
      </div>

      {/* Charts Grid */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {/* Top 10 Lucro */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#E2E8F0' }}>
              🏆 Top 10 Produtos por Lucro Bruto
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topLucro} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `R$${v}`} />
                <YAxis type="category" dataKey="nome" tick={{ fill: '#94A3B8', fontSize: 10 }} width={150} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="lucro" fill="url(#greenGradient)" radius={[0, 4, 4, 0]} name="Lucro" />
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Categorias */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#E2E8F0' }}>
              📦 Faturamento por Categoria
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categorias}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="valor"
                  nameKey="categoria"
                  label={({ categoria, percent }) => `${categoria} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#64748B' }}
                >
                  {categorias.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Scatter Plot */}
          <div className="card" style={{ padding: '24px', gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#E2E8F0' }}>
              📈 Relação Venda × Lucro por Produto
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" dataKey="x" name="Venda" tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `R$${v}`} label={{ value: 'Valor de Venda (R$)', position: 'bottom', fill: '#64748B', fontSize: 12 }} />
                <YAxis type="number" dataKey="y" name="Lucro" tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `R$${v}`} label={{ value: 'Lucro (R$)', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 12 }} />
                <Tooltip content={<ScatterTooltip />} />
                <Scatter name="Produtos" data={scatterData} fill="#10B981">
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.margem > 50 ? '#10B981' : entry.margem > 30 ? '#F59E0B' : '#EF4444'} fillOpacity={0.7} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></span> Margem &gt; 50%
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }}></span> Margem 30-50%
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></span> Margem &lt; 30%
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'produtos' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {/* Top Quantidade */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#E2E8F0' }}>
              📊 Produtos Mais Vendidos (Quantidade)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topQtd} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis type="category" dataKey="nome" tick={{ fill: '#94A3B8', fontSize: 10 }} width={150} />
                <Tooltip />
                <Bar dataKey="qtd" fill="url(#blueGradient)" radius={[0, 4, 4, 0]} name="Quantidade" />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#60A5FA" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Lucro */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#E2E8F0' }}>
              💰 Top 10 por Lucro Bruto
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topLucro} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `R$${v}`} />
                <YAxis type="category" dataKey="nome" tick={{ fill: '#94A3B8', fontSize: 10 }} width={150} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="lucro" fill="url(#purpleGradient)" radius={[0, 4, 4, 0]} name="Lucro" />
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'margens' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {/* Histograma Margens */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#E2E8F0' }}>
              📉 Distribuição de Margens
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={margemRanges} margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="range" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Produtos" radius={[4, 4, 0, 0]}>
                  {margemRanges.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Margem */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#E2E8F0' }}>
              🎯 Top 10 por Margem Líquida (%)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topMargem} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="nome" tick={{ fill: '#94A3B8', fontSize: 10 }} width={150} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="margem" fill="url(#amberGradient)" radius={[0, 4, 4, 0]} name="Margem" />
                <defs>
                  <linearGradient id="amberGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#FBBF24" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'promocoes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {/* Oferta vs Preço Cheio */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#E2E8F0' }}>
              🏷️ Quantidade: Oferta vs Preço Cheio
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ofertaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  <Cell fill="#EF4444" />
                  <Cell fill="#10B981" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Lucro Oferta vs Preço Cheio */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#E2E8F0' }}>
              💵 Lucro: Oferta vs Preço Cheio
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ofertaData} margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `R$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="lucro" name="Lucro Total" radius={[4, 4, 0, 0]}>
                  <Cell fill="#EF4444" />
                  <Cell fill="#10B981" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Insight Card */}
          <div className="card" style={{ padding: '24px', gridColumn: 'span 2', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1))' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#F59E0B' }}>
              💡 Insights sobre Promoções
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <div>
                <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>Produtos em Oferta</p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#EF4444' }}>{ofertaData[0].value} itens</p>
              </div>
              <div>
                <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>Lucro de Ofertas</p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#EF4444' }}>R$ {ofertaData[0].lucro.toFixed(2)}</p>
              </div>
              <div>
                <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>Margem Média Ofertas</p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#F59E0B' }}>
                  {(rawData.filter(d => d.oferta).reduce((s, d) => s + d.margem, 0) / rawData.filter(d => d.oferta).length || 0).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
