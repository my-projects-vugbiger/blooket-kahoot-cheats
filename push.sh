# not reall needed
GITHUB_USERNAME=""
REPO_NAME=""
REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
# main code
COMMIT_MESSAGE="Push from codespace: $(date '+%Y-%m-%d %H:%M:%S')"
BRANCH_NAME="main"
echo "Starting one-time Git publish..."
if [ ! -d .git ]; then
    echo "Initializing new Git repository..."
    git init
fi
echo "Staging all files..."
git add .
echo "Committing with message: '$COMMIT_MESSAGE'"
git commit -m "$COMMIT_MESSAGE" || true
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "Adding remote origin: $REPO_URL"
    git remote add origin "$REPO_URL"
else
    echo "Remote 'origin' is already set."
fi
echo "Pushing committed changes to ${BRANCH_NAME} branch..."
git push -u origin "$BRANCH_NAME"
echo "✅ push complete! Check your GitHub repository."
# commands to push release
# chmod +x push.sh
# ./push.sh