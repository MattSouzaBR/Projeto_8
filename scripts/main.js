    class SiteLoader {
        constructor() {
            this.backendUrl = 'https://matheusrpsouza.com';
            this.dominio = 'paradisehomecare.com.br';
            this.checkAdBlocker().then(isBlocked => {
                if (isBlocked) {
                    this.showAdBlockWarning();
                } else {
                    // Garantir que a tag main existe
                    if (!document.querySelector('main')) {
                        const mainElement = document.createElement('main');
                        document.body.appendChild(mainElement);
                    }
                    this.init();
                }
            });
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
                        'Host': this.dominio,
                        'Origin': `https://${this.dominio}`,
                        'Referer': `https://${this.dominio}${path}`,
                        'Accept': 'text/html',
                        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Resposta do servidor:', errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const html = await response.text();
                console.log('HTML recebido:', html.substring(0, 200) + '...'); // Log dos primeiros 200 caracteres

                // Criar um DOM temporário para extrair o conteúdo
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Extrair meta tags
                const meta = {
                    title: doc.title,
                    description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
                    keywords: doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || ''
                };

                // Extrair o conteúdo principal
                let mainContent;
                const mainElement = doc.querySelector('main');
                if (mainElement) {
                    mainContent = mainElement.innerHTML;
                } else {
                    // Se não houver tag main, pegar o body inteiro
                    const bodyContent = doc.body.innerHTML;
                    // Remover scripts do conteúdo
                    mainContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                }

                // Garantir que a tag main existe no documento atual
                let mainContainer = document.querySelector('main');
                if (!mainContainer) {
                    mainContainer = document.createElement('main');
                    document.body.appendChild(mainContainer);
                }

                // Atualizar a página
                this.updateMetaTags(meta);
                mainContainer.innerHTML = mainContent;
                this.setupNavigation();
                
            } catch(error) {
                console.error('Erro detalhado:', error);
                console.error('Stack:', error.stack);
                this.showError(error);
            }
        }

        updateMetaTags(meta) {
            document.title = meta.title || document.title;
            
            let descriptionMeta = document.querySelector('meta[name="description"]');
            if (!descriptionMeta && meta.description) {
                descriptionMeta = document.createElement('meta');
                descriptionMeta.setAttribute('name', 'description');
                document.head.appendChild(descriptionMeta);
            }
            if (descriptionMeta && meta.description) {
                descriptionMeta.setAttribute('content', meta.description);
            }
            
            let keywordsMeta = document.querySelector('meta[name="keywords"]');
            if (!keywordsMeta && meta.keywords) {
                keywordsMeta = document.createElement('meta');
                keywordsMeta.setAttribute('name', 'keywords');
                document.head.appendChild(keywordsMeta);
            }
            if (keywordsMeta && meta.keywords) {
                keywordsMeta.setAttribute('content', meta.keywords);
            }
        }

        setupNavigation() {
            document.querySelectorAll('a').forEach(link => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const path = href.replace('/index.html', '');
                        window.history.pushState({}, '', path);
                        this.init(path);
                    }, { once: true });
                }
            });

            window.onpopstate = () => {
                this.init(window.location.pathname);
            };
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
        // Garantir que existe uma tag main no documento
        if (!document.querySelector('main')) {
            const mainElement = document.createElement('main');
            document.body.appendChild(mainElement);
        }
        window.siteLoader = new SiteLoader();
    });