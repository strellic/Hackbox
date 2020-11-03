FROM phusion/baseimage:bionic-1.0.0

RUN apt-get -y update
RUN apt-get -y install nginx php-fpm curl nano sudo

RUN echo '#!/bin/sh\n/usr/sbin/service php7.2-fpm start\n/usr/sbin/nginx' > /etc/my_init.d/20_nginx_init.sh
RUN chmod +x /etc/my_init.d/20_nginx_init.sh

COPY default.conf /etc/nginx/sites-enabled/default

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

CMD ["/sbin/my_init"]
