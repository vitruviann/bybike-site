// Importa a biblioteca da Stripe
const stripe = require('stripe');

// O handler no formato padrão da Vercel (req, res)
export default async function handler(req, res) {
    // 1. Garante que a requisição é um POST
    if (req.method !== 'POST') {
        // Envia uma resposta com status 405 - Method Not Allowed
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // 2. Inicializa o Stripe DENTRO do handler, usando a variável de ambiente
        // Isso é mais seguro e fornece erros melhores se a chave estiver faltando.
        const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

        // 3. Define o valor em centavos
        const amount = 8990;

        // 4. Cria a Intenção de Pagamento (Payment Intent)
        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: amount,
            currency: 'brl',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // 5. Envia a resposta de sucesso com o clientSecret
        return res.status(200).json({ clientSecret: paymentIntent.client_secret });

    } catch (error) {
        // 6. Em caso de qualquer erro, loga no console da Vercel e envia uma resposta 500
        console.error("Erro interno ao criar Payment Intent:", error);
        return res.status(500).json({ error: error.message });
    }
}