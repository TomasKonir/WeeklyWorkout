REQUIREMENTS
Needs PHP and SQLITE3 on server, tested with NGINX

INSTALLATION
Unpack release/WeeklyWorkout.tar.zst to webserver folder

BUILD
npm run build
Than copy content of build/ folder whenever you want.

NOTES
Tested under nginx, with config like below (need to pass TLS variables to PHP)
Should work under properly configured apache too

#nginx config
geo $from_home {
        default       0;
        192.168.0.0/16 1;
}

server {
    listen 443 ssl http2 default_server;
    listen [::]:443 ssl default_server;
    ssl_certificate     /etc/letsencrypt/live/somewhere/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/somewhere/web.pem;
    ssl_client_certificate /etc/nginx/private.CA.crt;
    ssl_verify_client optional;
    set $allow_from_home $ssl_client_verify;

    if ( $from_home ){
        set $allow_from_home "SUCCESS";
    }

    root /var/www/html;

    # Add index.php to the list if you are using PHP
    index index.html index.php;

    server_name _;

    location /weekly-workout/ {
                if ($ssl_client_verify != "SUCCESS"){
                        return 403;
                }
                location ~ \.php$ {
                        if ($ssl_client_verify != "SUCCESS"){
                                return 403;
                        }
                        include snippets/fastcgi-php.conf;
                        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
                        fastcgi_split_path_info ^(.+\.php)(/.+)$;
                        include fastcgi_params;
                        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
                        fastcgi_param PATH_INFO $fastcgi_path_info;
                        fastcgi_param TLS_CLIENT_VERIFIED $ssl_client_verify;
                        fastcgi_param TLS_CLIENT_DN $ssl_client_s_dn;
                }
                location /weekly-workout/data/ {
                        deny all;
                        return 404;
                }
        }
}
