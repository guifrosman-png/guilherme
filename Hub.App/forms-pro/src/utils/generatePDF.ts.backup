import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generateAnamnesePDF(anamnese: any) {
  const doc = new jsPDF();

  // Configurações
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPos = margin;

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
  doc.text(`Cliente: ${anamnese.clienteNome}`, margin, yPos);
  yPos += 7;
  doc.text(`Data: ${anamnese.data}`, margin, yPos);
  yPos += 7;
  doc.text(`Preenchido por: ${anamnese.preenchidoPor === 'profissional' ? 'Profissional' : 'Cliente'}`, margin, yPos);
  yPos += 7;
  doc.text(`Versão: v${anamnese.versao}`, margin, yPos);
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
  addField('Nome Completo', anamnese.clienteNome);
  addField('Data de Nascimento', '15/05/1997 (28 anos)');
  addField('CPF', '123.456.789-00');
  addField('RG', '12.345.678-9');
  addField('Telefone', '(11) 98765-4321');
  addField('E-mail', 'maria@email.com');
  addField('Endereço', 'Rua das Flores, 123 - São Paulo/SP');
  yPos += 5;

  // Seção 2: Origem
  addSection('ORIGEM DO CLIENTE', '📍');
  addField('Como me conheceu', 'Instagram');
  yPos += 5;

  // Seção 3: Saúde Geral
  addSection('SAÚDE GERAL', '❤️');
  addField('Doenças/Condições', 'Nenhuma');
  addField('Medicamentos', 'Nenhum');
  yPos += 5;

  // Seção 4: Alergias
  addSection('ALERGIAS', '⚠️');
  addField('Possui alergias', 'Não');
  yPos += 5;

  // Seção 5: Condições de Pele
  addSection('CONDIÇÕES DE PELE', '✨');
  addField('Condições específicas', 'Pele normal, sem problemas');
  yPos += 5;

  // Seção 6: Histórico de Tatuagens
  addSection('HISTÓRICO DE TATUAGENS', '🎨');
  addField('Já fez tatuagem antes', 'Sim');
  addField('Histórico', '2 tatuagens anteriores no braço. Sem problemas de cicatrização.');
  yPos += 5;

  // Seção 7: Nova Tatuagem
  addSection('NOVA TATUAGEM', '🖼️');
  addField('Local', 'Braço direito');
  addField('Tamanho', 'Média (5-15cm)');
  addField('Estilo', 'Realista');
  yPos += 5;

  // Seção 8: Termo
  addSection('TERMO DE COMPROMISSO', '✅');
  addField('Termo aceito', 'Sim, aceito');
  addField('Assinatura Digital', anamnese.clienteNome);
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
  doc.save(`Anamnese_${anamnese.clienteNome.replace(/\s/g, '_')}_${anamnese.data.replace(/\//g, '-')}.pdf`);
}
