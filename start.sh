#!/bin/sh
#
# Note runlevel 2345, 86 is the Start order and 85 is the Stop order
#
# chkconfig: 2345 86 85
# description: Description of the Service
#
# Below is the source function library, leave it be
#. /etc/init.d/functions

# result of whereis forever or whereis node
export PATH=$PATH:/usr/local/bin
# result of whereis node_modules
export NODE_PATH=$NODE_PATH:/usr/local/lib/node_modules


start(){
        (cd /home/pi/git/pc-gpio/ && exec pm2 start app.js)
}

stop(){
        (cd /home/pi/git/pc-gpio/ && exec pm2 stop 0)
}

restart(){
        (cd /home/pi/git/pc-gpio/ && exec pm2 restart 0)
}

case "$1" in
        start)
                echo "Start service pcgpio"
                start
                ;;
        stop)
                echo "Stop service pcgpio"
                stop
                ;;
        restart)
                echo "Restart service pcgpio"
                restart
                ;;
        *)
                echo "Usage: $0 {start|stop|restart}"
                exit 1
                ;;
esac
