# SMS Platform
The Semantically Mapping Science (SMS) platform supports access to heterogeneous data on science and innovation, and it supports combining, integrating and analyzing those Data. SMS is one of the facilities in the RISIS project, a distributed data infrastructure for research and innovation dynamics and policy studies.

## Quick Start

###Installation
You should have installed [NodeJS](https://nodejs.org/), [npm](https://github.com/npm/npm), [bower](http://bower.io/) and [GruntJS](http://gruntjs.com/) on your system as prerequisite, then:

Clone the repository: `git clone https://github.com/risis-eu/sms.git`

and simply run `./install` script

###Configuration
Fill in general settings for your application at `configs/general.js`.

Fill in appropriate values for server port, URLs of your SPARQL endpoint and DBpedia lookup service at `configs/server.js`.

Fll in appropriate settings for your UI reactors at `configs/reactor.js`.

Fill in appropriate settings for the faceted browser at `configs/facets.js`.

###Run in Production Mode

`npm run build`

check server at `localhost:4000`

###Development Mode

`npm run dev` or `grunt` or `PORT=4000 DEBUG=* grunt`

## Documentation

Check out http://ld-r.org for detailed documentation.
