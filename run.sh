#!/bin/ash

set -e
#workaround for azure DNS issue
if [ -n "$MESOS_CONTAINER_NAME"  ]; then 
  echo "search marathon.l4lb.thisdcos.directory" >> /etc/resolv.conf;
fi


for i in /etc/nginx/*.tmpl; do
    [ -f "$i" ] || break
    envsubst < "$i" > "${i/.tmpl/.conf}"
done

#start nginx
nginx
