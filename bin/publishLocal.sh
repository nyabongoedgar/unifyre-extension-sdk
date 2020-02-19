#!/bin/bash
## declare an array variable

declare -a arr=(
  "../unifyre-native-wallet-components/node_modules/unifyre-extension-sdk/"
  "../unifyre-wallet-core/node_modules/unifyre-extension-sdk/"
  "../unifyre-extension-examples/examples/wyre-widet/node_modules/unifyre-extension-sdk/"
)

echo "Compiling"

./node_modules/typescript/bin/tsc

echo "Compiled"

## now loop through the above array
for path in "${arr[@]}"
do
  echo "copy to $path"
  cp -rf './dist' $path
done

