class WiggleWiggle {

    triggered = false;
    eventHistory = [];

    constructor(options = {}) {
        this.options = {
            ...{
                initImmediately: true,
                triggerOnInit: false,
                triggerThreshold: 10,
                actions: ['glitch'],
                alertMessage: 'Please use your browser devtool\'s toggle device toolbar',
                dropCSSNodeSelector: 'link[rel="stylesheet"]:not([data-no-drop]), style:not([data-no-drop])',
                x: true,
                y: false
            }, ...options
        };
        this.options.actions = Array.isArray(this.options.actions) ? this.options.actions : [this.options.actions];
        if (this.options.initImmediately) {
            this.init();
        }
    }

    init() {
        window.addEventListener('resize', this.resizeListener.bind(this));
        if (this.options.triggerOnInit) {
            this.trigger();
        }
    }

    resizeListener() {
        if (this.triggered) {
            return;
        }
        const now = Date.now();
        const cutoff = now - 1000;
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.eventHistory.push({time: now, w, h});

        let count = 0;
        for (let i = this.eventHistory.length - 1; i >= 0; i--) {
            const xDiff = Math.abs(this.eventHistory[i].w - w);
            const yDiff = Math.abs(this.eventHistory[i].h - h);
            if ((this.options.x && this.options.y) || (this.options.x && xDiff > 0) || (this.options.y && yDiff > 0)) {
                count++;
            }
            if (this.eventHistory[i].time < cutoff) {
                break;
            }
        }
        if (count >= this.options.triggerThreshold) {
            this.trigger();
        }
    }

    trigger() {
        this.triggered = true;
        this.options.actions.forEach(action => {
            if (!!(action && action.constructor && action.call && action.apply)) {
                action(this);
            } else {
                this[`action` + action.replace(/^\w/, char => char.toUpperCase())]();
            }
        })
    }

    actionAlert() {
        alert(this.options.alertMessage);
    }

    actionReload() {
        window.location.reload();
    }

    actionDropCSS() {
        console.log(document.querySelectorAll(this.options.dropCSSNodeSelector));
        document.querySelectorAll(this.options.dropCSSNodeSelector).forEach(node => node.remove());
    }

    actionGlitch() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', String(w));
        canvas.setAttribute('height', String(h));
        canvas.setAttribute('id', 'glitchcanvas');

        const context = canvas.getContext('2d');
        let top = 0;

        context.beginPath();
        context.fillStyle = getComputedStyle(document.body).backgroundColor || '#ffffff';
        while (top < h) {
            const height = Math.random() + 2;
            const space = Math.random() * 10;
            context.fillRect(0, top, w, height);
            top += height + space;
        }
        context.fill();
        context.closePath();

        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            document.body.insertAdjacentHTML('beforeend', `
            <style do-not-drop>
                html{ position: relative !important; width:100vw !important; height:100vh !important; overflow : hidden !important}
                body{ transform-origin: -50% ${window.scrollY + h * .5}px; transform: skew(${Math.random() * 20 + 40}deg);}
                html::after{ content:""; background-image:url(${url}); width:100%; height:100%;position:fixed; left:0; top:0; z-index: 999999;}               
            </style>        
        `);
        })
    }

    actionViteError() {
        let stack;
        try {
            document.body.insertAdjacentHTML();
        } catch (e) {
            stack = e.stack;
        }

        document.body.insertAdjacentHTML('beforeend', `
        <style data-no-drop>
            :root{position: fixed;top: 0;left: 0;width: 100%height: 100%;z-index: 99999;
              --fve-ms: 'SFMono-Regular', Consolas,'Liberation Mono', Menlo, Courier, monospace;}
            .backdrop{position: fixed;z-index: 99999;top: 0;left: 0;width: 100%;height: 100%;overflow-y: scroll;
                margin: 0;background: rgba(0, 0, 0, 0.66)}
            .window{font-family: var(--fve-ms);line-height: 1.5;width: 800px;color: #d8d8d8;
              margin: 30px auto;padding: 25px 40px;position: relative;background: #181818;
              border-radius: 6px 6px 8px 8px;box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
              overflow: hidden;border-top: 8px solid #ff5555;direction: ltr;text-align: left}
            pre{font-family: var(--fve-ms);font-size: 16px;margin-top: 0;margin-bottom: 1em;overflow-x: scroll;
              scrollbar-width: none}pre::-webkit-scrollbar{display: none}
            .message{line-height: 1.3;font-weight: 600;white-space: pre-wrap}
            .message-body{color: #ff5555}.plugin{color: #cfa4ff}
            .file{color: #2dd9da;margin-bottom: 0;white-space: pre-wrap;word-break: break-all}
            .frame{color: #e2aa53}.stack{font-size: 13px;color: #c9c9c9}
            .tip{font-size: 13px;color: #999;border-top: 1px dotted #999;padding-top: 13px}
            code{font-size: 13px;font-family: var(--fve-ms);color: #e2aa53}
            .file-link{text-decoration: underline;cursor: pointer}
        </style>
        <div class="backdrop" part="backdrop">
          <div class="window" part="window">
            <pre class="message" part="message"><span class="plugin">[dont:resize:the:window] </span><span class="message-body">undefined variable "undefined"</span></pre>
            <pre class="file" part="file">${window.location}:0:0</pre>
            <pre class="frame" part="frame"></pre>
            <pre class="stack" part="stack">${stack}</pre>
            <div class="tip" part="tip">
              Click outside or fix the code to dismiss.<br>
              You can also disable this overlay by setting
              <code>server.hmr.overlay</code> to <code>false</code> in <code>vite.config.js.</code>
            </div>
          </div>
        </div>
        `);
        setTimeout(() => {
            document.body.addEventListener('click', e => window.location.reload());
        }, 500);
    }
}