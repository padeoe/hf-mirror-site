# Mirror site of huggingface

Public version: [https://hf-mirror.com/](https://hf-mirror.com/)

## Deploy your own mirror

### Step 1: Install caddy
Install Caddy with the following plugins:

- replace-response
- transform-encoder
- (Option) caddy-dns/cloudflare

You can download the executable caddy file containing the above plugins from [the official website here](https://caddyserver.com/download?package=github.com%2Fcaddyserver%2Freplace-response&package=github.com%2Fcaddy-dns%2Fcloudflare&package=github.com%2Fcaddyserver%2Ftransform-encoder) or build with [xcaddy](https://github.com/caddyserver/xcaddy).


### Step 2: prepare .env file

.env
```
MIRROR_HOST=hf-mirror.com
CF_TOKEN=your_cf_api_token_if_you_use_cloudflare_dns
API_KEY="" # ignore it
```

### Step 3: run caddy
```bash
caddy run --envfile ./scripts/caddy/.env.template --config ./scripts/caddy/Caddyfile
```