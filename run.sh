#!/bin/bash
# Execute server.js, which is output using "next build"

# move all nextjs application to tmp and run it
# because nextjs need to write cache into local directory (ugh, why not in memory)
mkdir -p /tmp/next
cp -r . /tmp/next/
node /tmp/next/server.js