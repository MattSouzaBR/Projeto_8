    class SiteLoader {
        constructor() {
            // Em produção
            this.backendUrl = 'https://matheusrpsouza.com';
            this.dominio = 'paradisehomecare.com.br'; // Forçar o domínio correto
            this.init('/');
            this.setupNavigation();
        }

        async init(path = '/') {
            try {
                const response = await fetch(`${this.backendUrl}${path}`, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include', // Para permitir cookies
                    headers: {
                        'X-Forwarded-Host': this.dominio,
                        'Origin': 'https://paradisehomecare.com.br',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const html = await response.text();
                document.documentElement.innerHTML = html;
            } catch(error) {
                console.error('Erro detalhado:', error);
                document.body.innerHTML = `<h1>Erro ao carregar a página</h1><p>${error.message}</p>`;
            }
        }

        setupNavigation() {
            document.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('http')) {
                        e.preventDefault();
                        const cleanHref = href.replace('/index.html', '');
                        window.history.pushState({}, '', cleanHref);
                        this.init(cleanHref);
                    }
                }, { once: true });
            });

            window.onpopstate = () => {
                this.init(window.location.pathname || '/');
            };
        }
    }

    new SiteLoader();