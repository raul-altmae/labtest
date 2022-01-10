# WE Drupal Starter Kit

## Setup
### Requirements
* Nodejs > 10
#### 1. Install NPM
```
npm i
```
#### 2. Start
Creates theme and copies required assets to theme folder
```
npm start
```

#### 3. Build
Runs prettier, copies assets and builds SCSS & JS
```
npm run build
```

#### 4. Set up Drupal
Pass php (or php alias) in as an argument (requires >=php7.3)
```
sh init.sh php
```

## Development

#### Watch SCSS & JS
```
gulp watch
```

#### Copy assets
```
gulp assets
```

#### Install NPM assets to libraries folder via composer
```
composer require npm-asset/asset_name
```
