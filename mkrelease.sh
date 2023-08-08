#!/bin/bash

pushd build
tar -c . | zstd -6 >../release/WeeklyWorkout.tar.zst
popd
