#!/bin/bash

if [[ $# -eq 0 ]] ; then
    echo "\033[31mInvalid Arguments Exception\033[0m"
    echo "File path in src folder should be provided, like: npm run <script-name> default/index.ts"
    exit 0
fi

FILE_PATH=$1

SOURCE_FOLDER_PREFIX="src/"
INPUT_PATH="$SOURCE_FOLDER_PREFIX${FILE_PATH#"$SOURCE_FOLDER_PREFIX"}"
OUTPUT_PATH="dist/singlerun/index.js"

echo "After compilation TS file ${INPUT_PATH} would be executed by node as JS file in ${OUTPUT_PATH}"
echo ""

tsc $INPUT_PATH --outFile $OUTPUT_PATH && node $OUTPUT_PATH
