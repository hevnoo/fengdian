FROM nginx:1.21.3

COPY target/generated-resources/public/* /usr/share/nginx/html
