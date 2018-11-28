#!/bin/ash

set -e
#workaround for azure DNS issue
if [ -n "$MESOS_CONTAINER_NAME"  ]; then 
  echo "search marathon.l4lb.thisdcos.directory" >> /etc/resolv.conf;
fi

sed -i "s/LISSU_BASIC_AUTH/${LISSU_BASIC_AUTH}/" /etc/nginx/external.conf

#start nginx
nginx
