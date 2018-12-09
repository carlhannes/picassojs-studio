git fetch
git checkout master
git pull
git branch -D gh-pages
npm run build
git add build -f
git commit -m "publish gh-pages"
git subtree split --prefix build -b gh-pages
git push -f origin gh-pages:gh-pages
git fetch origin
git branch -D gh-pages
git checkout master
git reset --hard origin/master
