 const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuração das APIs
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCp_zyRljSLHmnjJscZQlvQi5DvK5e5Kf8';
const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID;

// Inicializar Gemini com modelo correto (Gemini 2.5 Pro - o mais poderoso)
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-pro', // Versão estável do Gemini 2.5 Pro
    generationConfig: {
        temperature: 0.3, // Baixo para respostas mais precisas
        maxOutputTokens: 2048,
        topP: 0.95,
        topK: 40
    }
});

console.log(' Gemini inicializado com modelo: gemini-2.5-pro (Versão estável - Junho 2025)');

// Configurar Google Drive e Sheets
const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/spreadsheets.readonly'
    ]
});

const drive = google.drive({ version: 'v3', auth });
const sheets = google.sheets({ version: 'v4', auth });

// Cache melhorado
let sheetsCache = {};
let lastCacheUpdate = null;
const CACHE_DURATION = 5 * 60 * 1000;

// Mapeamento de meses
const MONTH_MAPPING = {
    'janeiro': 1, 'jan': 1,
    'fevereiro': 2, 'fev': 2,
    'março': 3, 'mar': 3,
    'abril': 4, 'abr': 4,
    'maio': 5, 'mai': 5,
    'junho': 6, 'jun': 6,
    'julho': 7, 'jul': 7,
    'agosto': 8, 'ago': 8,
    'setembro': 9, 'set': 9,
    'outubro': 10, 'out': 10,
    'novembro': 11, 'nov': 11,
    'dezembro': 12, 'dez': 12
};

// Função para identificar mês do nome da planilha
function extractMonthFromName(name) {
    const nameLower = name.toLowerCase();
    for (const [monthName, monthNum] of Object.entries(MONTH_MAPPING)) {
        if (nameLower.includes(monthName)) {
            return { name: monthName.charAt(0).toUpperCase() + monthName.slice(1), num: monthNum };
        }
    }
    return null;
}

// Função para listar arquivos do Google Drive
async function listDriveFiles() {
    try {
        const response = await drive.files.list({
            q: `'${DRIVE_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`,
            fields: 'files(id, name, webViewLink, modifiedTime)',
            orderBy: 'name asc'
        });
        return response.data.files;
    } catch (error) {
        console.error('Erro ao listar arquivos do Drive:', error.message);
        throw error;
    }
}

// Função melhorada para ler dados de uma planilha
async function readSheetData(spreadsheetId) {
    try {
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: spreadsheetId
        });

        if (!spreadsheet.data.sheets || spreadsheet.data.sheets.length === 0) {
            console.warn(`Planilha ${spreadsheetId} não tem abas.`);
            return { name: spreadsheet.data.properties.title, data: [] };
        }
        
        const sheetName = spreadsheet.data.sheets[0].properties.title;
        
        // Ler TODOS os dados (ajuste o range para pegar mais dados)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: `${sheetName}!A1:Z10000` // Aumentado para 10k linhas
        });

        return {
            name: spreadsheet.data.properties.title,
            sheetName: sheetName,
            data: response.data.values || []
        };
    } catch (error) {
        console.error(`Erro ao ler planilha ${spreadsheetId}:`, error.message);
        return { name: "Erro na leitura", data: [] };
    }
}

// Função para calcular estatísticas da planilha
function calculateSheetStats(data) {
    if (!data || data.length < 2) return null;
    
    const headers = data[0];
    const rows = data.slice(1);
    
    // Tentar identificar colunas numéricas
    const numericColumns = {};
    headers.forEach((header, index) => {
        const values = rows
            .map(row => row[index])
            .filter(val => val && !isNaN(parseFloat(val.toString().replace(',', '.'))))
            .map(val => parseFloat(val.toString().replace(',', '.')));
        
        if (values.length > 0) {
            const sum = values.reduce((a, b) => a + b, 0);
            numericColumns[header] = {
                sum: sum,
                avg: sum / values.length,
                min: Math.min(...values),
                max: Math.max(...values),
                count: values.length
            };
        }
    });
    
    return {
        totalRows: rows.length,
        columns: headers,
        numericStats: numericColumns
    };
}

// Função para encontrar planilhas relevantes baseado na pergunta
function findRelevantSheets(userMessage) {
    const messageLower = userMessage.toLowerCase();
    const relevantSheets = [];
    
    // Detectar meses mencionados na pergunta
    const mentionedMonths = [];
    Object.entries(MONTH_MAPPING).forEach(([monthName, monthNum]) => {
        if (messageLower.includes(monthName)) {
            mentionedMonths.push(monthNum);
        }
    });
    
    // Se mencionou meses específicos, retorna só eles
    if (mentionedMonths.length > 0) {
        Object.values(sheetsCache).forEach(sheet => {
            if (sheet.month && mentionedMonths.includes(sheet.month.num)) {
                relevantSheets.push(sheet);
            }
        });
    } else {
        // Se não mencionou mês específico, retorna todas
        relevantSheets.push(...Object.values(sheetsCache));
    }
    
    return relevantSheets.sort((a, b) => (a.month?.num || 99) - (b.month?.num || 99));
}

// Função melhorada para formatar contexto - MAIS DADOS
function formatSheetsContext(userMessage = '') {
    if (Object.keys(sheetsCache).length === 0) {
        return 'ATENÇÃO: Nenhuma planilha carregada no sistema.';
    }

    const relevantSheets = findRelevantSheets(userMessage);
    
    let context = '=== BASE DE DADOS DISPONÍVEL ===\n\n';
    
    relevantSheets.forEach((sheet) => {
        const monthInfo = sheet.month ? `${sheet.month.name.toUpperCase()}` : 'MÊS NÃO IDENTIFICADO';
        
        context += `\n[${monthInfo}]\n`;
        
        if (sheet.data.data && sheet.data.data.length > 1) {
            const headers = sheet.data.data[0];
            const dataRows = sheet.data.data.slice(1);
            
            context += `Colunas disponíveis: ${headers.join(', ')}\n`;
            context += `Total de registros: ${dataRows.length}\n\n`;
            
            // ESTATÍSTICAS DETALHADAS
            if (sheet.stats && sheet.stats.numericStats) {
                context += `VALORES CALCULADOS (use estes números nas respostas):\n`;
                Object.entries(sheet.stats.numericStats).forEach(([col, stats]) => {
                    context += `- ${col}:\n`;
                    context += `  * Soma Total: R$ ${stats.sum.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n`;
                    context += `  * Média: R$ ${stats.avg.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n`;
                    context += `  * Menor: R$ ${stats.min.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n`;
                    context += `  * Maior: R$ ${stats.max.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n`;
                    context += `  * Quantidade de valores: ${stats.count}\n`;
                });
            }
            
            // AMOSTRA EXPANDIDA (10 primeiras linhas)
            context += `\nAMOSTRA DOS DADOS (primeiras 10 linhas):\n`;
            const sampleRows = dataRows.slice(0, Math.min(10, dataRows.length));
            
            sampleRows.forEach((row, idx) => {
                context += `${idx + 1}. `;
                row.forEach((cell, cellIdx) => {
                    if (cellIdx < headers.length) {
                        context += `${headers[cellIdx]}: ${cell || 'N/A'} | `;
                    }
                });
                context += `\n`;
            });
        } else {
            context += `⚠️ Sem dados disponíveis\n`;
        }
        context += '\n' + '='.repeat(100) + '\n';
    });
    
    return context;
}

// Função para atualizar cache
async function updateSheetsCache() {
    try {
        console.log('🔄 Iniciando atualização do cache...');
        const files = await listDriveFiles();
        sheetsCache = {};
        let successCount = 0;

        for (const file of files) {
            console.log(`📥 Lendo: ${file.name}...`);
            const sheetData = await readSheetData(file.id);
            
            if (sheetData.data && sheetData.data.length > 0) {
                const month = extractMonthFromName(file.name);
                const stats = calculateSheetStats(sheetData.data);
                
                sheetsCache[file.id] = {
                    name: file.name,
                    link: file.webViewLink,
                    month: month,
                    data: sheetData,
                    stats: stats
                };
                successCount++;
                console.log(`✅ ${file.name} carregada - ${stats?.totalRows || 0} linhas`);
            }
        }

        lastCacheUpdate = Date.now();
        console.log(`\n🎉 Cache atualizado! ${successCount}/${files.length} planilhas carregadas\n`);
        return true;
    } catch (error) {
        console.error('❌ Erro ao atualizar cache:', error.message);
        return false;
    }
}

// Rota principal do chat - MELHORADA COM LOGS
app.post('/api/chat', async (req, res) => {
    try {
        console.log('\n' + '='.repeat(100));
        console.log('📨 NOVA REQUISIÇÃO RECEBIDA');
        console.log('='.repeat(100));
        
        const { message } = req.body;
        console.log('💬 Mensagem do usuário:', message);

        if (!message) {
            console.log('❌ Mensagem vazia recebida');
            return res.status(400).json({ error: 'Mensagem não fornecida' });
        }

        // Atualizar cache se necessário
        console.log('🔄 Verificando cache...');
        if (!lastCacheUpdate || (Date.now() - lastCacheUpdate) > CACHE_DURATION) {
            console.log('⏰ Cache expirado, atualizando...');
            const updated = await updateSheetsCache();
            if (!updated) {
                console.log('❌ Falha ao atualizar cache');
                return res.status(500).json({
                    error: 'Erro ao carregar planilhas. Verifique as credenciais do Google Drive.'
                });
            }
        } else {
            console.log('✅ Cache válido');
        }

        // Verificar se há planilhas carregadas
        console.log('📊 Planilhas no cache:', Object.keys(sheetsCache).length);
        if (Object.keys(sheetsCache).length === 0) {
            console.log('⚠️ Nenhuma planilha carregada');
            return res.json({
                response: '⚠️ Desculpe, não há planilhas carregadas no momento. Por favor, verifique se as planilhas estão acessíveis no Google Drive e se as credenciais estão corretas.',
                sheetsLoaded: 0
            });
        }

        // Criar contexto otimizado
        console.log('📝 Gerando contexto das planilhas...');
        const sheetsContext = formatSheetsContext(message);
        console.log('✅ Contexto gerado:', sheetsContext.substring(0, 200) + '...');
        
        // Prompt REFORMULADO para linguagem natural
        const prompt = `Você é Alpha, um assistente de análise de dados conversacional e inteligente.

IMPORTANTE: Você deve responder como um analista humano responderia em uma conversa natural.

NUNCA diga frases como:
❌ "Estou aqui para ajudar"
❌ "Posso te ajudar com isso"
❌ "Vou analisar os dados"
❌ "Com base nos dados fornecidos"

SEMPRE responda diretamente:
✅ "Em março as vendas totalizaram R$ 150.000,00"
✅ "Janeiro teve 1.234 vendas, enquanto dezembro teve 1.890 - um crescimento de 53%"
✅ "O mês com maior faturamento foi julho, com R$ 280.500,00"

BASE DE DADOS:
${sheetsContext}

PERGUNTA: ${message}

INSTRUÇÕES:
1. Leia os dados acima COM ATENÇÃO
2. Identifique os números EXATOS relacionados à pergunta
3. Responda de forma DIRETA, como se estivesse conversando
4. Use os valores REAIS que estão nos dados
5. Se comparar meses, cite os números de cada um
6. Seja específico, não genérico

RESPONDA AGORA de forma natural e conversacional:`;

        console.log('🤖 Enviando para Gemini...');
        console.log('📏 Tamanho do prompt:', prompt.length, 'caracteres');
        
        // Validar API Key
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'SUA_API_KEY_AQUI') {
            console.error('❌ API Key do Gemini não configurada!');
            return res.status(500).json({
                error: 'API Key do Gemini não configurada',
                details: 'Configure GEMINI_API_KEY no arquivo .env'
            });
        }
        
        // Gerar resposta com Gemini - COM TRATAMENTO DE ERRO
        let botResponse;
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            botResponse = response.text();
            
            console.log('✅ Resposta recebida do Gemini');
            console.log('💬 Resposta:', botResponse.substring(0, 300) + '...');
        } catch (geminiError) {
            console.error('❌ ERRO NO GEMINI:', geminiError.message);
            
            // Se o modelo falhar, usar resposta de fallback
            if (geminiError.message.includes('API_KEY')) {
                botResponse = '⚠️ Erro de autenticação com a API do Gemini. Verifique se a API Key está correta e ativa.';
            } else if (geminiError.message.includes('quota') || geminiError.message.includes('limit')) {
                botResponse = '⚠️ Limite de requisições atingido. Por favor, tente novamente em alguns minutos.';
            } else if (geminiError.message.includes('model')) {
                botResponse = '⚠️ O modelo solicitado não está disponível. Tentando modelo alternativo...';
                
                // Tentar modelo alternativo
                try {
                    console.log('🔄 Tentando com gemini-2.5-flash...');
                    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
                    const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
                    const fallbackResult = await fallbackModel.generateContent(prompt);
                    botResponse = (await fallbackResult.response).text();
                    console.log('✅ Resposta obtida com modelo alternativo');
                } catch (fallbackError) {
                    console.error('❌ Falha no modelo alternativo:', fallbackError.message);
                    botResponse = '⚠️ Não foi possível gerar resposta no momento. Por favor, tente novamente.';
                }
            } else {
                botResponse = `⚠️ Erro ao processar sua pergunta: ${geminiError.message}`;
            }
        }
        
        console.log('='.repeat(100) + '\n');

        res.json({ 
            response: botResponse,
            sheetsLoaded: Object.keys(sheetsCache).length,
            lastUpdate: new Date(lastCacheUpdate).toISOString()
        });

    } catch (error) {
        console.error('\n' + '❌'.repeat(50));
        console.error('ERRO CRÍTICO NO CHAT:');
        console.error('Tipo:', error.name);
        console.error('Mensagem:', error.message);
        console.error('Stack:', error.stack);
        console.error('❌'.repeat(50) + '\n');
        
        res.status(500).json({ 
            error: 'Erro ao processar mensagem',
            details: error.message,
            type: error.name
        });
    }
});

// Rota para listar planilhas disponíveis
app.get('/api/sheets', async (req, res) => {
    try {
        if (!lastCacheUpdate || (Date.now() - lastCacheUpdate) > CACHE_DURATION) {
            await updateSheetsCache();
        }

        const sheetsList = Object.values(sheetsCache).map(sheet => ({
            name: sheet.name,
            month: sheet.month?.name || 'N/A',
            link: sheet.link,
            rowCount: sheet.data.data ? sheet.data.data.length - 1 : 0,
            columns: sheet.data.data && sheet.data.data.length > 0 ? sheet.data.data[0] : []
        }));

        res.json({ 
            sheets: sheetsList,
            total: sheetsList.length 
        });
    } catch (error) {
        console.error('Erro ao listar planilhas:', error);
        res.status(500).json({ error: 'Erro ao listar planilhas' });
    }
});

// Rota para forçar atualização do cache
app.post('/api/refresh', async (req, res) => {
    try {
        const success = await updateSheetsCache();
        res.json({ 
            success,
            message: success ? 'Cache atualizado com sucesso!' : 'Erro ao atualizar cache',
            sheetsLoaded: Object.keys(sheetsCache).length
        });
    } catch (error) {
        console.error('Erro ao atualizar cache:', error);
        res.status(500).json({ error: 'Erro ao atualizar cache' });
    }
});

// Rota para LISTAR modelos disponíveis
app.get('/api/list-models', async (req, res) => {
    try {
        console.log('📋 Listando modelos disponíveis...');
        
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        
        // Fazer requisição manual para listar modelos
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }
        
        const data = await response.json();
        
        // Filtrar apenas modelos que suportam generateContent
        const availableModels = data.models
            .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
            .map(model => ({
                name: model.name,
                displayName: model.displayName,
                description: model.description,
                methods: model.supportedGenerationMethods
            }));
        
        console.log('✅ Modelos disponíveis:', availableModels.length);
        
        res.json({
            success: true,
            count: availableModels.length,
            models: availableModels,
            recommendation: availableModels[0]?.name || 'Nenhum modelo disponível'
        });
        
    } catch (error) {
        console.error('❌ Erro ao listar modelos:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Rota para testar API do Gemini
app.get('/api/test-gemini', async (req, res) => {
    try {
        console.log('🧪 Testando API do Gemini...');
        console.log('🔑 API Key:', GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 10) + '...' : 'NÃO CONFIGURADA');
        
        const testPrompt = 'Responda apenas "OK" se você conseguir me ouvir.';
        
        const result = await model.generateContent(testPrompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ Gemini respondeu:', text);
        
        res.json({
            success: true,
            message: 'API do Gemini está funcionando!',
            response: text,
            model: 'gemini-2.5-pro'
        });
    } catch (error) {
        console.error('❌ Erro ao testar Gemini:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            suggestion: 'Tente usar um dos seguintes modelos: gemini-1.5-pro-latest, gemini-1.5-flash-latest',
            details: 'Verifique se a API Key está correta e ativa em https://aistudio.google.com/app/apikey'
        });
    }
});

// Rota de health check melhorada
app.get('/api/health', (req, res) => {
    const sheetsInfo = Object.values(sheetsCache).map(s => ({
        name: s.name,
        month: s.month?.name || 'N/A',
        rows: s.stats?.totalRows || 0
    }));

    res.json({ 
        status: 'online',
        cacheUpdated: lastCacheUpdate ? new Date(lastCacheUpdate).toISOString() : 'never',
        sheetsLoaded: Object.keys(sheetsCache).length,
        sheets: sheetsInfo
    });
});

// Iniciar servidor
app.listen(PORT, async () => {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 SERVIDOR ALPHA BOT INICIADO');
    console.log('='.repeat(80));
    console.log(`📍 Porta: ${PORT}`);
    console.log(`📊 Carregando planilhas iniciais...`);
    console.log('='.repeat(80) + '\n');
    
    await updateSheetsCache();
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ BOT PRONTO PARA USO!');
    console.log('='.repeat(80) + '\n');
});