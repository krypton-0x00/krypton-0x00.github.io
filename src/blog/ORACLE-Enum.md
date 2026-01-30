# Enumerating Oracle

Oracle TNS (Transparent Network Substrate) is used to **connect** a client (like a programmer's computer) to an Oracle database **over a network**.


**PORT**: 1521 

## Nmap - Version Detection
```sh
sudo nmap -p1521 -sV 10.129.204.235 --open
```

## Nmap - SID Bruteforcing
Now lets try to enumerate the SID of the database.
```sh
sudo nmap -p1521 -sV 10.129.204.235 --open --script oracle-sid-brute
```

## ODAT
ODAT is an info gathering tool.

```sh
./odat.py all -s 10.129.204.235
```
This will enumerate the database, users, and more.

## SQLplus - Log In

lets say we go with `scott/tiger`. from the ODAT output we can see that the SID is `XE`.

```sh
sqlplus scott/tiger@10.129.204.235/XE
```

## Oracle RDBMS - Database Enumeration

```sh
sqlplus scott/tiger@10.129.204.235/XE as sysdba
```


# Default Paths 
| **OS**  | **Path**             |
| ------- | -------------------- |
| Linux   | `/var/www/html`      |
| Windows | `C:\inetpub\wwwroot` |


## Oracle RDBMS - File Upload

Now we can upload a file to the web server.

```sh
./odat.py utlfile -s 10.129.204.235 -d XE -U scott -P tiger --sysdba --putFile C:\\inetpub\\wwwroot testing.txt ./testing.txt
```