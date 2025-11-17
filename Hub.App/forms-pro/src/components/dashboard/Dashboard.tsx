import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, FileText, TrendingUp, Sparkles, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { GraficoManager } from './GraficoManager';
import { GraficoCustomizado } from './GraficoCustomizado';
import { inicializarGraficosPadrao, carregarGraficosPorProfissao } from '../../utils/graficoHelpers';
import { GraficoConfig, GRAFICOS_PADRAO_IDS } from '../../types/graficos';
import { getProfissaoAtual } from '../../theme';

interface DashboardProps {
  anamneses: any[];
  clientes: any[];
  selectedPeriod: string;
  customDateRange?: { start: string; end: string } | null;
}

export function Dashboard({ anamneses, clientes, selectedPeriod, customDateRange }: DashboardProps) {
  // 🎛️ ESTADOS
  const [mostrarGerenciador, setMostrarGerenciador] = useState(false);
  const [graficosConfig, setGraficosConfig] = useState<GraficoConfig[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);

  // 🔄 INICIALIZAR GRÁFICOS PADRÃO NA PRIMEIRA VEZ
  useEffect(() => {
    // 🧹 LIMPAR GRÁFICOS COM TIPOS ANTIGOS (apenas uma vez)
    const jaLimpou = localStorage.getItem('graficosLimpos_v2');
    if (!jaLimpou) {
      console.log('🧹 Limpando gráficos com tipos antigos...');
      localStorage.removeItem('graficosConfig');
      localStorage.setItem('graficosLimpos_v2', 'true');
      console.log('✅ Gráficos limpos! Sistema reiniciado.');
    }

    inicializarGraficosPadrao();
    carregarConfiguracoes();
  }, []);

  // Carregar configurações dos gráficos (filtrados por profissão)
  const carregarConfiguracoes = () => {
    const profissaoAtual = getProfissaoAtual();
    const configs = carregarGraficosPorProfissao(profissaoAtual);
    setGraficosConfig(configs);
  };

  // Atualizar quando o gerenciador fizer mudanças
  const handleGerenciadorUpdate = () => {
    carregarConfiguracoes();
    setForceUpdate(prev => prev + 1); // Força re-render
  };

  // 🎨 OBTER CORES TEMÁTICAS DA PROFISSÃO
  const getCoresTema = () => {
    const config = localStorage.getItem('anamneseConfig');
    const templateProfissao = config ? JSON.parse(config).templateProfissao : 'tatuagem';

    const cores: any = {
      tatuagem: {
        primary: '#ec4899', // pink-500
        secondary: '#d946ef', // fuchsia-500
      },
      psicologia: {
        primary: '#d946ef', // fuchsia-500
        secondary: '#db2777', // pink-600
      },
      nutricao: {
        primary: '#f472b6', // pink-400
        secondary: '#e879f9', // fuchsia-400
      },
      fisioterapia: {
        primary: '#c026d3', // fuchsia-600
        secondary: '#be185d', // pink-700
      },
      estetica: {
        primary: '#ec4899', // pink-500
        secondary: '#f43f5e', // rose-500
      },
      consultoria: {
        primary: '#d946ef', // fuchsia-500
        secondary: '#9333ea', // purple-600
      },
    };
    return cores[templateProfissao] || cores.tatuagem;
  };

  const coresTema = getCoresTema();

  // 🔍 FUNÇÃO DE FILTRO POR PERÍODO
  const filtrarPorPeriodo = (data: string) => {
    if (selectedPeriod === 'todos') return true;

    try {
      // Converter data para timestamp
      let dataTimestamp: number;

      if (data.includes('-')) {
        // Formato yyyy-mm-dd
        dataTimestamp = new Date(data).getTime();
      } else {
        // Formato dd/mm/yyyy
        const [dia, mes, ano] = data.split('/');
        dataTimestamp = new Date(`${ano}-${mes}-${dia}`).getTime();
      }

      // 🎯 SE FOR FILTRO CUSTOMIZADO, usar datas personalizadas
      if (selectedPeriod === 'custom' && customDateRange) {
        const startTimestamp = new Date(customDateRange.start).getTime();
        const endTimestamp = new Date(customDateRange.end).getTime();
        return dataTimestamp >= startTimestamp && dataTimestamp <= endTimestamp;
      }

      // 🎯 SE FOR FILTRO PRÉ-DEFINIDO, usar dias
      const hoje = new Date().getTime();
      const diferencaDias = Math.floor((hoje - dataTimestamp) / (1000 * 60 * 60 * 24));

      switch (selectedPeriod) {
        case 'semanal':
          return diferencaDias <= 7;
        case 'mensal':
          return diferencaDias <= 30;
        case 'trimestral':
          return diferencaDias <= 90;
        case 'anual':
          return diferencaDias <= 365;
        default:
          return true;
      }
    } catch (error) {
      console.warn('Erro ao filtrar data:', data);
      return false;
    }
  };

  // Aplicar filtro de período nos dados
  const anamnesesFiltradas = anamneses.filter(a => {
    const dataParaFiltrar = a.dadosCompletos?.dataAnamnese || a.data;
    return dataParaFiltrar && filtrarPorPeriodo(dataParaFiltrar);
  });

  const clientesFiltrados = clientes.filter(c => {
    return c.primeiraAnamnese && filtrarPorPeriodo(c.primeiraAnamnese);
  });

  // Componente de Estado Vazio
  const EmptyState = ({ icon: Icon, titulo, descricao }: { icon: any, titulo: string, descricao: string }) => (
    <div className="flex flex-col items-center justify-center h-[300px] text-center px-4 animate-fadeIn">
      <div className="relative group">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-200 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
          <Icon className="h-10 w-10 text-gray-400 transition-colors duration-300 group-hover:text-gray-500" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-pink-500" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{titulo}</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">{descricao}</p>
    </div>
  );

  // 📊 FUNÇÃO 1: Processar dados de Clientes por Mês
  const getClientesPorMes = () => {
    // Array com os nomes dos meses
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    // Criar objeto para contar clientes por mês
    const contagemPorMes: Record<string, number> = {};

    // Inicializar todos os meses com 0
    meses.forEach(mes => {
      contagemPorMes[mes] = 0;
    });

    // Percorrer TODOS os clientes (SEM FILTRO) e contar por mês baseado em primeiraAnamnese
    clientes.forEach((cliente: any) => {
      if (cliente.primeiraAnamnese) {
        try {
          // Pegar a data da primeira anamnese (formato: dd/mm/yyyy)
          const [dia, mes, ano] = cliente.primeiraAnamnese.split('/');
          const mesIndex = parseInt(mes, 10) - 1; // Janeiro = 0, Fevereiro = 1...

          if (mesIndex >= 0 && mesIndex < 12) {
            const nomeMes = meses[mesIndex];
            contagemPorMes[nomeMes]++;
          }
        } catch (error) {
          console.warn('Erro ao processar data do cliente:', cliente);
        }
      }
    });

    // Transformar em array para o gráfico
    return meses.map(mes => ({
      mes,
      clientes: contagemPorMes[mes]
    }));
  };

  const dadosClientesPorMes = getClientesPorMes();

  // 📊 FUNÇÃO 2: Processar dados de Anamneses por Mês
  const getAnamnesesPorMes = () => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const contagemPorMes: Record<string, number> = {};

    // Inicializar todos os meses com 0
    meses.forEach(mes => {
      contagemPorMes[mes] = 0;
    });

    // Percorrer todas as anamneses FILTRADAS e contar por mês baseado na data de preenchimento
    anamnesesFiltradas.forEach((anamnese: any) => {
      // Priorizar dataAnamnese (campo do quiz), senão usar data
      let dataParaUsar = anamnese.dadosCompletos?.dataAnamnese || anamnese.data;

      if (dataParaUsar) {
        try {
          let mesIndex: number;

          // Se for formato yyyy-mm-dd (do input date)
          if (dataParaUsar.includes('-')) {
            const [ano, mes, dia] = dataParaUsar.split('-');
            mesIndex = parseInt(mes, 10) - 1;
          } else {
            // Se for formato dd/mm/yyyy (formato brasileiro)
            const [dia, mes, ano] = dataParaUsar.split('/');
            mesIndex = parseInt(mes, 10) - 1;
          }

          if (mesIndex >= 0 && mesIndex < 12) {
            const nomeMes = meses[mesIndex];
            contagemPorMes[nomeMes]++;
          }
        } catch (error) {
          console.warn('Erro ao processar data da anamnese:', anamnese);
        }
      }
    });

    // Transformar em array para o gráfico
    return meses.map(mes => ({
      mes,
      anamneses: contagemPorMes[mes]
    }));
  };

  const dadosAnamnesesPorMes = getAnamnesesPorMes();

  // 🍰 FUNÇÃO 3: Processar dados de Sexo dos Clientes
  const getDadosSexo = () => {
    let masculino = 0;
    let feminino = 0;
    let naoInformado = 0;

    // Buscar sexo dos clientes FILTRADOS (pode estar diretamente no cliente ou em dadosCompletos da última anamnese)
    clientesFiltrados.forEach((cliente: any) => {
      let sexo = cliente.sexo || cliente.genero; // Suporta ambos os nomes por compatibilidade

      // Se não tem no cliente, buscar na última anamnese
      if (!sexo) {
        const anamnesesDoCliente = anamnesesFiltradas.filter((a: any) => a.clienteId === cliente.id);
        if (anamnesesDoCliente.length > 0) {
          // Pegar a mais recente
          const ultimaAnamnese = anamnesesDoCliente[0];
          sexo = ultimaAnamnese.dadosCompletos?.sexo || ultimaAnamnese.dadosCompletos?.genero;
        }
      }

      if (sexo) {
        const sexoLower = sexo.toLowerCase();
        if (sexoLower === 'masculino' || sexoLower === 'm') {
          masculino++;
        } else if (sexoLower === 'feminino' || sexoLower === 'f') {
          feminino++;
        } else {
          naoInformado++;
        }
      } else {
        naoInformado++;
      }
    });

    // Retornar dados para o gráfico (filtrar os que têm valor = 0)
    const dados = [
      { nome: 'Feminino', valor: feminino, percentual: clientesFiltrados.length > 0 ? ((feminino / clientesFiltrados.length) * 100).toFixed(1) : 0 },
      { nome: 'Masculino', valor: masculino, percentual: clientesFiltrados.length > 0 ? ((masculino / clientesFiltrados.length) * 100).toFixed(1) : 0 }
    ];

    // Só adicionar "Não Informado" se houver algum
    if (naoInformado > 0) {
      dados.push({ nome: 'Não Informado', valor: naoInformado, percentual: clientesFiltrados.length > 0 ? ((naoInformado / clientesFiltrados.length) * 100).toFixed(1) : 0 });
    }

    return dados;
  };

  const dadosSexo = getDadosSexo();

  // Cores para o gráfico de pizza
  const CORES_PIZZA = ['#ec4899', '#3b82f6', '#94a3b8']; // Rosa, Azul, Cinza

  // 🍩 FUNÇÃO 4: Processar dados de Origem dos Clientes
  const getDadosOrigem = () => {
    const origens: Record<string, number> = {};

    // Contar apenas a PRIMEIRA anamnese de cada cliente (quando ele foi adquirido)
    const clientesProcessados = new Set<number>();

    // Ordenar anamneses FILTRADAS por data (mais antigas primeiro)
    const anamnesesOrdenadas = [...anamnesesFiltradas].sort((a, b) => {
      const dataA = new Date(a.dataCriacao || a.data).getTime();
      const dataB = new Date(b.dataCriacao || b.data).getTime();
      return dataA - dataB;
    });

    anamnesesOrdenadas.forEach((anamnese: any) => {
      // Se já processamos este cliente, pular
      if (clientesProcessados.has(anamnese.clienteId)) {
        return;
      }

      // Marcar cliente como processado
      clientesProcessados.add(anamnese.clienteId);

      // Pegar origem (comoConheceu)
      const origem = anamnese.dadosCompletos?.comoConheceu;
      if (origem) {
        if (origem === 'Outro' && anamnese.dadosCompletos?.outraOrigem) {
          // Se é "Outro", usar o texto especificado
          const outraOrigem = anamnese.dadosCompletos.outraOrigem;
          origens[outraOrigem] = (origens[outraOrigem] || 0) + 1;
        } else {
          origens[origem] = (origens[origem] || 0) + 1;
        }
      }
    });

    // Transformar em array para o gráfico
    const total = Object.values(origens).reduce((acc, val) => acc + val, 0);
    return Object.entries(origens)
      .map(([nome, valor]) => ({
        nome,
        valor,
        percentual: total > 0 ? ((valor / total) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.valor - a.valor); // Ordenar por valor (maior primeiro)
  };

  const dadosOrigem = getDadosOrigem();

  // 🎂 FUNÇÃO 5: Processar dados de Faixa Etária dos Clientes (para Psicologia)
  const getDadosFaixaEtaria = () => {
    const faixas = {
      'Crianças (0-12)': 0,
      'Adolescentes (13-17)': 0,
      'Adultos (18-59)': 0,
      'Idosos (60+)': 0
    };

    // Processar cada cliente FILTRADO
    clientesFiltrados.forEach((cliente: any) => {
      let faixaEtaria = null;
      let dataNascimento = cliente.dataNascimento;

      // Buscar na última anamnese se não tem no cliente
      const anamnesesDoCliente = anamnesesFiltradas.filter((a: any) => a.clienteId === cliente.id);
      if (anamnesesDoCliente.length > 0) {
        const ultimaAnamnese = anamnesesDoCliente[0];

        // 🎯 PRIORIDADE 1: Usar campo faixaEtaria se existir (preenchido manualmente no quiz)
        faixaEtaria = ultimaAnamnese.dadosCompletos?.faixaEtaria;

        // 🎯 PRIORIDADE 2: Se não tem faixaEtaria, buscar data de nascimento
        if (!dataNascimento) {
          dataNascimento = ultimaAnamnese.dadosCompletos?.dataNascimento;
        }
      }

      // Se tem faixa etária informada diretamente, usar ela
      if (faixaEtaria) {
        if (faixaEtaria === 'Criança') {
          faixas['Crianças (0-12)']++;
        } else if (faixaEtaria === 'Adolescente') {
          faixas['Adolescentes (13-17)']++;
        } else if (faixaEtaria === 'Adulto') {
          faixas['Adultos (18-59)']++;
        } else if (faixaEtaria === 'Idoso') {
          faixas['Idosos (60+)']++;
        }
      }
      // Se não tem faixa etária informada, calcular pela data de nascimento
      else if (dataNascimento) {
        try {
          const hoje = new Date();
          const nascimento = new Date(dataNascimento);
          let idade = hoje.getFullYear() - nascimento.getFullYear();
          const mes = hoje.getMonth() - nascimento.getMonth();

          if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
          }

          // Classificar em faixa etária
          if (idade >= 0 && idade <= 12) {
            faixas['Crianças (0-12)']++;
          } else if (idade >= 13 && idade <= 17) {
            faixas['Adolescentes (13-17)']++;
          } else if (idade >= 18 && idade <= 59) {
            faixas['Adultos (18-59)']++;
          } else if (idade >= 60) {
            faixas['Idosos (60+)']++;
          }
        } catch (error) {
          console.warn('Erro ao processar data de nascimento:', cliente);
        }
      }
    });

    // Transformar em array para o gráfico (filtrar faixas com 0)
    const total = Object.values(faixas).reduce((acc, val) => acc + val, 0);
    return Object.entries(faixas)
      .filter(([_, valor]) => valor > 0) // Só mostrar faixas com clientes
      .map(([nome, valor]) => ({
        nome,
        valor,
        percentual: total > 0 ? ((valor / total) * 100).toFixed(1) : 0
      }));
  };

  const dadosFaixaEtaria = getDadosFaixaEtaria();

  // 🎯 DETECTAR PROFISSÃO PARA RENDERIZAÇÃO CONDICIONAL
  const getProfissao = () => {
    const config = localStorage.getItem('anamneseConfig');
    return config ? JSON.parse(config).templateProfissao : 'tatuagem';
  };
  const profissao = getProfissao();

  // Cores para o gráfico de rosquinha (donut)
  const CORES_DONUT = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981']; // Rosa, Roxo, Azul, Verde

  // Verificar quais gráficos devem ser mostrados
  const graficoClientesMesVisivel = graficosConfig.find(g => g.id === GRAFICOS_PADRAO_IDS.CLIENTES_MES)?.visivel ?? true;
  const graficoAnamnesesMesVisivel = graficosConfig.find(g => g.id === GRAFICOS_PADRAO_IDS.ANAMNESES_MES)?.visivel ?? true;
  const graficoSexoVisivel = graficosConfig.find(g => g.id === GRAFICOS_PADRAO_IDS.DISTRIBUICAO_SEXO)?.visivel ?? true;
  const graficoOrigemVisivel = graficosConfig.find(g => g.id === GRAFICOS_PADRAO_IDS.ORIGEM_CLIENTES)?.visivel ?? true;

  // Filtrar gráficos customizados visíveis
  const graficosCustomizados = graficosConfig.filter(g => g.categoria === 'customizado' && g.visivel);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Visão geral do seu negócio</p>
        </div>
        <Button
          onClick={() => setMostrarGerenciador(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Gerenciar Gráficos
        </Button>
      </div>

      {/* Modal de Gerenciamento */}
      {mostrarGerenciador && (
        <GraficoManager
          onClose={() => setMostrarGerenciador(false)}
          onUpdate={handleGerenciadorUpdate}
        />
      )}

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Clientes</CardDescription>
            <CardTitle className="text-4xl">{clientesFiltrados.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Anamneses</CardDescription>
            <CardTitle className="text-4xl">{anamnesesFiltradas.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Anamneses Concluídas</CardDescription>
            <CardTitle className="text-4xl">
              {anamnesesFiltradas.filter(a => a.status === 'concluida').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 📊 GRÁFICO 1: Clientes por Mês (Barras) */}
        {graficoClientesMesVisivel && (
        <Card>
          <CardHeader>
            <CardTitle>Clientes por Mês</CardTitle>
            <CardDescription>Novos clientes cadastrados em cada mês</CardDescription>
          </CardHeader>
          <CardContent>
            {clientesFiltrados.length === 0 ? (
              <EmptyState
                icon={Users}
                titulo="Nenhum cliente no período"
                descricao="Não há clientes cadastrados no período selecionado. Tente ampliar o filtro de data."
              />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosClientesPorMes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="clientes" fill={coresTema.primary} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        )}

        {/* 📈 GRÁFICO 2: Anamneses por Mês (Linha) */}
        {graficoAnamnesesMesVisivel && (
        <Card>
          <CardHeader>
            <CardTitle>Anamneses por Mês</CardTitle>
            <CardDescription>Quantidade de anamneses realizadas em cada mês</CardDescription>
          </CardHeader>
          <CardContent>
            {anamnesesFiltradas.length === 0 ? (
              <EmptyState
                icon={FileText}
                titulo="Nenhuma anamnese no período"
                descricao="Não há anamneses registradas no período selecionado. Tente ampliar o filtro de data."
              />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dadosAnamnesesPorMes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="anamneses"
                    stroke={coresTema.secondary}
                    strokeWidth={3}
                    dot={{ fill: coresTema.secondary, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        )}

        {/* 🍰 GRÁFICO 3: Distribuição por Sexo (Pizza) */}
        {graficoSexoVisivel && (
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Sexo</CardTitle>
            <CardDescription>Percentual de clientes por sexo</CardDescription>
          </CardHeader>
          <CardContent>
            {clientesFiltrados.length === 0 ? (
              <EmptyState
                icon={Users}
                titulo="Sem dados no período"
                descricao="Não há clientes no período selecionado. Tente ampliar o filtro de data."
              />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dadosSexo}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nome, percentual }) => `${nome}: ${percentual}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {dadosSexo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any, name: any, props: any) => [
                      `${value} cliente(s) (${props.payload.percentual}%)`,
                      props.payload.nome
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        )}

        {/* 🍩 GRÁFICO 4: Origem dos Clientes (Rosquinha/Donut) */}
        {graficoOrigemVisivel && (
        <Card>
          <CardHeader>
            <CardTitle>Origem dos Clientes</CardTitle>
            <CardDescription>Como seus clientes conheceram você</CardDescription>
          </CardHeader>
          <CardContent>
            {anamnesesFiltradas.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                titulo="Sem dados no período"
                descricao="Não há anamneses no período selecionado. Tente ampliar o filtro de data."
              />
            ) : dadosOrigem.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                titulo="Sem dados de origem"
                descricao="Preencha o campo 'Como conheceu' nas anamneses para ver este gráfico"
              />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dadosOrigem}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nome, percentual }) => `${nome}: ${percentual}%`}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="valor"
                    paddingAngle={2}
                  >
                    {dadosOrigem.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CORES_DONUT[index % CORES_DONUT.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any, name: any, props: any) => [
                      `${value} cliente(s) (${props.payload.percentual}%)`,
                      props.payload.nome
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        )}

        {/* 🎨 GRÁFICOS CUSTOMIZADOS (das perguntas criadas) */}
        {graficosCustomizados.map(graficoConfig => (
          <GraficoCustomizado
            key={graficoConfig.id}
            config={graficoConfig}
            anamneses={anamnesesFiltradas}
            coresTema={coresTema}
          />
        ))}
      </div>
    </div>
  );
}
