#! /bin/sh
[ ! -d dist ] && mkdir dist
zip -r dist/showpasswords.zip src
return $?
