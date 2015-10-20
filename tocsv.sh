#!/bin/bash
sqlite3 -header -csv pc.db "select * from adsl1;" 
