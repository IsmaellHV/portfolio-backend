#!/bin/bash

####
# Tiny shell script for terser any JavaScript project
# usage:
# ./terser_path <path_to_your_project>
####

path="$1"

find $path -name '*.js' -type f | while read f
do
    folderpath=$(dirname "$f")
    filename=$(basename "$f") 
    extension="${filename##*.}"
    filename="${filename%.*}"
    nf=$folderpath/$filename.$extension

# ----- METHOD 1 : Replace the old file
#    terser "$f" --output "$f" --compress --mangle
# ----- METHOD 2 : Create .min.js file
    terser "$f" --output "$nf" --compress --mangle
    echo "$nf"
     
done