# Mirror site of huggingface

Public version: [https://hf-mirror.com/](https://hf-mirror.com/)

## Deploy your own mirror

### Step 1: [Install caddy](https://caddyserver.com/docs/install)

### Step 2: prepare .env file

.env
```
MIRROR_HOST=hf-mirror.com
CF_TOKEN=your_cf_api_token_if_you_use_cloudflare_dns
API_KEY="" # ignore it
```

### Step 3: run caddy
```bash
caddy run --envfile .env --config ./Caddyfile
```