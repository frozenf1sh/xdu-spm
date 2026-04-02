#!/bin/sh

API_URL=${API_URL:-http://localhost:3001/api}

cat > /usr/share/nginx/html/env-config.js <<EOF
window.__ENV__ = {
  VITE_API_URL: "${API_URL}"
};
EOF

exec "$@"
