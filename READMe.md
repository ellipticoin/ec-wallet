EC Wallet
=========


The [Elipticoin](https://github.com/elipticoin/elipticoin) wallet.

Usage
=========

    $ npm install -g ec-wallet
    $ ec-wallet init
    Creating /Users/masonf/.ec-wallet/config.yaml
    Initialization done. Your elipticoin address is yUAraey+BrL5mBmtBESwhSvWI4+Ch4yTcjf/+diS3yE=
    $ ec-wallet balance
    Balance of yUAraey+BrL5mBmtBESwhSvWI4+Ch4yTcjf/+diS3yE=
    0
    // ... ask someone to send you some coins
    $ ec-wallet balance
    Balance of yUAraey+BrL5mBmtBESwhSvWI4+Ch4yTcjf/+diS3yE=
    500
    $ ec-wallet send 20 YDdJmeyj5zMniwNIU58CTfyXvTqce080Pn7s/OwkhQE=
    Transferred 3 to YDdJmeyj5zMniwNIU58CTfyXvTqce080Pn7s/OwkhQE=
    $ ec-wallet balance
    Balance of yUAraey+BrL5mBmtBESwhSvWI4+Ch4yTcjf/+diS3yE=
    480
