export const environment = {
  production: true,
  name: 'prod',
  BASE_URL: {
    listarGastos: 'https://backend-gerenciamento-gastos.onrender.com/api/gastos/listar',
    listarAnos: 'https://backend-gerenciamento-gastos.onrender.com/api/data/listar/anos',
    listarMeses: 'https://backend-gerenciamento-gastos.onrender.com/api/data/listar/meses',
    cadastro: 'https://backend-gerenciamento-gastos.onrender.com/api/gastos/cadastro',
    buscarDespesa: 'https://backend-gerenciamento-gastos.onrender.com/api/gastos/buscarDespesa',
    atualizarDespesa: 'https://backend-gerenciamento-gastos.onrender.com/api/gastos/atualizarDespesa',
    deletarDespesa: 'https://backend-gerenciamento-gastos.onrender.com/api/gastos/deletarDespesa',
    registarUsuario: 'https://backend-gerenciamento-gastos.onrender.com/api/auth/registro',
    buscarUsuario: 'https://backend-gerenciamento-gastos.onrender.com/api/auth/buscarUsuario/',
    logout: 'https://backend-gerenciamento-gastos.onrender.com/api/auth/logout/',
    me: 'https://backend-gerenciamento-gastos.onrender.com/api/auth/me',
    despesas: 'https://backend-gerenciamento-gastos.onrender.com/api/despesa/',
    categorias: 'https://backend-gerenciamento-gastos.onrender.com/api/categoria/',
    dashboard: 'https://backend-gerenciamento-gastos.onrender.com/api/dashboard/',
    mesesDashboard: 'https://backend-gerenciamento-gastos.onrender.com/api/calendario/dashboard/meses'
  }
};
