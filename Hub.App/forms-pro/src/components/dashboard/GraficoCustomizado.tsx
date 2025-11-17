/**
 * 📊 COMPONENTE DE GRÁFICO CUSTOMIZADO
 * Renderiza gráficos dinâmicos baseados em perguntas customizadas
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Sparkles } from 'lucide-react';
import { GraficoConfig } from '../../types/graficos';
import { processarRespostasTexto, processarRespostasSimNao, processarRespostasMultipla, processarRespostasCaixasSelecao, processarRespostasEscalaLinear, processarRespostasClassificacao, processarRespostasData, processarRespostasHora, processarRespostasArquivo, DadosGaleria } from '../../utils/graficoHelpers';

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
    try {
    if (!config.perguntaId) {
      console.warn('⚠️ Gráfico sem perguntaId:', config);
      return [];
    }

    const respostas: any[] = [];
    let respostasEncontradas = 0;
    let anamnesesAnalisadas = 0;

    console.group(`🔍 Extraindo respostas para gráfico: "${config.titulo}"`);
    console.log('📌 Config do gráfico:', {
      id: config.id,
      perguntaId: config.perguntaId,
      tipoPergunta: config.tipoPergunta,
      titulo: config.titulo
    });

    anamneses.forEach((anamnese, index) => {
      if (!anamnese.dadosCompletos) {
        console.log(`⏭️ Anamnese ${index + 1}: Sem dadosCompletos`);
        return;
      }

      anamnesesAnalisadas++;
      const dadosCompletos = anamnese.dadosCompletos;
      let resposta = null;
      let estrategiaUsada = 'nenhuma';

      // 🎯 ESTRATÉGIA 1: Buscar pelo perguntaId exato em respostasCustomizadas
      if (dadosCompletos.respostasCustomizadas && typeof dadosCompletos.respostasCustomizadas === 'object') {
        resposta = dadosCompletos.respostasCustomizadas[config.perguntaId];
        if (resposta !== undefined && resposta !== null) {
          estrategiaUsada = '1-ID-Exato';
        }
      }

      // 🎯 ESTRATÉGIA 2: Buscar no snapshot de perguntas pelo TÍTULO exato
      if ((resposta === undefined || resposta === null) && dadosCompletos.perguntasSnapshot) {
        const perguntaCorrespondente = dadosCompletos.perguntasSnapshot.find((p: any) => {
          // Normalizar ambos os textos
          const normalizarTexto = (texto: string) => {
            return texto
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '') // Remove acentos
              .replace(/[?!.,]/g, '')           // Remove pontuação
              .trim();
          };

          const textoPergunta = normalizarTexto(p.titulo || p.texto || '');
          const tituloGrafico = normalizarTexto(config.titulo);

          return textoPergunta === tituloGrafico;
        });

        if (perguntaCorrespondente && dadosCompletos.respostasCustomizadas) {
          resposta = dadosCompletos.respostasCustomizadas[perguntaCorrespondente.id];
          if (resposta !== undefined && resposta !== null) {
            estrategiaUsada = '2-Titulo-Exato';
          }
        }
      }

      // 🎯 ESTRATÉGIA 3: Buscar pelo TIPO + primeira pergunta do mesmo tipo
      if ((resposta === undefined || resposta === null) && dadosCompletos.perguntasSnapshot && config.tipoPergunta) {
        const perguntaCorrespondente = dadosCompletos.perguntasSnapshot.find((p: any) => {
          return p.tipo === config.tipoPergunta;
        });

        if (perguntaCorrespondente && dadosCompletos.respostasCustomizadas) {
          resposta = dadosCompletos.respostasCustomizadas[perguntaCorrespondente.id];
          if (resposta !== undefined && resposta !== null) {
            estrategiaUsada = '3-Tipo-Primeira';
          }
        }
      }

      // 🎯 ESTRATÉGIA 4: Buscar por PALAVRAS-CHAVE no título (mais flexível)
      if ((resposta === undefined || resposta === null) && dadosCompletos.perguntasSnapshot && config.tipoPergunta) {
        const palavrasChave = config.titulo
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .split(' ')
          .filter(p => p.length > 3);

        const perguntaCorrespondente = dadosCompletos.perguntasSnapshot.find((p: any) => {
          if (p.tipo !== config.tipoPergunta) return false;
          const textoPergunta = (p.titulo || p.texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return palavrasChave.some(palavra => textoPergunta.includes(palavra));
        });

        if (perguntaCorrespondente && dadosCompletos.respostasCustomizadas) {
          resposta = dadosCompletos.respostasCustomizadas[perguntaCorrespondente.id];
          if (resposta !== undefined && resposta !== null) {
            estrategiaUsada = '4-Palavras-Chave';
          }
        }
      }

      // 🎯 ESTRATÉGIA 5: Buscar diretamente em dadosCompletos (formato antigo)
      if (resposta === undefined || resposta === null) {
        resposta = dadosCompletos[config.perguntaId];
        if (resposta !== undefined && resposta !== null) {
          estrategiaUsada = '5-Formato-Antigo';
        }
      }

      // ✅ Validar e adicionar resposta
      const isArrayVazio = Array.isArray(resposta) && resposta.length === 0;
      const isValido = resposta !== undefined && resposta !== null && resposta !== '' && !isArrayVazio;

      if (isValido) {
        respostas.push(resposta);
        respostasEncontradas++;
        console.log(`✅ Anamnese ${index + 1}: Resposta encontrada via ${estrategiaUsada}:`, resposta);
      } else {
        console.log(`❌ Anamnese ${index + 1}: Nenhuma resposta encontrada`);
        if (dadosCompletos.respostasCustomizadas) {
          console.log('   → Chaves disponíveis:', Object.keys(dadosCompletos.respostasCustomizadas));
        }
        if (dadosCompletos.perguntasSnapshot) {
          console.log('   → Perguntas no snapshot:', dadosCompletos.perguntasSnapshot.map((p: any) => ({
            id: p.id,
            tipo: p.tipo,
            titulo: p.titulo || p.texto
          })));
        }
      }
    });

    console.log(`\n📊 Resultado final:`);
    console.log(`   → Anamneses analisadas: ${anamnesesAnalisadas}`);
    console.log(`   → Respostas encontradas: ${respostasEncontradas}`);
    console.log(`   → Taxa de sucesso: ${anamnesesAnalisadas > 0 ? ((respostasEncontradas / anamnesesAnalisadas) * 100).toFixed(1) : 0}%`);
    console.groupEnd();

    return respostas;
    } catch (error) {
      console.error('❌ Erro ao extrair respostas:', error);
      console.groupEnd();
      return [];
    }
  };

  // 🔄 PROCESSAR DADOS BASEADO NO TIPO
  const processarDados = () => {
    try {
    const respostas = extrairRespostas();

    // Se não tem respostas, retornar vazio
    if (respostas.length === 0) {
      return null;
    }

    // Processar baseado no tipo de pergunta
    switch (config.tipoPergunta) {
      case 'texto':
        // Garantir que todas as respostas são strings
        const respostasTexto = respostas.filter(r => typeof r === 'string' && r.trim() !== '');
        return processarRespostasTexto(respostasTexto);

      case 'paragrafo':
        // Parágrafo usa a mesma lógica de texto (Top 5)
        const respostasParagrafo = respostas.filter(r => typeof r === 'string' && r.trim() !== '');
        return processarRespostasTexto(respostasParagrafo);

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

      case 'caixasSelecao':
        return processarRespostasCaixasSelecao(respostas);

      case 'escalaLinear':
        return processarRespostasEscalaLinear(respostas);

      case 'classificacao':
        return processarRespostasClassificacao(respostas);

      case 'data':
        // Datas são strings ISO (YYYY-MM-DD)
        const respostasData = respostas.filter(r => typeof r === 'string' && r.trim() !== '');
        return processarRespostasData(respostasData);

      case 'hora':
        const respostasHora = respostas.filter(r => typeof r === 'string' && r.trim() !== '');
        return processarRespostasHora(respostasHora);

      case 'arquivo':
        // Arquivos são strings (URLs ou base64)
        const respostasArquivo = respostas.filter(r => typeof r === 'string' && r.trim() !== '');
        return processarRespostasArquivo(respostasArquivo);

      default:
        return null;
    }
    } catch (error) {
      console.error('❌ Erro ao processar dados:', error, config);
      return null;
    }
  };

  const dados = processarDados();

  // Log para debug
  console.log('🎯 GRÁFICO:', config.titulo);
  console.log('  - Tipo:', config.tipoPergunta);
  console.log('  - ID:', config.perguntaId);
  console.log('  - Dados processados:', dados);

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

        {/* GRÁFICO DE BARRAS GENÉRICO (Caixas Seleção, Escala Linear, Classificação, Hora) */}
        {config.tipoGrafico === 'barras' && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="nome"
                stroke="#666"
                angle={-45}
                textAnchor="end"
                height={100}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#666"
                allowDecimals={false}
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
                formatter={(value: any) => [`${value} resposta(s)`, 'Total']}
              />
              <Bar
                dataKey="valor"
                fill={coresTema.primary}
                radius={[8, 8, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* GRÁFICO DE BARRAS TOP 5 (Texto e Parágrafo) */}
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

        {/* GRÁFICO DE ÁREA (Data - Linha do tempo) */}
        {config.tipoGrafico === 'linha' && (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={dados} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={coresTema.primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={coresTema.primary} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="nome"
                stroke="#666"
                angle={-45}
                textAnchor="end"
                height={100}
                style={{ fontSize: '12px', fontWeight: 500 }}
              />
              <YAxis
                stroke="#666"
                style={{ fontSize: '12px' }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: `2px solid ${coresTema.primary}`,
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#333' }}
                formatter={(value: any) => [`${value} resposta(s)`, 'Total']}
              />
              <Area
                type="monotone"
                dataKey="valor"
                stroke={coresTema.primary}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValor)"
                dot={{ fill: coresTema.primary, r: 6, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 3, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* GALERIA DE ARQUIVOS (Arquivo) */}
        {config.tipoGrafico === 'galeria' && (
          <div>
            {/* Contador de arquivos */}
            <div className="mb-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
              <p className="text-sm font-medium text-gray-700">
                📊 Total de arquivos: <span className="text-pink-600 font-bold">{(dados as DadosGaleria[]).length}</span>
              </p>
            </div>

            {/* Grid de imagens */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(dados as DadosGaleria[]).map((item, index) => (
                <div key={index} className="group relative">
                  {item.tipo === 'imagem' ? (
                    // Imagem
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-pink-400 transition-all duration-300 shadow-sm hover:shadow-md">
                      <img
                        src={item.url}
                        alt={`Arquivo ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Overlay ao hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-pink-500 px-3 py-1 rounded-full transition-opacity duration-300">
                          Ver imagem
                        </span>
                      </div>
                    </div>
                  ) : (
                    // Arquivo não-imagem
                    <div className="aspect-square rounded-lg border-2 border-gray-200 hover:border-pink-400 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                      <div className="text-4xl mb-2">📄</div>
                      <p className="text-xs text-gray-600 text-center font-medium">Arquivo #{index + 1}</p>
                      <a
                        href={item.url}
                        download
                        className="mt-2 text-xs text-pink-600 hover:text-pink-700 underline"
                      >
                        Baixar
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
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
