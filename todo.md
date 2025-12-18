# Project TODO - Contexto Assessoria Contábil

## Páginas e Layout
- [x] Página inicial moderna com banner hero
- [x] Seção Sobre Nós com história e missão
- [x] Página de Serviços detalhada
- [x] Página de Contato com formulário e mapa
- [x] Header com navegação responsiva
- [x] Footer com links e informações de contato
- [x] Design responsivo para todos os dispositivos

## Funcionalidades
- [x] Chatbot de IA integrado em todas as páginas
- [x] Sistema de captura de leads
- [x] Formulário de contato funcional
- [x] Integração com WhatsApp
- [x] Notificações automáticas ao proprietário
- [x] Seção de depoimentos/cases de sucesso

## Backend e Banco de Dados
- [x] Schema do banco de dados (leads, appointments, chat_messages, testimonials)
- [x] Rotas tRPC para leads, appointments, chat e testimonials
- [x] Testes unitários para as rotas

## Design
- [x] Criar logo moderna e séria com nano banana
- [x] Paleta de cores corporativas (preto, dourado, branco)

## Melhorias
- [x] Logo com fundo transparente para efeito flutuante
- [x] Chatbot com IA especializada em contabilidade e fiscal de todos os estados
- [x] Chatbot capaz de responder dúvidas técnicas e encaminhar contratações
- [x] Remover fundo da logo e deixar completamente transparente
- [x] Cards de serviços clicáveis com explicações detalhadas

## Sistema de Atendimento
- [x] Sistema de agendamento de consultas via chatbot
- [x] Painel administrativo para gerenciar agendamentos
- [x] Cada funcionário com seu próprio usuário no sistema
- [x] Funcionários podem ver e gerenciar suas próprias consultas
- [x] Redirecionamento automático de atendimento para funcionário do departamento correto
- [x] Notificação para funcionário quando atendimento é direcionado
- [x] Avatar "Contexto" como assistente virtual
- [x] Chatbot faz divisão inteligente por departamento
- [x] Agendamento automático via chatbot com direcionamento para funcionário correto

## Equipe cadastrada
- [x] Gabriel - Departamento Fiscal
- [x] Samarah - Departamento Fiscal
- [x] Laura - Departamento Contábil
- [x] Janderley - Departamento Pessoal
- [x] Emily - Departamento Pessoal
- [x] Júnior - Departamento Pessoal
- [x] José - Departamento Paralegal
- [x] Bruna - Departamento Paralegal

## Painel Administrativo
- [x] Dashboard com visão geral dos agendamentos
- [x] Lista de agendamentos filtráveis por status e departamento
- [x] Gerenciamento de leads
- [x] Visualização por funcionário (cada um vê seus próprios agendamentos)
- [x] Visão completa para administradores
- [x] Link do painel no menu de navegação (visível para usuários autenticados)
- [x] Testes unitários para appointments

## Relatórios e Gráficos
- [x] Gráfico de agendamentos por período (diário, semanal, mensal)
- [x] Gráfico de desempenho por membro da equipe
- [x] Gráfico de leads por status
- [x] Estatísticas de conversão
- [x] Filtros de período para os relatórios
- [x] Tabela de desempenho detalhada
- [x] Arrumar logos com fundo transparente

## Avatares e Chat Direto
- [x] Gerar avatares personalizados com nano banana para cada membro da equipe
- [x] Tornar avatares clicáveis para abrir chat direto
- [x] Sistema de chat por departamento/pessoa
- [x] Gravar todas as conversas no banco de dados
- [x] Status online/offline para membros da equipe
- [x] Remover fundo escuro da logo hero e deixar transparente
- [x] Subir posição da logo no hero
- [x] Animação de carregamento suave nos avatares 3D

## Painel Individual de Usuário
- [x] Página de login para cada membro da equipe
- [x] Painel individual mostrando atendimentos do usuário
- [x] Visualização de agendamentos pessoais
- [x] Histórico de conversas do usuário
- [x] Filtros por data e status

## Painel Admin para Manutenção
- [x] Gerenciamento de funcionários (adicionar, editar, desativar)
- [x] Controle de acessos de usuários
- [x] Visualização de todos os atendimentos da equipe
- [x] Histórico de funcionários desligados
- [x] Testes unitários para rotas de admin

## Métricas de Desempenho
- [x] Seção de métricas no painel admin
- [x] Indicadores de performance por funcionário
- [x] Gráficos de atendimentos realizados
- [x] Taxa de conversão de leads
- [x] Tempo médio de resposta
- [x] Desempenho por departamento
- [x] Metas do mês com progresso

## Ajustes Visuais
- [x] Aumentar tamanho da logo no header
- [x] Aumentar tamanho da logo no footer
- [x] Criar ticker de notícias sobre reforma tributária no topo do site
- [x] Atualizar endereço completo em todo o site
- [x] Configurar Google Maps com pin e direções para o escritório

## Portal do Cliente
- [x] Banner atrativo "O que precisar, estamos à disposição"
- [x] Chat ao vivo melhorado com todas as funcionalidades
- [x] Portal do cliente com cadastro
- [x] Visualização de serviços contratados
- [x] Acompanhamento de status de cada serviço
- [x] Histórico de atendimentos do cliente
- [x] Upload de documentos pelo cliente
- [x] Solicitação de novos serviços pelo portal
- [x] Notificações automáticas para proprietário sobre novos documentos/solicitações
- [x] Testes unitários para rotas do portal do cliente

## Seção de Notícias Fiscais e Contábeis
- [x] Criar schema de banco de dados para armazenar notícias
- [x] Implementar rotas de API para buscar e servir notícias
- [x] Criar componente de banner rotativo com notícias principais
- [x] Criar cards de notícias organizados por categoria (Fiscal, Contábil, Tributário, Trabalhista, Previdenciário, Economia, Reforma Tributária)
- [x] Criar página dedicada de notícias (/noticias)
- [x] Integrar seção de notícias na página inicial
- [x] Seed inicial com 10 notícias sobre reforma tributária e legislação fiscal
- [x] Link "Notícias" no menu de navegação
- [x] Testes unitários para rotas de notícias (47 testes passando)

## Busca de Notícias
- [x] Função de busca no banco de dados
- [x] Rota de API para pesquisa de notícias
- [x] Campo de busca na página de notícias
- [x] Destaque dos termos encontrados nos resultados
- [x] Testes unitários para busca (49 testes passando)

## Fotos da Equipe
- [x] Atualizar fotos reais dos funcionários (Samarah, Laura, Emilly, Júnior, Janderley)

## Avatares Profissionais da Equipe
- [x] Gerar avatar profissional para Samarah (Fiscal) com Nano Banana
- [x] Gerar avatar profissional para Laura (Contábil) com Nano Banana
- [x] Gerar avatar profissional para Emilly (Pessoal) com Nano Banana
- [x] Gerar avatar profissional para Júnior (Pessoal) com Nano Banana
- [x] Gerar avatar profissional para Janderley (Pessoal) com Nano Banana
- [x] Atualizar imagens no site

## Vídeo Explicativo do Site
- [x] Preparar roteiro do vídeo (7 minutos)
- [x] Gerar vídeo com Invideo MCP
- [x] Entregar vídeo ao usuário

## Vídeo Teaser para Redes Sociais
- [x] Preparar roteiro curto (60 segundos)
- [x] Gerar vídeo teaser com Invideo MCP
- [x] Entregar vídeo ao usuário

## Teaser Contabilidade e Fiscal (30s)
- [x] Gerar vídeo teaser focado em contabilidade e fiscal
- [x] Entregar vídeo ao usuário

## Correções de SEO
- [x] Título otimizado (52 caracteres): "Contexto Assessoria Contábil | Escritório em Goiânia"
- [x] Meta description (158 caracteres) com serviços principais
- [x] Palavras-chave relevantes (contabilidade goiânia, contador, assessoria fiscal, etc.)
- [x] Open Graph e Twitter Cards para compartilhamento
- [x] Tags geo.region e geo.placename para SEO local
- [x] Canonical URL configurada
- [x] Palavras-chave no conteúdo do hero section com tags <strong>
