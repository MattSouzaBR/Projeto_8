    class SiteLoader {
        constructor() {
            this.backendUrl = 'https://matheusrpsouza.com';
            this.dominio = 'paradisehomecare.com.br';
            this.checkAdBlocker().then(isBlocked => {
                if (isBlocked) {
                    this.showAdBlockWarning();
                } else {
                    this.init();
                }
            });
        }

        async checkAdBlocker() {
            try {
                await fetch('https://matheusrpsouza.com/favicon.ico', {
                    method: 'HEAD',
                    mode: 'cors'
                });
                return false;
            } catch (e) {
                return true;
            }
        }

        showAdBlockWarning() {
            document.body.innerHTML = `
                <div style="padding: 20px; max-width: 600px; margin: 50px auto; text-align: center; font-family: Arial, sans-serif;">
                    <h1 style="color: #e74c3c;">Bloqueador de Anúncios Detectado</h1>
                    <p style="font-size: 16px; line-height: 1.6;">
                        Para acessar este site, por favor desative seu bloqueador de anúncios (AdBlock) e recarregue a página.
                    </p>
                    <p style="font-size: 14px; color: #666; margin-top: 20px;">
                        Não utilizamos anúncios, mas o bloqueador está impedindo a comunicação necessária com nosso servidor.
                    </p>
                    <button onclick="window.location.reload()" style="
                        margin-top: 20px;
                        padding: 10px 20px;
                        background-color: #2ecc71;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Recarregar Página</button>
                </div>
            `;
        }

        async init(path = '/') {
            try {
                console.log('Iniciando requisição para:', `${this.backendUrl}${path}`);
                
                const response = await fetch(`${this.backendUrl}${path}`, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        'X-Forwarded-Host': this.dominio,
                        'Origin': 'https://paradisehomecare.com.br',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    },
                    cache: 'no-cache',
                    referrerPolicy: 'strict-origin-when-cross-origin'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const html = await response.text();
                
                // Processar o HTML antes de inserir
                const processedHtml = this.processHtml(html);
                document.documentElement.innerHTML = processedHtml;
                
                // Adicionar base tag
                this.addBaseTag();
                
            } catch(error) {
                console.error('Erro detalhado:', error);
                console.error('Stack:', error.stack);
                document.body.innerHTML = `
                    <div style="padding: 20px; text-align: center;">
                        <h1>Erro ao carregar a página</h1>
                        <p>Por favor, desative bloqueadores de anúncios e recarregue a página.</p>
                        <p>Detalhes técnicos: ${error.message}</p>
                    </div>`;
            }
        }

        processHtml(html) {
            // Converter URLs relativas em absolutas
            return html.replace(/(href|src)="\/([^"]*)"/g, `$1="${this.backendUrl}/$2"`);
        }

        addBaseTag() {
            const baseTag = document.createElement('base');
            baseTag.href = this.backendUrl + '/';
            document.head.insertBefore(baseTag, document.head.firstChild);
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

    // Inicialização quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
        window.siteLoader = new SiteLoader();
    });