# Limitações da versão GitHub Pages

## Limitações técnicas

| Limitação | Explicação |
|---|---|
| Sem backend | GitHub Pages só serve ficheiros estáticos. |
| Sem base de dados central | Os dados ficam no browser de cada utilizador. |
| Sem login real | Não há SSO nem controlo por utilizador. |
| Sem Jira real | Não cria tickets em Jira Service Management. |
| Sem Confluence real | Não publica artigos em Confluence. |
| Sem Business Central real | Não consulta dados BC. |
| Sem webhooks | Não recebe eventos externos. |
| Sem IA generativa | Apenas pesquisa local na KB. |

## Mitigação

| Necessidade | Alternativa simples |
|---|---|
| Partilhar dados | Exportar/importar JSON. |
| Versionar KB | Exportar Markdown e guardar no GitHub. |
| Aprovação editorial | Usar processo manual via pull request. |
| Backup | Exportar JSON regularmente. |
| Histórico | Usar commits GitHub para ficheiros exportados. |

## Quando evoluir

Evoluir para backend real quando for necessário:

- multiutilizador real;
- autenticação;
- Jira/Confluence/BC;
- auditoria;
- base de dados central;
- IA com RAG;
- notificações;
- webhooks.
