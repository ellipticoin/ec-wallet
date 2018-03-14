EC Wallet
=========


The [Elipticoin](https://github.com/elipticoin/elipticoin) wallet.

Usage
=========

    $ npm install -g ec-wallet
    $ ec-wallet init
    Creating /Users/masonf/.ec-wallet/config.yaml
    Initialization done. Your elipticoin address is stumble-canoe-27
    $ ec-wallet balance
    Balance of stumble-canoe-27
    0
    // ... ask someone to send you some coins
    $ ec-wallet balance
    Balance of stumble-canoe-27
    5.0000
    $ ec-wallet send clown-trap-632 20
    Transferred 20 to clown-trap-632
    $ ec-wallet balance
    Balance of stumble-canoe-27
    480.0000
