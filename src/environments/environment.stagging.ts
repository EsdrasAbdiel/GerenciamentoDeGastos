export const environment = {
    production: false,
    name: 'stagging',
    BASE_URL: {
        listarGastos: 'https://gastos-api-78xm.onrender.com/api/resumoFinanceiroMensal/listar',
		listarAnos: 'https://gastos-api-78xm.onrender.com/api/calendario/listar/anos',
		listarMeses: 'https://gastos-api-78xm.onrender.com/api/calendario/listar/meses',
		cadastro: 'https://gastos-api-78xm.onrender.com/api/resumoFinanceiroMensal/cadastro',
		buscarDespesa: 'https://gastos-api-78xm.onrender.com/api/resumoFinanceiroMensal/buscarDespesa',
		atualizarDespesa: 'https://gastos-api-78xm.onrender.com/api/resumoFinanceiroMensal/atualizarDespesa',
		deletarDespesa: 'https://gastos-api-78xm.onrender.com/api/resumoFinanceiroMensal/deletarDespesa',
		cadastrarResumoFinanceiroImportacaoExtrato: 'https://gastos-api-78xm.onrender.com/api/importacaoExtrato/cadastrarResumoFinanceiro/importacaoExtrato',
		buscarExtratoPeloTenantId: 'https://gastos-api-78xm.onrender.com/api/importacaoExtrato',
		registarUsuario: 'https://gastos-api-78xm.onrender.com/api/auth/registro',
		buscarUsuario: 'https://gastos-api-78xm.onrender.com/api/auth/buscarUsuario/',
		logout: 'https://gastos-api-78xm.onrender.com/api/auth/logout/',
		me: 'https://gastos-api-78xm.onrender.com/api/auth/me',
		despesas: 'https://gastos-api-78xm.onrender.com/api/despesa/',
		categorias: 'https://gastos-api-78xm.onrender.com/api/categoria/',
		dashboard: 'https://gastos-api-78xm.onrender.com/api/dashboard/',
		mesesDashboard: 'https://gastos-api-78xm.onrender.com/api/calendario/dashboard/meses'
	}
}