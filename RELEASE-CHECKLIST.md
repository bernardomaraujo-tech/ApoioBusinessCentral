# Release Checklist — ApoioBusinessCentral

## Antes da release

- [ ] README atualizado.
- [ ] ADRs atualizadas.
- [ ] Configurações YAML validadas.
- [ ] `.env.example` atualizado sem secrets reais.
- [ ] Testes unitários executados.
- [ ] Testes de integração revistos.
- [ ] Documentação de deployment revista.
- [ ] Scripts de migração testados em dados de exemplo.
- [ ] Guardrails de IA confirmados.
- [ ] Plano de rollback documentado.

## Validação funcional

- [ ] Request types revistos.
- [ ] Campos obrigatórios confirmados.
- [ ] Workflow revisto.
- [ ] SLA de resposta 24h configurado.
- [ ] Queues definidas.
- [ ] KB ligada ao projeto JSM.
- [ ] Artigos de exemplo publicados em ambiente de teste.

## Validação técnica

- [ ] Healthcheck da Integration API OK.
- [ ] Autenticação Jira validada.
- [ ] Autenticação Confluence validada.
- [ ] Autenticação Business Central validada, se aplicável.
- [ ] Webhook BC validado com handshake.
- [ ] Logs e correlation ID ativos.
- [ ] Secrets configurados fora do repositório.

## Pós-release

- [ ] Monitorizar tickets criados.
- [ ] Monitorizar SLA.
- [ ] Recolher feedback dos agentes.
- [ ] Rever artigos mais usados.
- [ ] Criar backlog de melhorias.
