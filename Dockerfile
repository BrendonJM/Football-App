FROM node:22-alpine

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node server.js ./
COPY --chown=node:node index.html ./
COPY --chown=node:node share.html ./
COPY --chown=node:node app.js ./
COPY --chown=node:node share.js ./
COPY --chown=node:node styles.css ./

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || 3000), r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
