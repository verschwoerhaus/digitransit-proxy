#!/bin/ash

#workaround for azure DNS issue
if [ -n "$MESOS_CONTAINER_NAME"  ]; then 
  echo "search marathon.l4lb.thisdcos.directory" >> /etc/resolv.conf;
fi

#start nginx
nginx
