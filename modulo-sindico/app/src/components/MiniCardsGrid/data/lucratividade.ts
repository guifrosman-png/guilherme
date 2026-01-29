
export interface ProfitabilityItem {
    produto: string;
    qtd: number;
    cmv: number;
    vlVenda: number;
    lucro: number;
    margem: number;
    oferta: boolean;
    categoria?: string; // Calculated
    faixaMargem?: string; // Calculated
}

export const PROFITABILITY_RAW_DATA: ProfitabilityItem[] = [
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

export function getEnrichedData() {
    return PROFITABILITY_RAW_DATA.map(item => {
        // Categorização
        let categoria = 'Outros';
        const p = item.produto;

        if (p.includes('AGUA') || p.includes('REF.') || p.includes('CERVEJA') || p.includes('GUARANA') || p.includes('ENERG') || p.includes('SUCO') || p.includes('GATORADE') || p.includes('RED BULL') || p.includes('COCA') || p.includes('SPRITE')) categoria = 'Bebidas';
        else if (p.includes('CHOC') || p.includes('BOMBOM') || p.includes('KIT KAT') || p.includes('TALENTO') || p.includes('SNICKERS') || p.includes('TRENTO')) categoria = 'Chocolates';
        else if (p.includes('BISC') || p.includes('WAFER') || p.includes('OREO')) categoria = 'Biscoitos';
        else if (p.includes('PAO') || p.includes('BOLO') || p.includes('BROA')) categoria = 'Padaria';
        else if (p.includes('CHEETOS') || p.includes('DORITOS') || p.includes('FANDANGOS') || p.includes('TORCIDA') || p.includes('BATATA')) categoria = 'Salgadinhos';
        else if (p.includes('SORVETE') || p.includes('MAGNUM') || p.includes('KIBON') || p.includes('TABLITO')) categoria = 'Sorvetes';
        else if (p.includes('BOLD') || p.includes('WHEYFER')) categoria = 'Proteínas/Fitness';

        // Faixa de Margem
        let faixaMargem = '80-100%';
        if (item.margem < 20) faixaMargem = '0-20%';
        else if (item.margem < 40) faixaMargem = '20-40%';
        else if (item.margem < 60) faixaMargem = '40-60%';
        else if (item.margem < 80) faixaMargem = '60-80%';

        return {
            ...item,
            categoria,
            faixaMargem
        };
    });
}
