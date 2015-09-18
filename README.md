# SBOh - Service bus overview

Provides top level information about topics, subscription, active and deadletter messages.

## Features

+ Config loader deryptes
+ Service bus topic and subscription overview
+ Message counts
+ Polls api to update UI 
+ Critical red subscriptions when we get a deadletter

## Backlog

+ Socket.IO events subscripted to optionally monitor 'monitor' subscriptions 
+ UI presentation using Freewall
+ Graph the message count over time.

## Uses

+ Node Express
+ React
+ Socket.IO
+ Freewall