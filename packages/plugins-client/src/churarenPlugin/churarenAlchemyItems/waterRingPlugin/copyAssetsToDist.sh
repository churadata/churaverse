#!/bin/bash

# コピー元の基本パス
src_base="."
# コピー先の基本パス
dest_base="dist"

# コピー元のパスを検索し、それぞれに対して処理を実行
find "$src_base" -type d -name 'assets' | while read src_dir; do
    # 対応するコピー先のディレクトリパスを生成
    dest_dir="${src_dir/$src_base/$dest_base}"
    # コピー元が dest_base ならスキップする処理
    if [[ "$src_dir" == *"$dest_base"* ]]; then
        continue
    fi
    # コピー先のディレクトリがなければ作成
    mkdir -p "$dest_dir"
    # ファイルをコピー先にコピー
    cp -r "$src_dir/"* "$dest_dir"
done

echo "copied asset files"

# コピー元のパスを検索し、それぞれに対して処理を実行
find "$src_base" -type f -name '*.scss' | while read src_file; do
    # 対応するコピー先のファイルパスを生成
    dest_file="${src_file/$src_base/$dest_base}"
    # コピー元が dest_base ならスキップする処理
    if [[ "$src_file" == *"$dest_base"* ]]; then
        continue
    fi
    # コピー先のディレクトリを取得
    dest_dir=$(dirname "$dest_file")
    # コピー先のディレクトリがなければ作成
    mkdir -p "$dest_dir"
    # ファイルをコピー先にコピー
    cp "$src_file" "$dest_file"
done

echo "コピー完了"
