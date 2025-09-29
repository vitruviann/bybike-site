// Importa a biblioteca da Stripe, que instalamos via npm
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Todas as funções serverless na Vercel exportam uma função handler
exports.handler = async (event) => {
    // 1. Validação Simples: Garante que a requisição é um POST.
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        // O preço do produto. No futuro, você pode receber isso do frontend
        // para carrinhos dinâmicos. Valor em CENTAVOS.
        // R$ 89,90 = 8990 centavos.
        const amount = 8990; 

        // 2. Criando a "Intenção de Pagamento" (Payment Intent)
        // Isso informa à Stripe sobre nossa intenção de realizar uma cobrança.
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'brl',
            // Habilita métodos de pagamento automáticos que você configurou no Dashboard da Stripe
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // 3. Resposta de Sucesso
        // Enviamos de volta para o nosso frontend apenas o 'client_secret'.
        // Essa é a chave pública que autoriza o frontend a exibir o formulário
        // de pagamento para ESTA transação específica.
        return {
            statusCode: 200,
            body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
        };

    } catch (error) {
        console.error("Erro ao criar Payment Intent:", error);
        // 4. Resposta de Erro
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};