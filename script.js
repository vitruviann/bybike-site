document.addEventListener('DOMContentLoaded', () => {
    // Inicializa os ícones do Feather
    feather.replace();

    // Lógica do FAQ Accordion (mantendo o que você já pode ter)
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            question.classList.toggle('active');

            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // ===================================================================
    // INÍCIO: LÓGICA DO CHECKOUT INVISÍVEL
    // ===================================================================

    // 1. Selecionando os Elementos do DOM
    const checkoutButton = document.getElementById('checkout-button');
    const modal = document.getElementById('checkout-modal');
    const modalContent = document.getElementById('modal-content-container');
    const closeModalButton = document.getElementById('close-modal-button');

    // Variável para garantir que o script da Stripe seja carregado apenas uma vez
    let stripeScriptLoaded = false;

    // 2. Função para carregar o script da Stripe (Lazy Load)
    const loadStripeScript = () => {
        return new Promise((resolve) => {
            if (stripeScriptLoaded) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.onload = () => {
                stripeScriptLoaded = true;
                console.log('Stripe.js carregado com sucesso.');
                resolve();
            };
            document.head.appendChild(script);
        });
    };
    
    // 3. Funções para controlar o Modal
    const openModal = async () => {
        modal.classList.remove('hidden');
        modal.classList.add('flex'); // Usamos flex para centralizar
        
        // Pequeno delay para permitir que o 'display' mude antes de iniciar a transição
        setTimeout(() => {
            modalContent.classList.remove('-translate-y-10', 'opacity-0');
            modalContent.classList.add('translate-y-0', 'opacity-100');
        }, 50);

        // Dispara o evento de início de checkout para o Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'begin_checkout', {
                currency: 'BRL',
                value: 89.90,
                items: [{
                    item_id: 'PLACA_AUTOPROPELIDA_01',
                    item_name: 'Placa Autopropelida CONTRAN 996/2023',
                    price: 89.90,
                    quantity: 1
                }]
            });
        }
        
        // Carrega o script da Stripe E inicia a configuração do checkout
        await loadStripeScript();
        // A função para iniciar o Stripe será adicionada no próximo passo
        // initializeStripe(); 
    };

    const closeModal = () => {
        modalContent.classList.add('-translate-y-10', 'opacity-0');
        modalContent.classList.remove('translate-y-0', 'opacity-100');
        
        // Espera a transição terminar antes de esconder o modal
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300); // 300ms, a duração da transição do Tailwind
    };

    // 4. Adicionando os Event Listeners
    if (checkoutButton) {
        checkoutButton.addEventListener('click', (e) => {
            e.preventDefault(); // Previne qualquer comportamento padrão do link/botão
            openModal();
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }
    
    // Fecha o modal se o usuário clicar fora do conteúdo
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fecha o modal com a tecla 'Escape'
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});