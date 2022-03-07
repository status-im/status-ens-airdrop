rm -rf build build.zip && \
yarn build && \
zip -r build.zip build && \
curl -H "Content-Type: application/zip" \
     -H "Authorization: Bearer $STATUS_NETLIFY_TOKEN" \
     --data-binary "@build.zip" \
     https://api.netlify.com/api/v1/sites/status-ens-airdrop.netlify.app/deploys


