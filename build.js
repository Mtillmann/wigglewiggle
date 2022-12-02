const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const fs = require('fs');


fs.writeFileSync(__dirname + '/docs/index.html', `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <title>Wigglewiggle Example</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    <script>
        ${fs.readFileSync(__dirname + '/wigglewiggle.js', 'utf-8')}
    </script>
    <script>
    
        window.addEventListener('load', () => {
            
            const action = new URL(window.location).searchParams.get('action') || 'alert';
            window.ww = new WiggleWiggle({x:true, y: true, actions : [action]});
            select.value = action;
            
            select.addEventListener('change', e => {
                window.ww.options.actions = [e.target.value];
                let url = new URL(window.location);
                url.searchParams.set('action', e.target.value);
                history.replaceState({}, null, url);
            })
            
            button.addEventListener('click', e => {
                window.ww.trigger();
            })
        })    
    </script>

</head>
<body>
<div class="container">
    <div class="row">
        <div class="col-12">
            <h1 class="display-1">EXAMPLE</h1>
            <p class="lead">
                Select an action, then resize your browser window or simply click the button to trigger...
            </p>
        </div>
        <div class="col-6 col-md-9">
            <select class="form-select form-select-lg mb-3" id="select">
              <option value="alert">alert</option>
              <option value="dropCSS">dropCSS</option>
              <option value="glitch">glitch</option>
              <option value="viteError">viteError</option>
            </select>
        </div>
        <div class="col-6 col-md-3">
            <button class="btn-lg w-100 btn btn-primary" id="button">trigger now</button>
        </div>
        <div class="col-12">
            ${md.render(fs.readFileSync(__dirname + '/readme.md', 'utf-8')).replace('<table', '<table class="table table-sm table-bordered"')}
        </div>
    </div>
</div>
</body>
</html> 
`);