#!/bin/sh
curl -s http://localhost:8080/api/admin/settings/:CVocConf -X PUT --upload-file examples/config/cvoc-conf.json 
