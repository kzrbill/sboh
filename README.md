# SBOh - Service bus overview

Provides top level information about topics, subscription, active and deadletter messages.

## Features

+ Config loader deryptes
+ Service bus topic and subscription overview
+ Message counts
+ Polls api to update UI 
+ Critical red subscriptions when we get a deadletter

## Backlog

+ Delete handled service bus messages in worker.
+ Queries should perform mapping internally and requrn pre-mapped objects.
+ Legacy SB support 1.1 - match signatures to legacy azure ib to adaptor, but underneath, use either latest port or legacy SB.
+ Ensure not re-connecting to SB unecesarilty.
+ Socket.IO events subscripted to optionally monitor 'monitor' subscriptions 
+ UI presentation using Freewall
+ Graph the message count over time.
+ Create monitor subscription if not exists.

## Uses

+ Node Express
+ React
+ Socket.IO
+ Freewall


