git config --global user.email "lisowski54@gmail.com"
git config --global user.name "Andrew Lisowski"

chmod +x ./dist/bin/auto.js
export PATH=$(npm bin):$PATH

./dist/bin/auto.js shipit