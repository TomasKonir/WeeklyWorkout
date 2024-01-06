all:
	npm run build
	find build/ -name \*map | xargs rm
	find build/ -name \*LICENSE.txt | xargs rm
	rm -f build/data/*
	gzip -6 -k build/*json
	gzip -6 -k build/static/css/*css
	gzip -6 -k build/static/js/*js
	gzip -6 -k build/static/media/*eot
	gzip -6 -k build/static/media/*ttf
	chmod o+rw build/data
	#./mkrelease.sh

install:
	rsync -avpx --delete --exclude db.sqlite -e ssh build/ www.doma:/var/www/html/www/
