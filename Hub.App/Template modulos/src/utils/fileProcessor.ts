// Utilitários para processamento de arquivos financeiros

export interface TransactionRow {
  tipo: string;
  descricao: string;
  valor: string;
  data: string;
  dataLancamento: string;
  categoria: string;
  status: string;
  recorrente: string;
}

export interface ProcessedTransaction {
  id: string;
  type: 'receita' | 'despesa';
  description: string;
  amount: number;
  date: string;
  launchDate: string;
  category: string;
  isRecurring?: boolean;
  status: 'a_pagar' | 'agendado' | 'atrasado' | 'pago' | 'cancelado';
}

// Processar CSV
export const parseCSV = (content: string): ProcessedTransaction[] => {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('Arquivo CSV deve conter pelo menos uma linha de cabeçalho e uma linha de dados');
  }

  const transactions: ProcessedTransaction[] = [];
  
  // Detectar o formato do CSV pelo cabeçalho
  const headerLine = lines[0].trim();
  const headers = parseCSVLine(headerLine).map(h => 
    h.toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
  );
  const format = detectCSVFormat(headers);
  
  console.log(`Formato detectado: ${format} | Headers: [${headers.join(', ')}]`);
  
  // Determinar onde começam os dados reais
  let startLine = 1;
  
  // Para extratos, às vezes o cabeçalho é apenas um título e os dados começam na linha 1 ou 2
  if (format === 'extrato' && headers.length === 1) {
    // Procurar a primeira linha que parece ter dados estruturados
    for (let i = 1; i < Math.min(5, lines.length); i++) {
      const testValues = parseCSVLine(lines[i].trim());
      if (testValues.length >= 2) {
        // Verificar se a primeira coluna parece ser uma data
        const firstValue = testValues[0];
        if (firstValue.match(/\d{2}\/\d{2}\/\d{4}/) || firstValue.match(/\d{4}-\d{2}-\d{2}/)) {
          startLine = i;
          break;
        }
      }
    }
    console.log(`Extrato: dados começam na linha ${startLine + 1}`);
  }

  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV respeitando aspas
    const values = parseCSVLine(line);
    
    // Para extratos, ser mais flexível com o número mínimo de colunas
    const minColumns = format === 'extrato' ? 2 : 3;
    
    if (values.length >= minColumns) {
      try {
        const transaction = createTransactionFromValues(values, i, format, headers);
        if (transaction) {
          transactions.push(transaction);
        }
      } catch (error) {
        console.warn(`Erro ao processar linha ${i + 1}:`, error);
      }
    } else {
      console.warn(`Linha ${i + 1} ignorada - colunas insuficientes (${values.length}):`, values);
    }
  }
  
  return transactions;
};

// Parse de linha CSV respeitando aspas e diferentes separadores
const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  // Detectar separador (vírgula ou ponto e vírgula)
  const separator = line.includes(';') && !line.includes('",') ? ';' : ',';
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === separator && !inQuotes) {
      values.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim().replace(/^"|"$/g, ''));
  // Manter todas as posições mas limpar strings vazias para valores
  return values.map(v => v.trim());
};

// Detectar formato do CSV
const detectCSVFormat = (headers: string[]): 'planilha' | 'openfinance' | 'extrato' => {
  const headerStr = headers.join(' ').toLowerCase();
  
  // Verificar Extrato Bancário - primeira prioridade para evitar confusão
  if (headerStr.includes('extrato') || headerStr.includes('conta corrente') || 
      headerStr.includes('conta-corrente') || headerStr.includes('banco') ||
      headerStr.includes('histórico') || headerStr.includes('historico') || 
      headerStr.includes('saldo') || headerStr.includes('docto') ||
      headerStr.includes('movimentacao') || headerStr.includes('movimentação')) {
    return 'extrato';
  }
  
  // Verificar Open Finance - procurar por estrutura específica
  if (headerStr.includes('credito') || headerStr.includes('debito') || 
      (headerStr.includes('data') && headerStr.includes('tipo') && headerStr.includes('conta'))) {
    return 'openfinance';
  } 
  
  // Verificar Planilha - procurar pela estrutura esperada (com e sem acentos)
  if (headerStr.includes('tipo') && (headerStr.includes('descrição') || headerStr.includes('descricao')) && headerStr.includes('valor')) {
    return 'planilha';
  }
  
  // Se tiver apenas uma coluna de header, provavelmente é um extrato mal formatado
  if (headers.length === 1) {
    console.warn('Apenas um header detectado, assumindo formato extrato:', headers);
    return 'extrato';
  }
  
  // Default para planilha se não conseguir detectar
  console.warn('Formato não detectado automaticamente, usando formato planilha. Headers:', headers);
  return 'planilha';
};

// Criar transação a partir dos valores baseado no formato
const createTransactionFromValues = (
  values: string[], 
  index: number, 
  format: 'planilha' | 'openfinance' | 'extrato',
  headers: string[]
): ProcessedTransaction | null => {
  // Inicializar todas as variáveis com valores padrão
  let tipo = '', descricao = '', valor = '', data = '', dataLancamento = '', categoria = '', status = 'pago', recorrente = 'não';
  
  // Verificar se temos valores suficientes
  if (values.length < 3) {
    console.warn(`Linha ${index + 1}: Valores insuficientes (${values.length} colunas)`, values);
    return null;
  }
  
  switch (format) {
    case 'planilha':
      // Formato: ['Tipo', 'Descrição', 'Valor', 'Data', 'Data de Lançamento', 'Categoria', 'Status', 'Recorrente']
      tipo = values[0] || '';
      descricao = values[1] || '';
      valor = values[2] || '';
      data = values[3] || '';
      dataLancamento = values[4] || values[3] || '';
      categoria = values[5] || 'Geral';
      status = values[6] || 'pago';
      recorrente = values[7] || 'não';
      break;
      
    case 'openfinance':
      // Formato: ['Data', 'Tipo', 'Valor', 'Descrição', 'Conta', 'Categoria', 'Status']
      data = values[0] || '';
      tipo = values[1] || '';
      valor = values[2] || '';
      descricao = values[3] || '';
      categoria = values[5] || 'Geral';
      status = values[6] || 'pago';
      dataLancamento = data;
      recorrente = 'não';
      
      // Converter tipo Open Finance para nosso formato
      if (tipo.toLowerCase().includes('credito')) {
        tipo = 'receita';
      } else if (tipo.toLowerCase().includes('debito')) {
        tipo = 'despesa';
      }
      break;
      
    case 'extrato':
      // Formato flexível para extratos bancários
      // Tentar diferentes estruturas comuns de extrato
      if (values.length >= 4) {
        // Formato padrão: ['Data', 'Histórico', 'Docto', 'Valor', 'Saldo']
        data = values[0] || '';
        descricao = values[1] || '';
        valor = values[3] || values[2] || ''; // Valor pode estar na posição 3 ou 2
      } else if (values.length >= 3) {
        // Formato simplificado: ['Data', 'Descrição', 'Valor']
        data = values[0] || '';
        descricao = values[1] || '';
        valor = values[2] || '';
      } else if (values.length >= 2) {
        // Formato mínimo: ['Data', 'Valor'] ou ['Descrição', 'Valor']
        // Tentar identificar qual é a data
        const firstValue = values[0] || '';
        const secondValue = values[1] || '';
        
        if (firstValue.match(/\d{2}\/\d{2}\/\d{4}/) || firstValue.match(/\d{4}-\d{2}-\d{2}/)) {
          data = firstValue;
          valor = secondValue;
          descricao = 'Transação bancária';
        } else {
          data = new Date().toLocaleDateString('pt-BR');
          descricao = firstValue;
          valor = secondValue;
        }
      } else {
        // Dados insuficientes
        console.warn(`Linha ${index + 1}: Formato de extrato não reconhecido`, values);
        return null;
      }
      
      dataLancamento = data;
      categoria = 'Extrato Bancário';
      status = 'pago';
      recorrente = 'não';
      
      // Limpar e processar valor
      const valorLimpo = valor.replace(/[^\d.,-]/g, '').replace(',', '.');
      const valorNumerico = parseFloat(valorLimpo);
      
      if (isNaN(valorNumerico)) {
        console.warn(`Linha ${index + 1}: Valor inválido: "${valor}"`);
        return null;
      }
      
      // Determinar tipo pelo sinal do valor
      tipo = valorNumerico >= 0 ? 'receita' : 'despesa';
      valor = Math.abs(valorNumerico).toString();
      break;
  }
  
  // Validar se temos dados básicos
  if (!tipo || !valor || !data) {
    console.warn(`Linha ${index + 1}: Dados incompletos - tipo: "${tipo}", valor: "${valor}", data: "${data}"`);
    return null;
  }
  
  // Verificar se não é uma linha de cabeçalho disfarçada
  if (data.toLowerCase().includes('data') && descricao.toLowerCase().includes('descri')) {
    console.warn(`Linha ${index + 1}: Parece ser um cabeçalho, ignorando`);
    return null;
  }

  // Validar tipo
  const normalizedType = tipo.toLowerCase().trim();
  if (!normalizedType.includes('receita') && !normalizedType.includes('despesa')) {
    console.error(`Erro na linha ${index + 1}: tipo="${tipo}", normalizedType="${normalizedType}", format="${format}"`);
    throw new Error(`Tipo deve ser "receita" ou "despesa". Recebido: "${tipo}" (formato: ${format})`);
  }
  
  // Validar valor
  const cleanValue = valor.replace(/[^\d.,-]/g, '').replace(',', '.');
  const parsedAmount = Math.abs(parseFloat(cleanValue));
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new Error('Valor deve ser um número positivo');
  }
  
  // Validar e formatar datas
  const formattedDate = formatDate(data);
  const formattedLaunchDate = formatDate(dataLancamento || data);
  
  if (!formattedDate || !formattedLaunchDate) {
    throw new Error('Data inválida');
  }
  
  // Validar status
  const validStatuses = ['a_pagar', 'agendado', 'atrasado', 'pago', 'cancelado'];
  let normalizedStatus = status.toLowerCase().trim().replace(/\s+/g, '_');
  
  // Mapear status do Open Finance
  if (normalizedStatus.includes('efetivado')) {
    normalizedStatus = 'pago';
  }
  
  const finalStatus = validStatuses.includes(normalizedStatus) ? normalizedStatus : 'pago';
  
  return {
    id: `import-${Date.now()}-${index}`,
    type: normalizedType.includes('receita') ? 'receita' : 'despesa',
    description: descricao?.trim() || `Transação ${index}`,
    amount: parsedAmount,
    date: formattedDate,
    launchDate: formattedLaunchDate,
    category: categoria?.trim() || 'Geral',
    status: finalStatus as any,
    isRecurring: recorrente?.toLowerCase().includes('sim') || false
  };
};

// Formatar data para o formato ISO
const formatDate = (dateStr: string): string | null => {
  if (!dateStr || !dateStr.trim()) return null;
  
  const cleaned = dateStr.trim();
  
  // Tentar diferentes formatos de data
  const formats = [
    /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD (ISO)
    /^(\d{2})\/(\d{2})\/(\d{4})$/, // DD/MM/YYYY (BR)
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // D/M/YYYY (BR flexível)
    /^(\d{2})-(\d{2})-(\d{4})$/, // DD-MM-YYYY (BR)
    /^(\d{4})\/(\d{2})\/(\d{2})$/, // YYYY/MM/DD (US)
  ];
  
  for (const format of formats) {
    const match = cleaned.match(format);
    if (match) {
      let [, part1, part2, part3] = match;
      
      // Pad com zeros à esquerda se necessário
      part1 = part1.padStart(2, '0');
      part2 = part2.padStart(2, '0');
      
      // Determinar formato baseado no padrão
      if (format.source.includes('4})-')) { // YYYY-MM-DD
        return `${part1}-${part2}-${part3}`;
      } else if (format.source.includes('2})\/') || format.source.includes('1,2})\/')) { // DD/MM/YYYY
        // Validar se é realmente DD/MM/YYYY (dia <= 31, mês <= 12)
        const day = parseInt(part1);
        const month = parseInt(part2);
        if (day <= 31 && month <= 12) {
          return `${part3}-${part2}-${part1}`;
        }
      } else if (format.source.includes('4})\/')) { // YYYY/MM/DD
        return `${part1}-${part2}-${part3}`;
      }
    }
  }
  
  // Tentar parse com Date para casos mais complexos
  try {
    // Se contém barra, assumir formato brasileiro DD/MM/YYYY
    if (cleaned.includes('/')) {
      const parts = cleaned.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        
        // Validar ranges
        if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900) {
          const date = new Date(year, month - 1, day);
          if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
            return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          }
        }
      }
    }
    
    // Parse genérico como último recurso
    const date = new Date(cleaned);
    if (!isNaN(date.getTime()) && date.getFullYear() >= 1900) {
      return date.toISOString().split('T')[0];
    }
  } catch (error) {
    // Ignorar erro
  }
  
  console.warn(`Não foi possível processar a data: "${cleaned}"`);
  return null;
};

// Gerar template CSV para download
export const generateCSVTemplate = (): string => {
  const templateData = [
    ['Tipo', 'Descrição', 'Valor', 'Data', 'Data de Lançamento', 'Categoria', 'Status', 'Recorrente'],
    ['receita', 'Vendas do mês', '5000.00', '15/01/2025', '15/01/2025', 'Vendas', 'pago', 'não'],
    ['despesa', 'Aluguel do escritório', '1200.00', '05/01/2025', '05/01/2025', 'Aluguel', 'pago', 'sim'],
    ['receita', 'Prestação de serviços', '3500.00', '20/01/2025', '20/01/2025', 'Serviços', 'pago', 'não'],
    ['despesa', 'Energia elétrica', '450.00', '10/01/2025', '10/01/2025', 'Utilidades', 'pago', 'sim'],
    ['receita', 'Comissões', '800.00', '25/01/2025', '25/01/2025', 'Comissões', 'pago', 'não'],
    ['despesa', 'Material de escritório', '200.00', '12/01/2025', '12/01/2025', 'Material', 'pago', 'não'],
    ['receita', 'Receita recorrente', '2000.00', '01/01/2025', '01/01/2025', 'Assinatura', 'pago', 'sim'],
    ['despesa', 'Taxa do cartão', '150.00', '30/01/2025', '30/01/2025', 'Taxas', 'a_pagar', 'não']
  ];

  return templateData.map(row => 
    row.map(cell => `"${cell}"`).join(',')
  ).join('\n');
};

// Template Open Finance (XLSX)
export const generateOpenFinanceTemplate = (): string => {
  const templateData = [
    ['Data', 'Tipo', 'Valor', 'Descrição', 'Conta', 'Categoria', 'Status'],
    ['01/09/2025', 'CREDITO', '1500,00', 'PIX RECEBIDO - João Silva', 'Conta Corrente', 'Receitas', 'EFETIVADO'],
    ['02/09/2025', 'DEBITO', '800,00', 'TED ENVIADO - Fornecedor XYZ', 'Conta Corrente', 'Despesas', 'EFETIVADO'],
    ['03/09/2025', 'CREDITO', '2200,00', 'Venda de produtos', 'Conta Corrente', 'Vendas', 'EFETIVADO'],
    ['04/09/2025', 'DEBITO', '450,00', 'Pagamento energia elétrica', 'Conta Corrente', 'Utilidades', 'EFETIVADO']
  ];

  return templateData.map(row => 
    row.map(cell => `"${cell}"`).join(',')
  ).join('\n');
};

// Template Extrato Bancário (CSV)
export const generateExtratoTemplate = (): string => {
  const templateData = [
    ['Data', 'Histórico', 'Docto', 'Valor', 'Saldo'],
    ['01/09/2025', 'PIX RECEBIDO - João Silva', '12345', '1500,00', '5200,00'],
    ['02/09/2025', 'TED ENVIADO - Fornecedor XYZ', '12346', '-800,00', '4400,00'],
    ['03/09/2025', 'Venda de produtos', '12347', '2200,00', '6600,00'],
    ['04/09/2025', 'Pagamento energia elétrica', '12348', '-450,00', '6150,00']
  ];

  return templateData.map(row => 
    row.map(cell => `"${cell}"`).join(';')
  ).join('\n');
};

// Validar arquivo antes do processamento (versão PRO)
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Suporte completo a todos os formatos
  const validExtensions = ['.csv', '.xlsx', '.xls', '.pdf'];
  const extension = file.name.toLowerCase().substr(file.name.lastIndexOf('.'));
  
  if (!validExtensions.includes(extension)) {
    return {
      valid: false,
      error: 'Formato de arquivo não suportado. Use CSV, XLSX, XLS ou PDF.'
    };
  }
  
  // Limite generoso para versão PRO (100MB)
  if (file.size > 100 * 1024 * 1024) {
    return {
      valid: false,
      error: 'Arquivo muito grande. Tamanho máximo: 100MB.'
    };
  }
  
  return { valid: true };
};

// Validação avançada de arquivos (versão PRO completa)
export const validateFileAdvanced = (file: File): { valid: boolean; error?: string } => {
  // Suporte completo a todos os formatos
  const validExtensions = ['.csv', '.xlsx', '.xls', '.pdf'];
  const extension = file.name.toLowerCase().substr(file.name.lastIndexOf('.'));
  
  if (!validExtensions.includes(extension)) {
    return {
      valid: false,
      error: 'Formato não suportado. Use CSV, XLSX, XLS ou PDF (Open Finance).'
    };
  }
  
  // Limite generoso de 100MB para versão PRO
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Arquivo muito grande. Máximo: 100MB.`
    };
  }
  
  return { valid: true };
};

// Detectar formato baseado no nome do arquivo
export const detectFileFormatByName = (fileName: string): 'openfinance' | 'extrato' | 'planilha' => {
  const name = fileName.toLowerCase();
  if (name.includes('open') || name.includes('finance') || name.endsWith('.pdf')) {
    return 'openfinance';
  }
  if (name.includes('extrato') || name.includes('bancario') || name.includes('bank')) {
    return 'extrato';
  }
  return 'planilha';
};

// Detectar formato baseado no conteúdo do CSV
export const detectFileFormatByContent = (content: string): 'planilha' | 'openfinance' | 'extrato' => {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return 'planilha';
  
  const headerLine = lines[0].toLowerCase();
  const headers = parseCSVLine(headerLine);
  return detectCSVFormat(headers);
};

// Estatísticas do processamento
export const getProcessingStats = (transactions: ProcessedTransaction[]) => {
  const receitas = transactions.filter(t => t.type === 'receita');
  const despesas = transactions.filter(t => t.type === 'despesa');
  const recorrentes = transactions.filter(t => t.isRecurring);
  
  const totalReceitas = receitas.reduce((sum, t) => sum + t.amount, 0);
  const totalDespesas = despesas.reduce((sum, t) => sum + t.amount, 0);
  
  return {
    total: transactions.length,
    receitas: receitas.length,
    despesas: despesas.length,
    recorrentes: recorrentes.length,
    valorReceitas: totalReceitas,
    valorDespesas: totalDespesas,
    saldo: totalReceitas - totalDespesas,
    categorias: [...new Set(transactions.map(t => t.category))].length
  };
};