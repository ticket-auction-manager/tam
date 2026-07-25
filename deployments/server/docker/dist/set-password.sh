#!/bin/sh

read -p "Enter new password: " NEW_PASSWORD
echo "TAM_PWD=${NEW_PASSWORD}" > prod.env
