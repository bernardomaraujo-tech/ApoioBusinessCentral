# ApoioBusinessCentral

Plataforma interna de apoio, suporte, base de conhecimento, automação e assistência por IA para processos relacionados com **Microsoft Dynamics 365 Business Central**.

## Objetivo

A **ApoioBusinessCentral** centraliza pedidos internos de suporte e melhoria sobre Business Central, usando:

- Jira Service Management / Service Collection para portal, tickets, workflow, filas, SLAs e reporting;
- Confluence para a **KB ApoioBusinessCentral**;
- automações Atlassian para triagem, encaminhamento e notificações;
- uma Integration API leve para contexto Business Central, webhooks, migração da KB e integrações futuras;
- IA restrita à base de conhecimento validada.

## Baseline MVP

| Parâmetro | Valor |
|---|---:|
| Agentes JSM | 3 a 5 |
| Utilizadores internos no portal | Até 100 |
| Editores / validadores KB | 2 |
| Idioma KB | PT-PT |
| Empresas BC suportadas | 3 |
| Ambientes BC suportados | 3 |
| Modelo | Organização interna única |
| SLA inicial | Resposta até 24h |
| IA | Apenas com base na KB fornecida |
| Sem artigo aplicável | Encaminhar para agente |
| Auditoria avançada | Fora do MVP |

## Estrutura do repositório

```text
apoio-business-central/
├── docs/                    # Documentação funcional, técnica, operação e rollout
├── adr/                     # Architecture Decision Records
├── config/                  # Configurações funcionais versionadas
├── knowledge-base/          # Templates, exemplos e mapeamento de migração da KB
├── services/                # Serviços aplicacionais
├── workers/                 # Workers assíncronos
├── scripts/                 # Bootstrap, deploy, migração e validação
├── samples/                 # Exemplos de payloads e chamadas API
├── tests/                   # Testes globais
├── infra/                   # Infraestrutura como código
└── .github/workflows/       # CI/CD
```

## Arranque rápido local

### 1. Configurar ambiente

```bash
cp .env.example .env
```

Editar `.env` com valores reais. Nunca guardar secrets no GitHub.

### 2. Executar Integration API

```bash
cd services/integration-api
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8080
```

### 3. Testar healthcheck

```bash
curl http://localhost:8080/health
```

### 4. Executar testes

```bash
cd services/integration-api
pytest
```

## Componentes principais

| Componente | Estado | Descrição |
|---|---|---|
| Documentação funcional | Scaffold pronto | Request types, workflow, SLAs e operação. |
| Documentação técnica | Scaffold pronto | Integrações Jira, Confluence, BC e webhooks. |
| Integration API | Base pronta | FastAPI com endpoints de health, Jira webhook, BC webhook e KB draft. |
| KB templates | Pronto | Template padrão de artigo e artigo exemplo. |
| Config YAML | Pronto | Request types, prioridade, SLAs, filas e taxonomia. |
| GitHub Actions | Pronto | CI base para validar Python e estrutura. |

## Regras fundamentais de IA

A IA da ApoioBusinessCentral deve seguir estas regras:

1. responder apenas com base na KB ApoioBusinessCentral validada;
2. não inventar procedimentos;
3. se não existir artigo aplicável, encaminhar para agente;
4. nunca executar alterações no Business Central;
5. nunca publicar artigos automaticamente;
6. indicar sempre a fonte interna usada quando gerar draft.

## Próximo passo

1. Criar repositório GitHub `apoio-business-central`.
2. Fazer upload destes ficheiros.
3. Configurar secrets no GitHub Actions.
4. Validar request types e campos com a equipa.
5. Migrar os primeiros artigos da KB.
6. Criar projeto Jira Service Management e espaço Confluence.
