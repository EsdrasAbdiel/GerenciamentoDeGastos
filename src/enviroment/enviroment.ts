export const environment = {
  production: false,
  name: 'dev',
  BASE_URL: {
    listarGastos: 'http://localhost:8080/api/gastos/listar',
    listarAnos: 'http://localhost:8080/api/data/listar/anos',
    listarMeses: 'http://localhost:8080/api/data/listar/meses',
    cadastro: 'http://localhost:8080/api/gastos/cadastro',
    buscarDespesa: 'http://localhost:8080/api/gastos/buscarDespesa',
    atualizarDespesa: 'http://localhost:8080/api/gastos/atualizarDespesa',
    deletarDespesa: 'http://localhost:8080/api/gastos/deletarDespesa',
    registarUsuario: 'http://localhost:8080/api/auth/registro',
    buscarUsuario: 'http://localhost:8080/api/auth/buscarUsuario/',
    logout: 'http://localhost:8080/api/auth/logout/'
  }
}
