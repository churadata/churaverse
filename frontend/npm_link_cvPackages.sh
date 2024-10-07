#!/bin/bash
# package_pathsのファイルに書かれたパスをnpm linkする
# package_pathsパスはcvPackagesがルートの想定

echo "start link package"
package_root="../../cvPackages"
package_paths="./npm_link_cvPackages_path.txt"

paths=""
while IFS= read -r line || [ "$line" ]; do
    paths="${paths} ${package_root}/${line}"
done < ${package_paths}
npm install ${paths}
echo "finish link package"