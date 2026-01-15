export const environment = {
	production: false,
	name: 'dev',
	BASE_URL: {
	listarGastos: 'https://localhost:5001/api/gastos/listar',
  listarAnos: 'https://localhost:5001/api/data/listar/anos',
  listarMeses: 'https://localhost:5001/api/data/listar/meses',
  cadastro: 'https://localhost:5001/api/gastos/cadastro',
  buscarDespesa: 'https://localhost:5001/api/gastos/buscarDespesa',
  atualizarDespesa: 'https://localhost:5001/api/gastos/atualizarDespesa',
  deletarDespesa: 'https://localhost:5001/api/gastos/deletarDespesa'
  }
}