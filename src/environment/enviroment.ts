export const environment = {
  production: false,
  name: 'dev',
  BASE_URL: {
    listarGastos: 'http://localhost:8080/api/resumoFinanceiroMensal/listar',
    listarAnos: 'http://localhost:8080/api/calendario/listar/anos',
    listarMeses: 'http://localhost:8080/api/calendario/listar/meses',
    cadastro: 'http://localhost:8080/api/resumoFinanceiroMensal/cadastro',
    buscarDespesa: 'http://localhost:8080/api/resumoFinanceiroMensal/buscarDespesa',
    atualizarDespesa: 'http://localhost:8080/api/resumoFinanceiroMensal/atualizarDespesa',
    deletarDespesa: 'http://localhost:8080/api/resumoFinanceiroMensal/deletarDespesa',
    registarUsuario: 'http://localhost:8080/api/auth/registro',
    buscarUsuario: 'http://localhost:8080/api/auth/buscarUsuario/',
    logout: 'http://localhost:8080/api/auth/logout/',
    me: 'http://localhost:8080/api/auth/me',
    despesas: 'http://localhost:8080/api/despesa/',
    categorias: 'http://localhost:8080/api/categoria/',
    dashboard: 'http://localhost:8080/api/dashboard/',
    mesesDashboard: 'http://localhost:8080/api/calendario/dashboard/meses'
  }
}
