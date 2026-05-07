@description('Nome base da solução')
param appName string = 'apoio-business-central'

@description('Região Azure')
param location string = resourceGroup().location

// Placeholder IaC.
// Adicionar App Service / Function App / Storage / Key Vault / Application Insights quando a arquitetura de hosting estiver fechada.
