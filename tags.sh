read -p "Enter version: " VERSION
git tag -fa "$VERSION" -m "version $VERSION"
git push origin --tags 