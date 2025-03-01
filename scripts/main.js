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
                        'Origin': `https://${this.dominio}`,
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const html = await response.text();
                
                // Processar o HTML antes de inserir
                const processedHtml = this.processHtml(html);
                document.documentElement.innerHTML = processedHtml;
                
                // Adicionar base tag e configurar navegação
                this.addBaseTag();
                this.setupNavigation();
                
            } catch(error) {
                console.error('Erro detalhado:', error);
                this.showError(error);
            }
        }

        processHtml(html) {
            return html
                .replace(/(href|src)="\/([^"]*)"/g, (match, attr, path) => {
                    // Não modificar URLs absolutas
                    if (path.startsWith('http')) return match;
                    return `${attr}="${this.backendUrl}/${path}"`;
                })
                .replace(new RegExp(this.backendUrl, 'g'), `https://${this.dominio}`)
                .replace(/matheusrpsouza\.com/g, this.dominio);
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

        showError(error) {
            document.body.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <h1>Erro ao carregar a página</h1>
                    <p>Ocorreu um erro ao carregar o conteúdo.</p>
                    <p>Por favor, tente novamente mais tarde.</p>
                    <p style="color: #666; font-size: 12px;">Detalhes técnicos: ${error.message}</p>
                    <button onclick="window.location.reload()" style="
                        margin-top: 20px;
                        padding: 10px 20px;
                        background-color: #2ecc71;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Recarregar Página</button>
                </div>`;
        }
    }

    // Inicialização quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
        window.siteLoader = new SiteLoader();
    });