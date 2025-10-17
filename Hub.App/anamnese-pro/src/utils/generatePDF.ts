import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generateAnamnesePDF(anamnese: any) {
  const doc = new jsPDF();

  // Configurações
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPos = margin;

  // Extrair dados completos (podem estar em dadosCompletos ou diretamente no objeto)
  const dados = anamnese.dadosCompletos || anamnese;

  // Função auxiliar para calcular idade
  const calcularIdade = (dataNascimento: string) => {
    if (!dataNascimento) return '';

    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return `${idade} anos`;
  };

  // Função auxiliar para formatar data
  const formatarData = (data: string) => {
    if (!data) return '';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  };

  // Função auxiliar para formatar valor
  const formatarValor = (valor: number) => {
    if (!valor && valor !== 0) return 'Não informado';
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Header com gradiente (simulado com retângulo colorido)
  doc.setFillColor(236, 72, 153); // Rosa
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('FICHA DE ANAMNESE', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Anamnese Pro', pageWidth / 2, 30, { align: 'center' });

  yPos = 50;

  // Informações do cabeçalho
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Cliente: ${anamnese.clienteNome || dados.nomeCompleto || 'Não informado'}`, margin, yPos);
  yPos += 7;
  doc.text(`Data: ${anamnese.data || 'Não informado'}`, margin, yPos);
  yPos += 7;
  doc.text(`Preenchido por: ${anamnese.preenchidoPor === 'profissional' ? 'Profissional' : 'Cliente'}`, margin, yPos);
  yPos += 7;
  doc.text(`Versão: v${anamnese.versao || 1}`, margin, yPos);
  yPos += 7;
  doc.text(`Status: ${anamnese.status === 'concluida' ? 'Concluída' : 'Pendente'}`, margin, yPos);

  yPos += 15;

  // Linha divisória
  doc.setDrawColor(236, 72, 153);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Função auxiliar para adicionar seção
  const addSection = (title: string, icon: string) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFillColor(236, 72, 153);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${icon} ${title}`, margin + 5, yPos + 7);

    yPos += 15;
    doc.setTextColor(0, 0, 0);
  };

  const addField = (label: string, value: string) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(label + ':', margin, yPos);

    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(value || 'Não informado', pageWidth - 2 * margin - 10);
    doc.text(lines, margin + 60, yPos);

    yPos += 7 * lines.length;
  };

  // Seção 1: Dados Pessoais
  addSection('DADOS PESSOAIS', '📄');
  addField('Nome Completo', dados.nomeCompleto || 'Não informado');

  // Data de nascimento com idade
  const dataNascFormatada = formatarData(dados.dataNascimento);
  const idade = calcularIdade(dados.dataNascimento);
  const dataNascCompleta = dataNascFormatada
    ? `${dataNascFormatada}${idade ? ` (${idade})` : ''}`
    : 'Não informado';
  addField('Data de Nascimento', dataNascCompleta);

  addField('CPF', dados.cpf || 'Não informado');
  addField('RG', dados.rg || 'Não informado');
  addField('Telefone', dados.telefone || 'Não informado');
  addField('E-mail', dados.email || 'Não informado');
  addField('Endereço', dados.endereco || 'Não informado');
  yPos += 5;

  // Seção 2: Origem
  addSection('ORIGEM DO CLIENTE', '📍');
  const origem = dados.comoConheceu || 'Não informado';
  const origemCompleta = origem === 'Outro' && dados.outraOrigem
    ? `${origem} - ${dados.outraOrigem}`
    : origem;
  addField('Como me conheceu', origemCompleta);
  yPos += 5;

  // Seção 3: Saúde Geral
  addSection('SAÚDE GERAL', '❤️');
  addField('Doenças/Condições', dados.doencas || 'Nenhuma');
  addField('Medicamentos', dados.medicamentos || 'Nenhum');
  yPos += 5;

  // Seção 4: Alergias
  addSection('ALERGIAS', '⚠️');
  const possuiAlergias = dados.temAlergias ? 'Sim' : 'Não';
  addField('Possui alergias', possuiAlergias);
  if (dados.temAlergias && dados.alergias) {
    addField('Quais alergias', dados.alergias);
  }
  yPos += 5;

  // Seção 5: Condições de Pele
  addSection('CONDIÇÕES DE PELE', '✨');
  addField('Condições específicas', dados.condicoesPele || 'Nenhuma condição especial');
  yPos += 5;

  // Seção 6: Histórico de Tatuagens
  addSection('HISTÓRICO DE TATUAGENS', '🎨');
  const possuiTatuagem = dados.temTatuagem ? 'Sim' : 'Não';
  addField('Já fez tatuagem antes', possuiTatuagem);
  if (dados.temTatuagem && dados.historicoTatuagens) {
    addField('Histórico', dados.historicoTatuagens);
  }
  yPos += 5;

  // Seção 7: Nova Tatuagem
  addSection('NOVA TATUAGEM', '🖼️');
  addField('Local', dados.localTatuagem || 'Não informado');
  addField('Tamanho', dados.tamanhoTatuagem || 'Não informado');
  addField('Estilo', dados.estiloTatuagem || 'Não informado');

  // Adicionar valor da tatuagem se existir
  if (dados.valorTatuagem !== undefined && dados.valorTatuagem !== null) {
    addField('Valor', formatarValor(dados.valorTatuagem));
  }
  yPos += 5;

  // Seção 8: Termo
  addSection('TERMO DE COMPROMISSO', '✅');
  const termoAceito = dados.aceitaTermo ? 'Sim, aceito' : 'Não aceito';
  addField('Termo aceito', termoAceito);
  addField('Assinatura Digital', dados.assinatura || anamnese.clienteNome || 'Não assinado');
  yPos += 10;

  // Footer
  if (yPos > 260) {
    doc.addPage();
    yPos = margin;
  }

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 7;

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Gerado por Anamnese Pro - Hub.App', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, yPos, { align: 'center' });

  // Salvar PDF
  const nomeArquivo = `Anamnese_${(dados.nomeCompleto || anamnese.clienteNome || 'Cliente').replace(/\s/g, '_')}_${anamnese.data?.replace(/\//g, '-') || new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
  doc.save(nomeArquivo);
}
