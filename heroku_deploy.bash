#!/bin/bash

echo '{}' > composer.json
echo '<?php include_once("home.html"); ?>' > index.php
mv index.html home.html