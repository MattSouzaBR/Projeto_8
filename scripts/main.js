    class SiteLoader {
        constructor() {
            this.backendUrl = 'https://matheusrpsouza.com';
            this.dominio = 'paradisehomecare.com.br';
            
            // Garantir que a tag main existe
            if (!document.querySelector('main')) {
                const mainElement = document.createElement('main');
                document.body.appendChild(mainElement);
            }
            
            this.init();
        }

        async init(path = '/') {
            try {
                console.log('Iniciando requisição para:', `${this.backendUrl}${path}`);
                console.log('Usando domínio:', this.dominio);
                
                const response = await fetch(`${this.backendUrl}${path}`, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        'X-Forwarded-Host': this.dominio,
                        'Accept': 'text/html, application/xhtml+xml'
                    }
                });

                if (!response.ok) {
                    console.error('Status:', response.status);
                    console.error('Status Text:', response.statusText);
                    const errorText = await response.text();
                    console.error('Resposta de erro:', errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const html = await response.text();
                console.log('Resposta recebida com sucesso');

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
                    mainContent = doc.body.innerHTML;
                }

                // Processar URLs no conteúdo
                mainContent = this.processContent(mainContent);

                // Atualizar a página
                this.updateMetaTags(meta);
                document.querySelector('main').innerHTML = mainContent;
                this.setupNavigation();
                
            } catch(error) {
                console.error('Erro detalhado:', error);
                console.error('Stack:', error.stack);
                this.showError(error);
            }
        }

        processContent(content) {
            // Substituir URLs absolutas do backend para o frontend
            return content.replace(
                new RegExp(this.backendUrl, 'g'), 
                `https://${this.dominio}`
            );
        }

        updateMetaTags(meta) {
            if (meta.title) document.title = meta.title;
            
            const updateMeta = (name, content) => {
                if (!content) return;
                let meta = document.querySelector(`meta[name="${name}"]`);
                if (!meta) {
                    meta = document.createElement('meta');
                    meta.setAttribute('name', name);
                    document.head.appendChild(meta);
                }
                meta.setAttribute('content', content);
            };

            updateMeta('description', meta.description);
            updateMeta('keywords', meta.keywords);
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

        showError(error) {
            const mainElement = document.querySelector('main');
            mainElement.innerHTML = `
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