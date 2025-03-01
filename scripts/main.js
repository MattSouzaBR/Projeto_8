    // class SiteLoader {
    //     constructor() {
    //         // Em produção
    //         this.backendUrl = 'https://matheusrpsouza.com';
    //         this.dominio = window.location.hostname;
    //         this.init('/');
    //         this.setupNavigation();
    //     }

    //     async init(path = '/') {
    //         try {
    //             console.log('Fazendo requisição para:', `${this.backendUrl}${path}`);
    //             console.log('Com X-Forwarded-Host:', this.dominio);
                
    //             const response = await fetch(`${this.backendUrl}${path}`, {
    //                 mode: 'cors', // Explicita o modo CORS
    //                 headers: {
    //                     'X-Forwarded-Host': this.dominio,
    //                     'Origin': window.location.origin
    //                 }
    //             });

    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`);
    //             }

    //             let html = await response.text();
                
    //             // Converte URLs relativas em absolutas
    //             html = html.replace(
    //                 /(href|src)="\/([^"]*)"/g, 
    //                 `$1="${this.backendUrl}/$2"`
    //             );
                
    //             // Converte URLs relativas em CSS (background-image, etc)
    //             html = html.replace(
    //                 /url\(['"]?\/([^'")]+)['"]?\)/g, 
    //                 `url('${this.backendUrl}/$1')`
    //             );

    //             document.documentElement.innerHTML = html;
    //             this.setupNavigation();
                
    //             // Ajusta as tags base para garantir que todos os recursos sejam carregados corretamente
    //             const baseTag = document.createElement('base');
    //             baseTag.href = this.backendUrl;
    //             document.head.prepend(baseTag);
    //         }
    //         catch(error) {
    //             console.error('Erro detalhado:', error);
    //             document.write('Erro ao carregar a página: ' + error.message);
    //         }
    //     }

    //     setupNavigation() {
    //         document.querySelectorAll('a').forEach(link => {
    //             link.addEventListener('click', (e) => {
    //                 const href = link.getAttribute('href');
    //                 if (href && !href.startsWith('http')) {
    //                     e.preventDefault();
    //                     const cleanHref = href.replace('/index.html', '');
    //                     window.history.pushState({}, '', cleanHref);
    //                     this.init(cleanHref);
    //                 }
    //             }, { once: true });
    //         });

    //         window.onpopstate = () => {
    //             this.init(window.location.pathname || '/');
    //         };
    //     }
    // }

    // new SiteLoader();