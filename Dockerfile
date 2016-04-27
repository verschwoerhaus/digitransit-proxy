FROM nginx
MAINTAINER Reittiopas version: 0.1
ENV INSTALL_DIR="/opt/nginx"
RUN mkdir -p $INSTALL_DIR /opt/nginx/www /opt/nginx/cache /opt/nginx/temp-cache /opt/nginx/cache/temp /var/cache/nginx/client_temp /var/cache/nginx/fastcgi_temp/ /var/cache/nginx/uwsgi_temp /var/cache/nginx/scgi_temp

ADD index.html /opt/nginx/www/
ADD nginx.conf /etc/nginx/nginx.conf
ADD common.conf /etc/nginx/common.conf

RUN rm /var/log/nginx/* && chmod -R a+rwX ${INSTALL_DIR} /etc/nginx/ /var/log/nginx/ /var/cache/nginx/ /var/run/
USER 9999

WORKDIR /etc/nginx
EXPOSE 8080

CMD ["nginx"]
