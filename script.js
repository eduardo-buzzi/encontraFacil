/**
 * EncontraFácil - Lógica do Front-End (SPA, DarkMode e Regras de Interface)
 */

// Inicializa os ícones da biblioteca Lucide ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    initTheme();
});

/**
 * 1. Controle do Roteador / Navegação SPA Simples
 * Alterna a visibilidade dos painéis de seções com base no ID fornecido.
 */
function navigateTo(viewId) {
    // Remove a classe ativa de todas as seções
    document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.remove('active');
    });

    // Adiciona a classe ativa na tela alvo
    const target = document.getElementById(`view-${viewId}`);
    if (target) {
        target.classList.add('active');
        // Rola a página de volta para o topo suavemente
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * 2. Manipulação de Busca Principal (RF03)
 */
function executeSearch() {
    const query = document.getElementById('main-search-input').value.trim();
    const badge = document.getElementById('search-keyword-badge');

    if (query !== "") {
        badge.textContent = query;
    } else {
        badge.textContent = "Todos os itens";
    }

    // Avança para o fluxo de listagem das Instituições
    navigateTo('institutions');
}

/**
 * 3. Gerenciamento e Persistência do Modo Escuro (RF06)
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark');
        updateThemeIcon(true);
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeIcon(false);
    }
}

function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    const icon = document.getElementById('theme-icon');
    if (!icon) return;

    if (isDark) {
        icon.setAttribute('data-lucide', 'sun');
    } else {
        icon.setAttribute('data-lucide', 'moon');
    }
    // Re-renderiza o componente gráfico do ícone modificado
    lucide.createIcons();
}

/**
 * 4. Exibir / Ocultar Senha na Tela de Login (RF05)
 */
function togglePasswordVisibility() {
    const passInput = document.getElementById('login-password');
    const icon = document.getElementById('password-toggle-icon');

    if (!passInput || !icon) return;

    if (passInput.type === 'password') {
        passInput.type = 'text';
        icon.setAttribute('data-lucide', 'eye-off');
    } else {
        passInput.type = 'password';
        icon.setAttribute('data-lucide', 'eye');
    }
    lucide.createIcons();
}

/**
 * 5. Envio do Formulário de Solicitação de Recuperação (RF08, RF11)
 */
function submitRequest(event) {
    event.preventDefault();
    // Simulação de envio com sucesso -> redireciona para a tela de Sucesso finalizada
    navigateTo('success');
}