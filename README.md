# Sublime
Sublime has been created for the Liquid Hackathon https://blockstream.com/2019/05/30/en-the-bitcoin-games-liquid-hackathon/.

## Inspiration
We built Sublime to demonstrate how traditional payments companies can benefit from the ability to create assets on a distributed-trust ledger, allowing for the netting of their fiat assets and liabilities. Sublime is a newly built implementation of a system that is in the process of being designed by Epiapi using a fork of Elements. This is the first time that we have used Liquid and we discuss our challenges below.

## Subliminate
_v.intr. Chemistry_
To be transformed directly from the solid to the gaseous state or from the gaseous to the solid state without becoming a liquid.

We chose this name for our project as we think our system will eventually offer fiat money businesses the ability to take their "solid" fiat and instantly convert to an easier to move state taking advantage of Liquid without having to touch the base layer themselves.

## The Team
The team which built Sublime are:

_Duc_ - https://github.com/buimaiduc

_Richard_ - https://github.com/rbensberg

The concept for Sublime was developed by *Richard Bensberg*, CEO at *Epiapi*.

## What it does
Our implementation of Sublime for this hackathon has been developed with a particular scenario in mind, which we describe below. We will discuss what else can be done with the app and also the current limitations. We will then describe potential improvements and our plans for further development. 

Our scenario includes 3 companies and 2 individual users.

**Party A** - is a UK licensed Payments Institution receiving GBP on behalf of its clients

**Party B** - is a US licensed Money Transmission company receiving USD on behalf of its clients

**Party C** - is Epiapi - Party A/B have a contractual agreement with Epiapi and uses its API to query the Liquid blockchain, and to mediate the intercompany settlement of funds. Mutliple options exist for how to manage this but for the purposes of this example we assume that Epiapi has received a $10k bond from each MSO.

**Alice** - is a client of Party A, sending 1000 GBP for conversion to USD for delivery to Carol
  
**Bob** - is a client of Party B, sending 1000 USD for conversion to GBP for delivery to Dan

![Sublime](https://github.com/rbensberg/sublime/blob/master/Sublime.png)

Whilst this particular scenario is very simple, our implementation allows for a large number of Parties to transact using a large number of currencies through a practically unlimited number of assets.

## How we built it
Sublime currently has 3 liquid nodes deployed, connected to bitcoin regtest. The nodes represent:

- US MSO
- UK MSO
- EPIAPI

To simplify the model for this POC we took the following shortcuts:

- Used `regtest` instead of `mainnet`
- Limited to 2 client nodes (select either US MSO or UK MSO from dropdown)
- No limit re: currency pairs w/ licensed jurisdiction
- No interface for running own node (by linking node within our platform)
- Static exchange rates
- No security optimisations (rpc calls to node etc)

A future iteration of Sublime will offer a secure environment to work on `mainnet` allowing MSOs to run their own node to verify transactions and with exchange rates dynamically provided by Epiapi.

We built multiple endpoints to access rpc commands from our app:

- /account
- /assets
- /transfers

Sublime currently works by issuing an asset and transferring it to the issuing party minus the Epiapi issuance fee of 0.1%. Future iterations will allow multisig issuance directly by the MSO with a secondary signature from Epiapi. For the purposes of this demo it is possible to issue 1000 unit of any of the available currencies:

```USD, GBP, EUR, CHF, JPY, CNY```

Future versions will allow issuance of any asset (using multisig as described above), with the 2nd signature being applied according to criteria such as:

Is the issued someone we recognise as a trusted Party?
Is total issued assets > $10000?*
Has the issuer assigned 0.1% of the asset to a epiapi owned address?

Obviously if we withhold the epiapi signature the Party can still issue assets but they will not be recognized by Sublime. 

*There are multiple models as to how the liability limit (in this case $10k) is determined, in this case we assume the party has paid a $10k cash bond.

## How to do it
1. Register a trusted party account at http://sublime-test.epiapi.com/#/sign-up (for the purposes of this test we automatically approve and do not collect any KYC / sign contracts / collect bond)
2. Generate an amount of your chosen asset 
3. Transfer the asset to another participant (for testing use: mso1@epiapi.com or mso2@epiapi.com)

An example of how we envisage this being incorporated in real-time within an existing workflow is included as a Vimeo link. This shows a user depositing GBP10 on Revolut and Epiapi automatically issuing GBP10 as an asset on the platform. By using Sublime, a partner such as Revolut can automatically issue a GBP10 asset which is then immediately interchangeable with other MSOs. __Note: This has been mocked up by us unilaterally using our APIs. Nothing is meant to imply any partnership with Revolut__

## Limitations
Due to the limited time to participate in this hackathon we have limited the scope of what Sublime can do. In addition to small changes to make the system production ready, Sublime can be iterated upon substantially, including:

- HTLCs - locking potential issuance value through bitcoin instead of a fiat bond (similar to Lightning Network)
- Atomic Swaps - to give MSOs more flexibility over the FX conversion
- ...and many more

## Challenges I ran into
The main challenges we ran into were a function of a lack of time. We only had a week to work on this alongside our existing company work. We also had some issues related to lack of Liquid-specific documentation / lack of clarity about how Liquid functionality differs from Elements.

## Accomplishments that I'm proud of
As someone who took an active decision to avoid tokens of all kinds (Etherium/ICOs/Forkcoins/Airdrops/IMOs/IEOs etc etc), and made a decision to pivot from into a more traditional FinTech product when this insanity was appearing to take the upper hand - I'm very excited to take this traditional FinTech experience and reapply it ontop of bitcoin with the intention to improve what we offer to existing clients and new clients processing real multi-million cross-border payments. I am happy that we have been able to create a product focussed on a mesh-network of IOUs rather than a so-called "stablecoin", and am very keen to develop this idea further, which could be seen as `corporate Hawala` or `Fiat Liquid`. This hackathon has given us the impetus and we will be dedicating resources to it after we have completed our next round of funding.

## What I learned
I learnt:

- there is no Liquid testnet but that it can be run ontop of a regtest bitcoin instance. 
- the issuance of assets is unfairly simple(!) :D

## What's next for Sublime
Whilst Sublime is not ready for Production, we will be dedicating resources to working on this concept after we have completed our next round of funding, and intend to offer a version on Liquid and a standalone Elements blockchain.

## Epiapi
Epiapi is a Beijing-based SaaS company offering an openAPI connecting layer (w/ native bitcoin) to a growing "mesh-network" of cross-border financial service companies. Using a standardized protocol for MSOs / local banking networks, we help enterprise clients to offer white-labelled solutions to their userbase, and FinTechs a plug-and-play solution to expand beyond their local market, with minimal overhead. 

Our first product is a USD receivables solution for Chinese merchants selling on Amazon. Through our partner MSO in the US we issue Virtual Bank Accounts used to receive funds which are forwarded to our partner in China to convert to CNY and distribute locally to merchants. Using a bitcoin analogy, we are a (fiat) routing node.

Follow us at: https://medium.com/epiapi
