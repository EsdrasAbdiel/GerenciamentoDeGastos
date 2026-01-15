export const environment = {
  production: false,
  name: 'dev',
  BASE_URL: {
    listarGastos: 'https://localhost:8080/api/gastos/listar',
    listarAnos: 'https://localhost:8080/api/data/listar/anos',
    listarMeses: 'https://localhost:8080/api/data/listar/meses',
    cadastro: 'https://localhost:8080/api/gastos/cadastro',
    buscarDespesa: 'https://localhost:8080/api/gastos/buscarDespesa',
    atualizarDespesa: 'https://localhost:8080/api/gastos/atualizarDespesa',
    deletarDespesa: 'https://localhost:8080/api/gastos/deletarDespesa'
  }
}