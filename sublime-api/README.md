# sublime-api

#esplora
- As the esplora is using the old dependencies, so we will need to hacks to get the react app running

+ Install nodejs & npm
https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/
+ Create binding.gyp file and put it into root, client folders
{
    "targets": [
    {
        "target_name": "binding",
        "sources": [ "build/Release/binding.node" ]
    }
    ]
}
+ Export the PKG_CONFIG_PATH before install qruri
export PKG_CONFIG_PATH="/usr/local/opt/libffi/lib/pkgconfig"
https://github.com/otrv4/pidgin-otrng/issues/104
+ sudo apt-get install libcairo2-dev libjpeg-dev libgif-dev
https://stackoverflow.com/questions/22100213/package-cairo-was-not-found-in-the-pkg-config-search-path-node-j-s-install-canv
+ npm i qruri
+ npm install --save-dev babelify @babel/core
+ npm install envify browserify
+ npm install uglifyify
+ cd client && sudo npm install
