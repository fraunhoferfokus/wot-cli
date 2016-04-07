# wot-cli

wot-cli is a command-line tool for the web of things. It supports currently advertising and discovery of thing descriptions over SSDP. The tool is work in progress and new features will be added in the future. 

# setup

* install [Node.js](https://nodejs.org/en/download/)
* clone this repository

    ```
    $ git clone https://github.com/fraunhoferfokus/wot-cli.git
    ```
* install dependencies. the tool defines a new command `wot`, this is why the `-g` (global) is needed. on Mac please use `sudo npm install -g`
    ```
    $ cd wot-cli
    $ npm install -g 
    ```
    
# usage

After the tool is installed as described in the setup section, you can run the `wot` command in the console. 

* `$ wot -h` displays the following help:

    ```    
    Usage: wot [options] [command]    
         
          
    Commands:    
          
    search|discover [options] [query]    search for thing descriptions. [query] is not used yet is reserved for future use    
    expose|advertise [options] <TDs...>  expose thing descriptions    
          
    Options:    
           
    -h, --help     output usage information
    -V, --version  output the version number
    ```
    
* `$ wot advertise -h` displays help for the `advertise` command. `expose` is an alias this command.
    ```    
    Usage: expose|advertise [options] <TDs...>     
         
    expose thing descriptions     
        
    Options:    
         
    -h, --help                 output usage information
    -p, --protocol [protocol]  discovery protocol. value: ssdp or mdns     
         
    Examples:     
          
    $ wot expose http://example.org/td1.jsonld http://example.org/td2.jsonld
    $ wot expose -p mdns http://example.org/td.jsonld 
    ```
* `$ wot discover -h` displays help for the `discover` command. `search` is an alias this command.
    ```  
    Usage: search|discover [options] [query]      
         
    search for thing descriptions. [query] is not used yet is reserved for future use      
         
    Options:      
            
    -h, --help                 output usage information      
    -p, --protocol [protocol]  discovery protocol. value: ssdp or mdns     
           
    Examples:     
         
    $ wot search    
    $ wot search -p mdns     
    ```
    
# Example

* install the tool on two computers/Pis in the same network. let say `pc1` and `pc2` are the two computers.
* on `pc1` run `$ wot advertise  http://example.org/td1.jsonld http://example.org/td2.jsonld`. you will see the following output in the console. 
    ```
    start advertising http://example.org/td1.jsonld,http://example.org/td2.jsonld over ssdp
    20:39:55 *** wot ssdp advertiser is ready
    ```
* on `pc2` run `$ wot discover`. you will see the following output in the console. The two thing descriptions advertised in previous step are discovered.
    ```
    start discovery over ssdp
    20:46:23 *** wot ssdp discoverer is ready
    20:46:25 <<< Thing with TD <http://example.org/td1.jsonld> found (192.168.2.104)
    20:46:25 <<< Thing with TD <http://example.org/td2.jsonld> found (192.168.2.104)
    ```
* on `pc1` stop advertising `CTRL+C`. you will see the following output in the console.
    ```
    stop advertising. please wait ...
    20:49:47 *** wot ssdp advertiser stopped
    ```
* on `pc2` you will see the following output in the console after stopping advertising on `pc1`.
    ```
    20:49:45 <<< Thing with TD <http://example.org/td1.jsonld> disappeared (192.168.2.104)
    20:49:45 <<< Thing with TD <http://example.org/td2.jsonld> disappeared (192.168.2.104)
    ```
# contact

Louay Bassbouss - Fraunhofer FOKUS

louay.bassbouss@fokus.fraunhofer.de


# license

[LGPL-3.0](LICENSE)