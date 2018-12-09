git fetch origin
git checkout gh-pages 
git pull origin gh-pages
git checkout master
git add build -f
git commit -m "publish gh-pages"
git subtree push --prefix build origin gh-pages
git fetch origin
git reset --hard origin/master
