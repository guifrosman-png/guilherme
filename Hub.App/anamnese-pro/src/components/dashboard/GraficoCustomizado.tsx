/**
 * 📊 COMPONENTE DE GRÁFICO CUSTOMIZADO
 * Renderiza gráficos dinâmicos baseados em perguntas customizadas
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Sparkles } from 'lucide-react';
import { GraficoConfig } from '../../types/graficos';
import { processarRespostasTexto, processarRespostasSimNao, processarRespostasMultipla } from '../../utils/graficoHelpers';

interface GraficoCustomizadoProps {
  config: GraficoConfig;           // Configuração do gráfico
  anamneses: any[];                // Todas as anamneses para extrair dados
  coresTema: {
    primary: string;
    secondary: string;
  };
}

export function GraficoCustomizado({ config, anamneses, coresTema }: GraficoCustomizadoProps) {
  // 🎨 CORES PARA OS GRÁFICOS
  const CORES_PIZZA = ['#ec4899', '#3b82f6', '#94a3b8']; // Rosa, Azul, Cinza
  const CORES_DONUT = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']; // Variadas

  // 📊 EXTRAIR RESPOSTAS DAS ANAMNESES
  const extrairRespostas = (): any[] => {
    if (!config.perguntaId) {
      console.warn('⚠️ Gráfico sem perguntaId:', config);
      return [];
    }

    const respostas: any[] = [];

    console.log(`🔍 Buscando respostas para pergunta: ${config.perguntaId} (${config.titulo})`);
    console.log(`📊 Total de anamneses: ${anamneses.length}`);

    anamneses.forEach(anamnese => {
      // Verificar se tem dadosCompletos
      if (!anamnese.dadosCompletos) return;

      const dadosCompletos = anamnese.dadosCompletos;

      // 🎯 As respostas customizadas estão em: dadosCompletos.respostasCustomizadas
      let resposta = null;

      // FORMATO NOVO: respostasCustomizadas é um objeto { "pergunta-id": "resposta" }
      if (dadosCompletos.respostasCustomizadas && typeof dadosCompletos.respostasCustomizadas === 'object') {
        resposta = dadosCompletos.respostasCustomizadas[config.perguntaId];
      }

      // FALLBACK: Tentar buscar diretamente (compatibilidade com formato antigo)
      if (resposta === undefined || resposta === null) {
        resposta = dadosCompletos[config.perguntaId];
      }

      // FALLBACK 2: Verificar se existe em formato de array de respostas
      if ((resposta === undefined || resposta === null) && dadosCompletos.respostas) {
        const respostaObj = dadosCompletos.respostas.find((r: any) => r.perguntaId === config.perguntaId);
        if (respostaObj) {
          resposta = respostaObj.resposta;
        }
      }

      // Adicionar resposta válida (não vazia e não nula)
      if (resposta !== undefined && resposta !== null && resposta !== '') {
        respostas.push(resposta);
        console.log(`✅ Resposta encontrada:`, resposta);
      }
    });

    console.log(`📝 Total de respostas encontradas: ${respostas.length}`, respostas);
    return respostas;
  };

  // 🔄 PROCESSAR DADOS BASEADO NO TIPO
  const processarDados = () => {
    const respostas = extrairRespostas();

    // Se não tem respostas, retornar vazio
    if (respostas.length === 0) return null;

    // Processar baseado no tipo de pergunta
    switch (config.tipoPergunta) {
      case 'texto':
        // Garantir que todas as respostas são strings
        const respostasTexto = respostas.filter(r => typeof r === 'string' && r.trim() !== '');
        return processarRespostasTexto(respostasTexto);

      case 'simNao':
        // Garantir que todas as respostas são booleanos
        const respostasBoolean = respostas.map(r => {
          if (typeof r === 'boolean') return r;
          if (typeof r === 'string') {
            const lower = r.toLowerCase();
            return lower === 'sim' || lower === 'yes' || lower === 'true';
          }
          return false;
        });
        return processarRespostasSimNao(respostasBoolean);

      case 'multiplaEscolha':
        // Garantir que todas as respostas são strings
        const respostasString = respostas.filter(r => typeof r === 'string' && r.trim() !== '');
        return processarRespostasMultipla(respostasString);

      default:
        return null;
    }
  };

  const dados = processarDados();

  // 🚫 ESTADO VAZIO - Sem dados para mostrar
  if (!dados || dados.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{config.titulo}</CardTitle>
          <CardDescription>{config.descricao}</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            titulo="Sem dados disponíveis"
            descricao="Ainda não há respostas para esta pergunta. Os dados aparecerão conforme os clientes preencherem as anamneses."
          />
        </CardContent>
      </Card>
    );
  }

  // 🎨 RENDERIZAR GRÁFICO BASEADO NO TIPO
  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.titulo}</CardTitle>
        <CardDescription>{config.descricao}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* GRÁFICO DE PIZZA (Sim/Não) */}
        {config.tipoGrafico === 'pizza' && (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dados}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nome, percentual }) => `${nome}: ${percentual}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="valor"
              >
                {dados.map((entry: any, index: number) => (
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
                  `${value} resposta(s) (${props.payload.percentual}%)`,
                  props.payload.nome
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        {/* GRÁFICO DE DONUT (Múltipla Escolha) */}
        {config.tipoGrafico === 'donut' && (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dados}
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
                {dados.map((entry: any, index: number) => (
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
                  `${value} resposta(s) (${props.payload.percentual}%)`,
                  props.payload.nome
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        {/* GRÁFICO DE BARRAS TOP 5 (Texto) */}
        {config.tipoGrafico === 'barrasTop5' && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="nome"
                stroke="#666"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
                formatter={(value: any) => [`${value} resposta(s)`, 'Total']}
              />
              <Bar dataKey="valor" fill={coresTema.primary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ========== COMPONENTE DE ESTADO VAZIO ==========

interface EmptyStateProps {
  titulo: string;
  descricao: string;
}

function EmptyState({ titulo, descricao }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] text-center px-4 animate-fadeIn">
      <div className="relative group">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-200 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
          <TrendingUp className="h-10 w-10 text-gray-400 transition-colors duration-300 group-hover:text-gray-500" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-pink-500" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{titulo}</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">{descricao}</p>
    </div>
  );
}
